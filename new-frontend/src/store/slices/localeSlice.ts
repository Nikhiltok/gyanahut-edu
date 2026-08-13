import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { DEFAULT_LOCALE, isSupportedLocale, type Locale } from "@/constants/languages";

const STORAGE_KEY = "gh_locale";

function loadPersisted(): Locale {
  if (typeof window === "undefined") return DEFAULT_LOCALE;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  return raw && isSupportedLocale(raw) ? raw : DEFAULT_LOCALE;
}

function persist(locale: Locale) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, locale);
}

interface LocaleState {
  locale: Locale;
}

const initialState: LocaleState = {
  locale: loadPersisted(),
};

const localeSlice = createSlice({
  name: "locale",
  initialState,
  reducers: {
    setLocale(state, action: PayloadAction<Locale>) {
      state.locale = action.payload;
      persist(action.payload);
    },
  },
});

export const { setLocale } = localeSlice.actions;
export default localeSlice.reducer;
