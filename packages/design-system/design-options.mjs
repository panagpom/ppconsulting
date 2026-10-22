export const designOptionDefaults = {
  typography: {
    bodySize: 16,
    labelSize: 14,
    captionSize: 12,
    emphasisScale: 0.88,
    emphasisOpacity: 0.8,
    headings: {
      hero: {
        minRem: 3.3,
        fluidVw: 6.5,
        maxRem: 5.8,
      },
      heroMobile: {
        minRem: 2.75,
        fluidVw: 10.6,
        maxRem: 4,
      },
      section: {
        minRem: 2.6,
        fluidVw: 4.7,
        maxRem: 4.1,
      },
      sectionMobile: {
        minRem: 2.25,
        fluidVw: 8,
        maxRem: 3,
      },
      page: {
        minRem: 3,
        fluidVw: 6.5,
        maxRem: 5.5,
      },
    },
  },
  eyebrows: {
    treatment: 'rule',
    fontSize: 14,
    fontWeight: 500,
    trackingEm: 0.02,
    rule: true,
    ruleWidth: 24,
    gap: 12,
    casing: 'natural',
  },
  dividers: {
    sections: false,
    serviceRows: true,
    faqItems: true,
    footer: true,
  },
  footer: {
    topPadding: 32,
    columnGap: 64,
    rowGap: 32,
    linkGap: 8,
  },
};

const invalid = (path) => {
  throw Error('Invalid design ' + path);
};
const object = (value, path) => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) invalid(path);
};
const number =
  (token, min, max, unit = '', step) =>
  (value, path) => {
    if (
      typeof value !== 'number' ||
      !Number.isFinite(value) ||
      value < min ||
      value > max ||
      (step && Math.abs(value / step - Math.round(value / step)) > 1e-8)
    )
      invalid(path);
    return token + ': ' + (typeof unit === 'function' ? unit(value) : value + unit) + ';';
  };
const boolean = (token, on, off) => (value, path) => {
  if (typeof value !== 'boolean') invalid(path);
  return token + ': ' + (value ? on : off) + ';';
};
const choice =
  (token, values, type = 'string') =>
  (value, path) => {
    if (typeof value !== type || !Object.hasOwn(values, value)) invalid(path);
    return token + ': ' + values[value] + ';';
  };
const headings = {
  hero: '--heading-editorial-display',
  heroMobile: '--heading-editorial-mobile',
  section: '--heading-editorial-section',
  sectionMobile: '--heading-editorial-section-mobile',
  page: '--heading-page',
};
function headingDeclarations(value, path) {
  object(value, path);
  return Object.entries(value).map(([name, scale]) => {
    if (!Object.hasOwn(headings, name)) invalid(path + '.' + name);
    object(scale, path + '.' + name);
    if (
      Object.keys(scale).length !== 3 ||
      !['minRem', 'fluidVw', 'maxRem'].every((key) => Object.hasOwn(scale, key))
    )
      invalid(path + '.' + name);
    number('', 2, 8)(scale.minRem, path + '.' + name + '.minRem');
    number('', 1, 15)(scale.fluidVw, path + '.' + name + '.fluidVw');
    number('', scale.minRem, 8)(scale.maxRem, path + '.' + name + '.maxRem');
    return (
      headings[name] +
      ': clamp(' +
      scale.minRem +
      'rem, ' +
      scale.fluidVw +
      'vw, ' +
      scale.maxRem +
      'rem);'
    );
  });
}
const fields = {
  typography: {
    bodySize: number('--type-body', 16, 24, (value) => value / 16 + 'rem', 1),
    labelSize: number('--type-label', 14, 20, (value) => value / 16 + 'rem', 1),
    captionSize: number('--type-caption', 12, 16, (value) => value / 16 + 'rem', 1),
    emphasisScale: number('--emphasis-font-size', 0.75, 0.98, 'em'),
    emphasisOpacity: number('--emphasis-opacity', 0.7, 1),
    headings: headingDeclarations,
  },
  eyebrows: {
    treatment: choice('--eyebrow-treatment', { rule: 'rule', 'soft-highlight': 'soft-highlight' }),
    mobileFontSize: number('--eyebrow-font-size-mobile', 14, 20, (value) => value / 16 + 'rem', 1),
    fontSize: number('--eyebrow-font-size', 14, 20, (value) => value / 16 + 'rem', 1),
    fontWeight: choice(
      '--eyebrow-font-weight',
      { 400: '400', 500: '500', 600: '600', 700: '700' },
      'number',
    ),
    trackingEm: number('--eyebrow-tracking', 0, 0.12, 'em'),
    rule: boolean('--eyebrow-rule-display', 'block', 'none'),
    ruleWidth: number('--eyebrow-rule-width', 8, 48, 'px', 4),
    gap: number('--eyebrow-gap', 8, 24, 'px', 4),
    casing: choice('--eyebrow-text-transform', { natural: 'none', uppercase: 'uppercase' }),
  },
  dividers: {
    sections: boolean('--divider-section-width', '1px', '0px'),
    serviceRows: boolean('--divider-service-width', '1px', '0px'),
    faqItems: boolean('--divider-faq-width', '1px', '0px'),
    footer: boolean('--divider-footer-width', '1px', '0px'),
  },
  footer: {
    topPadding: number('--footer-top-padding', 16, 96, 'px', 8),
    columnGap: number('--footer-column-gap', 24, 96, 'px', 8),
    rowGap: number('--footer-row-gap', 16, 64, 'px', 8),
    linkGap: number('--footer-link-gap', 8, 24, 'px', 4),
  },
};
export function designOptionDeclarations(design) {
  const declarations = [];
  const allowed = new Set(['theme', 'density', 'radius', ...Object.keys(fields)]);
  for (const key of Object.keys(design)) if (!allowed.has(key)) invalid(key);
  for (const [group, validators] of Object.entries(fields)) {
    if (design[group] === undefined) continue;
    object(design[group], group);
    for (const [key, value] of Object.entries(design[group])) {
      if (!Object.hasOwn(validators, key)) invalid(group + '.' + key);
      declarations.push(...[validators[key](value, group + '.' + key)].flat());
    }
  }
  return declarations;
}
