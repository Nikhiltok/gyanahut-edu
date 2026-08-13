"use client";

import { NextIntlClientProvider } from "next-intl";
import { useSelector } from "react-redux";

import { MESSAGES } from "@/i18n/messages";
import type { RootState } from "@/store";

export function IntlProvider({ children }: { children: React.ReactNode }) {
  const locale = useSelector((state: RootState) => state.locale.locale);

  return (
    <NextIntlClientProvider locale={locale} messages={MESSAGES[locale]} timeZone="Asia/Kolkata">
      {children}
    </NextIntlClientProvider>
  );
}
