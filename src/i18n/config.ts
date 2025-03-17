export type Locale = (typeof locales)[number];

export const locales = ['qr','uz', 'en','ru',] as const;
export const defaultLocale: Locale = 'uz';