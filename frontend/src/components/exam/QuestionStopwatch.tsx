"use client";

import { Clock } from "lucide-react";
import { useEffect, useState } from "react";

// Mount with a `key` tied to the current question's id so it resets to 0 on
// every question change — each instance owns its own local ticking state.
export function QuestionStopwatch() {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;

  return (
    <span className="flex items-center gap-1.5 font-mono text-sm text-muted-foreground">
      <Clock className="size-4" />
      Spent: {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
    </span>
  );
}
