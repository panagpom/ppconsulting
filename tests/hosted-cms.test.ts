import { expect, it, vi } from 'vitest';
import cms from '../worker/cms';
import type { CmsEnvironment } from '../worker/cms';
import { editor, HttpError } from '../worker/security';
import { readFileSync } from 'node:fs';
import { parseProject } from '../packages/config/project.mjs';
import { createInformationalConfig } from '../scripts/deployment/build-production.mjs';

vi.mock('../worker/security', async (importOriginal) => ({
  ...await importOriginal<typeof import('../worker/security')>(),
  editor: vi.fn(),
}));

it('packages only the informational site and Access-protected editor', () => {
  const project = parseProject(JSON.parse(readFileSync('project.json', 'utf8')));
  const input = {
    format: 1, application: project.name, target: 'production',
    accountId: '1234567890abcdef1234567890abcdef', siteUrl: 'https://example.org',
    infrastructure: {
      publicFormsEnabled: false, accessIssuer: 'https://team.cloudflareaccess.com',
      accessAudience: 'a'.repeat(64), adminEmails: ['admin@example.org'],
    },
  };
  const config = createInformationalConfig(input, project, 'run-test');
  expect(config.name).toBe(project.name + '-production');
  expect(config.main).toBe('run-test/worker/cms.ts');
  expect(config.routes).toEqual([{pattern: 'example.org', custom_domain: true}]);
  expect(config.assets).toMatchObject({
    directory: 'run-test/apps/site/dist', run_worker_first: ['/cms', '/cms/*'],
  });
  expect(config).not.toHaveProperty('d1_databases');
  expect(config).not.toHaveProperty('queues');
  for (const flag of ['publicFormsEnabled', 'sendingEnabled', 'marketingEnabled']) {
    expect(() => createInformationalConfig({
      ...input, infrastructure: {...input.infrastructure, [flag]: true},
    }, project, 'run-test')).toThrow(/informational/i);
  }
  expect(() => createInformationalConfig({
    ...input, infrastructure: {...input.infrastructure, adminEmails: []},
  }, project, 'run-test')).toThrow(/Access/);
});

it('only serves the hosted editor to authorized requests and replaces its inherited CSP', async () => {
  const fetchAsset = vi.fn(async () => new Response('editor', {headers:{
    'Content-Security-Policy': "default-src 'self'",
    'Content-Security-Policy-Report-Only': "default-src 'none'",
  }}));
  const env = {ENVIRONMENT:'production',ASSETS:{fetch:fetchAsset}} as unknown as CmsEnvironment;

  vi.mocked(editor).mockRejectedValueOnce(new HttpError(403,'Editor access is required.'));
  const request = new Request('https://ppconsulting.cc/cms/index.html');
  const denied = await cms.fetch(request,env);
  expect(denied.status).toBe(403);
  expect(fetchAsset).not.toHaveBeenCalled();

  vi.mocked(editor).mockResolvedValueOnce('editor@example.com');
  const allowed = await cms.fetch(request,env);
  expect(await allowed.text()).toBe('editor');
  expect(allowed.headers.get('Content-Security-Policy')).toContain('https://*.tinajs.io');
  expect(allowed.headers.get('Content-Security-Policy-Report-Only')).toBeNull();
  expect(allowed.headers.get('Cache-Control')).toBe('no-store');

  const publicRequest = new Request('https://ppconsulting.cc/el');
  await cms.fetch(publicRequest,env);
  expect(editor).toHaveBeenCalledTimes(2);
  expect(fetchAsset).toHaveBeenLastCalledWith(publicRequest);
});
