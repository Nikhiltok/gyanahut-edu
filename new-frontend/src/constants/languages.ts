// Central registry of supported app languages. To add a new language:
// 1. Create src/messages/<code>.json with the same keys as en.json
// 2. Add an entry here
// 3. Register the import in src/i18n/messages.ts
export const SUPPORTED_LOCALES = ["en", "hi"] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  hi: "हिन्दी",
};

export const DEFAULT_LOCALE: Locale = "en";

export function isSupportedLocale(value: string): value is Locale {
  return (SUPPORTED_LOCALES as readonly string[]).includes(value);
}
