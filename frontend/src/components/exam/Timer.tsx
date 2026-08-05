"use client";

import { Clock } from "lucide-react";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

interface TimerProps {
  totalSeconds: number;
  onExpire: () => void;
}

export function Timer({ totalSeconds, onExpire }: TimerProps) {
  const [remaining, setRemaining] = useState(totalSeconds);

  useEffect(() => {
    if (remaining <= 0) {
      onExpire();
      return;
    }
    const interval = setInterval(() => setRemaining((r) => r - 1), 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remaining]);

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;

  return (
    <div
      className={cn(
        "flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 font-mono text-base font-bold shadow-sm",
        remaining < 60
          ? "border-destructive/40 bg-destructive/15 text-destructive animate-pulse"
          : "border-destructive/20 bg-destructive/10 text-destructive",
      )}
    >
      <Clock className="size-4" />
      {remaining <= 0 ? "Time's up" : `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`}
    </div>
  );
}
