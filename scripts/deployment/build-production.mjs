import {randomUUID} from 'node:crypto';
import {lstatSync, mkdirSync, readFileSync, renameSync, unlinkSync, writeFileSync} from 'node:fs';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {parseProject} from '../../packages/config/project.mjs';
import {withConfigureLock} from '../configure-safety.mjs';
import {runOwnedCommand} from '../owned-command.mjs';
import {createWorkerConfig} from '../worker-config.mjs';
import {parseProductionTarget} from './production.mjs';
import {regularBytes, regularTree, sanitizedBuildEnv, snapshotReleaseInputs} from './release-inputs.mjs';

const targetFile = 'scripts/deployment/informational-target.json';

export function createInformationalConfig(input, source, runDirectory) {
  const target = parseProductionTarget(input, source);
  const {project} = target;
  const infrastructure = project.infrastructure;
  if (infrastructure.publicFormsEnabled || infrastructure.sendingEnabled || infrastructure.marketingEnabled) {
    throw Error('The informational build requires public forms and delivery to be disabled.');
  }
  if (!/^https:\/\/[a-z0-9-]+\.cloudflareaccess\.com$/.test(infrastructure.accessIssuer)
    || !/^[a-f0-9]{64}$/.test(infrastructure.accessAudience) || !infrastructure.adminEmails.length) {
    throw Error('Configure the production Cloudflare Access issuer, audience and administrators.');
  }
  const base = createWorkerConfig(project, {siteUrl: '', workerUrl: '', tinaUrl: ''}, target);
  const {name, account_id, compatibility_date, compatibility_flags, workers_dev, preview_urls, routes} = base;
  const {ENVIRONMENT, ACCESS_ISSUER, ACCESS_AUDIENCE, ADMIN_EMAILS, EDITOR_EMAILS} = base.vars;
  return {
    name, account_id, compatibility_date, compatibility_flags, workers_dev, preview_urls, routes,
    main: runDirectory + '/worker/cms.ts',
    assets: {
      ...base.assets,
      directory: runDirectory + '/apps/site/dist',
      run_worker_first: ['/cms', '/cms/*'],
    },
    vars: {ENVIRONMENT, ACCESS_ISSUER, ACCESS_AUDIENCE, ADMIN_EMAILS, EDITOR_EMAILS},
  };
}

async function buildProduction(root, sourceEnv) {
  const {npm_execpath: pnpm, TINA_CLIENT_ID, TINA_TOKEN} = sourceEnv;
  if (!pnpm || !/^pnpm\.(c?js)$/.test(pnpm.split(/[\\/]/).at(-1))) {
    throw Error('Run build:production with pnpm 10.13.1.');
  }
  if (!TINA_CLIENT_ID || !TINA_TOKEN) {
    throw Error('Set TINA_CLIENT_ID and the read-only TINA_TOKEN in the build environment.');
  }
  if (!['22', '24'].includes(process.versions.node.split('.')[0])) {
    throw Error('The production build requires Node 22 or 24.');
  }
  await withConfigureLock(root, async () => {
    const snapshot = snapshotReleaseInputs(root);
    const input = JSON.parse(snapshot.files.get(targetFile).bytes);
    const source = parseProject(JSON.parse(snapshot.files.get('project.json').bytes));
    const target = parseProductionTarget(input, source);
    const run = 'run-' + randomUUID();
    const config = createInformationalConfig(input, source, run);
    const output = join(root, '.generated/production');
    mkdirSync(output, {recursive: true});
    const stat = lstatSync(output);
    if (!stat.isDirectory() || stat.isSymbolicLink()) throw Error('Unsafe production output directory.');
    const destination = join(output, 'wrangler.json');
    if (lstatSync(destination, {throwIfNoEntry: false})) unlinkSync(destination);
    const workspace = join(output, run);
    for (const [path, file] of snapshot.files) {
      const destination = join(workspace, path);
      mkdirSync(dirname(destination), {recursive: true});
      writeFileSync(destination, path === 'project.json' ? JSON.stringify(target.project, null, 2) + '\n' : file.bytes, {flag: 'wx'});
    }
    const env = sanitizedBuildEnv(sourceEnv, workspace);
    for (const folder of [env.HOME, env.APPDATA, env.LOCALAPPDATA, env.XDG_CONFIG_HOME, env.TEMP]) {
      mkdirSync(folder, {recursive: true});
    }
    writeFileSync(env.npm_config_userconfig, '');
    writeFileSync(env.npm_config_globalconfig, '');
    const command = (args, options = {}) => runOwnedCommand(process.execPath, args, {
      cwd: workspace, env, timeoutMs: 600000,
      onOutput: (text, channel) => process[channel].write(text),
      ...options,
    });
    const version = await command([pnpm, '--version']);
    if (version.stdout.trim() !== '10.13.1') throw Error('The production build requires pnpm 10.13.1.');
    await command([pnpm, 'install', '--frozen-lockfile']);
    await command([pnpm, 'build']);
    const cms = join(workspace, 'apps/site/public/cms');
    let tinaOutput = '';
    try {
      await command([join(workspace, 'node_modules/@tinacms/cli/bin/tinacms'), 'build',
        '--noTelemetry', '--skip-indexing', '--skip-search-index'], {
        env: {...env, TINA_CLIENT_ID, TINA_TOKEN, TINA_BRANCH: 'main'},
        onOutput: text => { tinaOutput = (tinaOutput + text).slice(-65536); },
      });
    } finally {
      process.stdout.write(tinaOutput.replaceAll(TINA_TOKEN, '[redacted]'));
    }
    const entry = readFileSync(join(cms, 'index.html'), 'utf8');
    const bundle = entry.match(/src="\/cms\/(assets\/[^"]+\.js)"/)?.[1];
    if (!bundle || !regularBytes(cms, bundle).includes(Buffer.from(TINA_CLIENT_ID))) {
      throw Error('The Tina output does not contain the hosted editor for this project.');
    }
    const assets = join(workspace, 'apps/site/dist');
    renameSync(cms, join(assets, 'cms'));
    for (const file of Object.keys(regularTree(assets))) {
      const bytes = regularBytes(assets, file);
      if (bytes.includes(Buffer.from(TINA_TOKEN))) throw Error('A Tina credential was found in deployable assets.');
      if (!file.startsWith('cms/') && file.endsWith('.html')
        && /<form\b[^>]*(?:\bid="contact-form"|\bdata-newsletter-form)/.test(bytes.toString())) {
        throw Error('Unexpected public form in ' + file);
      }
    }
    const draft = join(output, 'wrangler.' + run + '.json');
    try {
      writeFileSync(draft, JSON.stringify(config, null, 2) + '\n', {flag: 'wx'});
      await command([join(workspace, 'node_modules/wrangler/bin/wrangler.js'), 'deploy',
        '--dry-run', '--config', draft, '--outdir', join(workspace, '.generated/worker-check')]);
      snapshot.assertUnchanged();
      renameSync(draft, destination);
    } finally {
      if (lstatSync(draft, {throwIfNoEntry: false})) unlinkSync(draft);
    }
    console.log('Production package verified at .generated/production/wrangler.json');
  });
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  try {
    await buildProduction(fileURLToPath(new URL('../../', import.meta.url)), process.env);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
