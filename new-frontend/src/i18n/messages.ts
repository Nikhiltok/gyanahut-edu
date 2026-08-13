import type { Locale } from "@/constants/languages";

import en from "@/messages/en.json";
import hi from "@/messages/hi.json";

// Add the new language's import above and register it here.
export const MESSAGES: Record<Locale, typeof en> = { en, hi };
