import { readFileSync, readdirSync } from 'node:fs';
const folder = new URL('./themes/', import.meta.url);
export const themes = Object.fromEntries(
  readdirSync(folder)
    .filter((f) => f.endsWith('.json'))
    .map((file) => [file.slice(0, -5), JSON.parse(readFileSync(new URL(file, folder), 'utf8'))]),
);
export {colorRoles,contrast,validateTheme} from './theme-validation.mjs';
import {validateTheme} from './theme-validation.mjs';
export function validateDesign(design) {
  if (!design || !themes[design.theme]) throw Error('Choose an existing design theme');
  if (!['comfortable', 'compact', 'spacious'].includes(design.density))
    throw Error('Invalid design density');
  return design;
}
export function themeByName(name) {
  const theme = themes[name];
  if (!theme) throw Error('Unknown theme: ' + name);
  return validateTheme(theme);
}
export const kebab = (value) => value.replace(/[A-Z]/g, (c) => '-' + c.toLowerCase());
export function themeCSS(name, theme) {
  if (!/^[a-z][a-z0-9-]*$/.test(name)) throw Error('Invalid theme name');
  validateTheme(theme);
  const declarations = [
    ...Object.entries(theme.primitiveColors).map(
      ([key, value]) => '--palette-' + kebab(key) + ': ' + value + ';',
    ),
    ...Object.entries(theme.semanticColors).map(
      ([key, value]) => '--color-' + kebab(key) + ': var(--palette-' + kebab(value) + ');',
    ),
    ...Object.entries(theme.fonts).map(
      ([key, value]) => '--font-' + kebab(key) + ': ' + value + ';',
    ),
    '--radius-control: ' + theme.radius + ';',
    '--section-space: ' + theme.sectionSpace + 'px;',
    '--section-space-mobile: ' + theme.mobileSectionSpace + 'px;',
    '--hero-columns: ' + (theme.layout.hero === 'split' ? '1.22fr 1fr' : '1fr') + ';',
    '--hero-align: ' + (theme.layout.hero === 'split' ? 'start' : 'center') + ';',
    '--hero-copy-margin: ' + (theme.layout.hero === 'split' ? '0' : 'auto') + ';',
    '--hero-action-align: ' + (theme.layout.hero === 'split' ? 'start' : 'center') + ';',
    '--hero-media-width: ' + (theme.layout.hero === 'split' ? '100%' : 'min(720px,100%)') + ';',
    '--card-bg: ' +
      (theme.layout.card === 'plain' ? 'transparent' : 'var(--color-surface-muted)') +
      ';',
    '--card-border-width: ' + (theme.layout.card === 'plain' ? '1px 0 0' : '1px') + ';',
    '--card-padding: ' +
      (theme.layout.card === 'plain' ? 'var(--space-6) 0 0' : 'var(--space-6)') +
      ';',
  ];
  return (
    (name === 'neutral' ? ':root, ' : '') +
    'html[data-theme="' +
    name +
    '"] {\n' +
    declarations.map((s) => '  ' + s).join('\n') +
    '\n}\n'
  );
}
