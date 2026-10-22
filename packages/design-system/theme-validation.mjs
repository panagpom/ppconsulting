export const colorRoles = [
  'surface',
  'textPrimary',
  'textMuted',
  'brandAccent',
  'border',
  'controlBorder',
  'focus',
  'actionPrimary',
  'actionHover',
  'onAction',
  'feedbackError',
  'feedbackSuccess',
  'errorSurface',
  'successSurface',
  'surfaceMuted',
  'noticeSurface',
  'noticeBorder',
  'inverseMuted',
  'artBase',
  'artSun',
  'artLine',
  'artStart',
  'artEnd',
  'artShadow',
  'artLight',
  'artFloor',
  'panel',
  'panelLine',
  'panelMark',
  'storyBase',
  'storyShape',
  'storySun',
  'storyAlternate',
  'storyAlternateShape',
];
export function contrast(first, second) {
  const luminance = (hex) => {
    const values = hex
      .slice(1)
      .match(/../g)
      .map((v) => parseInt(v, 16) / 255)
      .map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
    return values[0] * 0.2126 + values[1] * 0.7152 + values[2] * 0.0722;
  };
  const a = luminance(first),
    b = luminance(second);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}
export function validateTheme(theme) {
  if (
    typeof theme.label !== 'string' ||
    !theme.label.trim() ||
    typeof theme.description !== 'string' ||
    !theme.description.trim()
  )
    throw Error('Theme needs a label and description');
  if (!Object.keys(theme.primitiveColors || {}).length) throw Error('Theme needs primitive colors');
  for (const [name, value] of Object.entries(theme.primitiveColors))
    if (!/^[a-zA-Z][a-zA-Z0-9]*$/.test(name) || !/^#[0-9a-f]{6}$/i.test(value))
      throw Error('Invalid primitive color: ' + name);
  for (const role of colorRoles)
    if (!theme.primitiveColors[theme.semanticColors?.[role]])
      throw Error('Missing semantic color: ' + role);
  for (const role of ['heading', 'body', 'greekHeading', 'greekBody'])
    if (
      typeof theme.fonts?.[role] !== 'string' ||
      !theme.fonts[role] ||
      /[;{}<>]/.test(theme.fonts[role])
    )
      throw Error('Invalid font stack: ' + role);
  if (!/^\d{1,2}px$/.test(theme.radius)) throw Error('Radius must be between 0 and 99px');
  for (const key of ['sectionSpace', 'mobileSectionSpace'])
    if (!Number.isInteger(theme[key]) || theme[key] < 48 || theme[key] > 160 || theme[key] % 8)
      throw Error('Section spacing must use the 8px scale, 48–160px');
  if (
    !['split', 'centered'].includes(theme.layout?.hero) ||
    !['plain', 'surface'].includes(theme.layout?.card)
  )
    throw Error('Invalid component layout');
  const color = (role) => theme.primitiveColors[theme.semanticColors[role]];
  for (const [fg, bg, min] of [
    ['textPrimary', 'surface', 4.5],
    ['textMuted', 'surface', 4.5],
    ['textPrimary', 'surfaceMuted', 4.5],
    ['textMuted', 'surfaceMuted', 4.5],
    ['brandAccent', 'surface', 4.5],
    ['brandAccent', 'surfaceMuted', 4.5],
    ['onAction', 'actionPrimary', 4.5],
    ['onAction', 'actionHover', 4.5],
    ['surface', 'textPrimary', 4.5],
    ['feedbackError', 'errorSurface', 4.5],
    ['feedbackSuccess', 'successSurface', 4.5],
    ['controlBorder', 'surface', 3],
    ['controlBorder', 'surfaceMuted', 3],
    ['focus', 'surface', 3],
  ])
    if (contrast(color(fg), color(bg)) < min)
      throw Error('Insufficient contrast: ' + fg + ' / ' + bg);
  if(theme.semanticColors.lightSurface){
    for(const role of ['lightSurface','lightSurfaceMuted','lightTextPrimary','lightTextMuted','lightEyebrowText','lightAccent','lightFocus','lightBorder','lightControlBorder','lightNoticeSurface','lightNoticeBorder'])
      if(!theme.primitiveColors[theme.semanticColors[role]])throw Error('Missing light semantic color: '+role);
    for(const bg of ['lightSurface','lightSurfaceMuted'])for(const fg of ['lightTextPrimary','lightTextMuted','lightEyebrowText','lightAccent'])
      if(contrast(color(fg),color(bg))<4.5)throw Error('Insufficient contrast: '+fg+' / '+bg);
  }
  return theme;
}
