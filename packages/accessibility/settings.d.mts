import type {ZodType} from 'zod';
export interface AccessibilitySettings {enabled:boolean;position:'right-middle'|'right-bottom'}
export const accessibilitySettingsSchema:ZodType<AccessibilitySettings>;
