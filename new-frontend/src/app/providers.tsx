"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { Provider as ReduxProvider } from "react-redux";

import { Toaster } from "@/components/ui/sonner";
import { queryClient } from "@/services/query-client";
import { store } from "@/store";

import { IntlProvider } from "./IntlProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider store={store}>
      <IntlProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
            <Toaster position="top-center" richColors />
          </ThemeProvider>
        </QueryClientProvider>
      </IntlProvider>
    </ReduxProvider>
  );
}
