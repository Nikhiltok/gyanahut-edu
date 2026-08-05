"use client";

import { X } from "lucide-react";
import { useEffect } from "react";

import { cn } from "@/lib/utils";

export function Dialog({
  open,
  onClose,
  title,
  children,
  className,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-sidebar-bg/45 p-6 py-10">
      <div
        className={cn(
          "w-full max-w-lg rounded-xl border border-border bg-surface p-8 shadow-xl",
          className,
        )}
      >
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-lg font-semibold text-fg">{title}</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="text-muted-fg hover:text-fg">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-5">{children}</div>
      </div>
    </div>
  );
}
