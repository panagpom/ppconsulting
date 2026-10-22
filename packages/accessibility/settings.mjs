import {z} from 'zod';
export const accessibilitySettingsSchema=z.strictObject({enabled:z.boolean().default(false),position:z.enum(['right-middle','right-bottom']).default('right-middle')});
