"use client";

import { Moon, Sun } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { LanguageSelect } from "@/components/common/LanguageSelect";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const NOTIFICATION_PREFS_KEY = "gh_notification_prefs";

interface NotificationPrefs {
  examReminders: boolean;
  resultAlerts: boolean;
  promotions: boolean;
}

const DEFAULT_PREFS: NotificationPrefs = {
  examReminders: true,
  resultAlerts: true,
  promotions: false,
};

function loadPrefs(): NotificationPrefs {
  if (typeof window === "undefined") return DEFAULT_PREFS;
  try {
    const raw = window.localStorage.getItem(NOTIFICATION_PREFS_KEY);
    return raw ? { ...DEFAULT_PREFS, ...JSON.parse(raw) } : DEFAULT_PREFS;
  } catch {
    return DEFAULT_PREFS;
  }
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative h-6 w-11 shrink-0 rounded-full transition-colors",
        checked ? "bg-gold" : "bg-muted-fg/40",
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform",
          checked ? "translate-x-[22px]" : "translate-x-0.5",
        )}
      />
    </button>
  );
}

export default function SettingsPage() {
  const t = useTranslations("settings");
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [prefs, setPrefs] = useState<NotificationPrefs>(DEFAULT_PREFS);

  useEffect(() => {
    setMounted(true);
    setPrefs(loadPrefs());
  }, []);

  function updatePref(key: keyof NotificationPrefs, value: boolean) {
    const next = { ...prefs, [key]: value };
    setPrefs(next);
    window.localStorage.setItem(NOTIFICATION_PREFS_KEY, JSON.stringify(next));
  }

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <Card className="p-6">
        <h2 className="font-heading text-base font-semibold text-fg">{t("appearance.title")}</h2>
        <p className="mt-1 text-[12.5px] text-muted-fg">{t("appearance.subtitle")}</p>

        <div className="mt-5 flex items-center justify-between rounded-lg border border-border p-4">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-fg">
              {isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </span>
            <div>
              <p className="text-[13px] font-medium text-fg">{t("appearance.darkMode")}</p>
              <p className="text-[11.5px] text-muted-fg">{t("appearance.darkModeDescription")}</p>
            </div>
          </div>
          {mounted && (
            <Toggle checked={isDark} onChange={(value) => setTheme(value ? "dark" : "light")} />
          )}
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="font-heading text-base font-semibold text-fg">{t("language.title")}</h2>
        <p className="mt-1 text-[12.5px] text-muted-fg">{t("language.subtitle")}</p>

        <div className="mt-5 flex items-center justify-between rounded-lg border border-border p-4">
          <p className="text-[13px] font-medium text-fg">{t("language.label")}</p>
          <LanguageSelect />
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="font-heading text-base font-semibold text-fg">{t("notifications.title")}</h2>
        <p className="mt-1 text-[12.5px] text-muted-fg">{t("notifications.subtitle")}</p>

        <div className="mt-5 space-y-3">
          <div className="flex items-center justify-between rounded-lg border border-border p-4">
            <div>
              <p className="text-[13px] font-medium text-fg">{t("notifications.examReminders")}</p>
              <p className="text-[11.5px] text-muted-fg">{t("notifications.examRemindersDescription")}</p>
            </div>
            <Toggle
              checked={prefs.examReminders}
              onChange={(value) => updatePref("examReminders", value)}
            />
          </div>

          <div className="flex items-center justify-between rounded-lg border border-border p-4">
            <div>
              <p className="text-[13px] font-medium text-fg">{t("notifications.resultAlerts")}</p>
              <p className="text-[11.5px] text-muted-fg">{t("notifications.resultAlertsDescription")}</p>
            </div>
            <Toggle checked={prefs.resultAlerts} onChange={(value) => updatePref("resultAlerts", value)} />
          </div>

          <div className="flex items-center justify-between rounded-lg border border-border p-4">
            <div>
              <p className="text-[13px] font-medium text-fg">{t("notifications.promotions")}</p>
              <p className="text-[11.5px] text-muted-fg">{t("notifications.promotionsDescription")}</p>
            </div>
            <Toggle checked={prefs.promotions} onChange={(value) => updatePref("promotions", value)} />
          </div>
        </div>
      </Card>
    </div>
  );
}
