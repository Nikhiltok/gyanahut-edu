"use client";

import { useDispatch, useSelector } from "react-redux";

import { Select } from "@/components/ui/select";
import { LOCALE_LABELS, SUPPORTED_LOCALES, isSupportedLocale } from "@/constants/languages";
import { setLocale } from "@/store/slices/localeSlice";
import type { RootState } from "@/store";

export function LanguageSelect() {
  const dispatch = useDispatch();
  const locale = useSelector((state: RootState) => state.locale.locale);

  return (
    <Select
      value={locale}
      onChange={(event) => {
        const value = event.target.value;
        if (isSupportedLocale(value)) dispatch(setLocale(value));
      }}
      className="w-auto"
    >
      {SUPPORTED_LOCALES.map((code) => (
        <option key={code} value={code}>
          {LOCALE_LABELS[code]}
        </option>
      ))}
    </Select>
  );
}
