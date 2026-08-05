"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

import { Badge, badgeVariants } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { Test } from "@/types/test";

const STATUS_VARIANT: Record<Test["status"], "default" | "secondary" | "outline" | "destructive"> = {
  DRAFT: "outline",
  SCHEDULED: "secondary",
  LIVE: "default",
  COMPLETED: "secondary",
  ARCHIVED: "destructive",
};

interface TestStatusMenuProps {
  test: Pick<Test, "status" | "start_time">;
  onPublish: () => void;
  onArchive: () => void;
}

export function TestStatusMenu({ test, onPublish, onArchive }: TestStatusMenuProps) {
  const [pendingAction, setPendingAction] = useState<"publish" | "archive" | null>(null);

  if (test.status === "ARCHIVED") {
    return <Badge variant="destructive">ARCHIVED</Badge>;
  }

  const isScheduling = !!test.start_time && new Date(test.start_time) > new Date();
  const publishLabel = isScheduling ? "Schedule" : "Publish";

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <button
              type="button"
              className={cn(badgeVariants({ variant: STATUS_VARIANT[test.status] }), "cursor-pointer gap-1")}
            >
              {test.status}
              <ChevronDown className="size-3" />
            </button>
          }
        />
        <DropdownMenuContent align="start">
          {test.status !== "LIVE" && (
            <DropdownMenuItem onClick={() => setPendingAction("publish")}>{publishLabel}</DropdownMenuItem>
          )}
          <DropdownMenuItem variant="destructive" onClick={() => setPendingAction("archive")}>
            Archive
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmDialog
        open={pendingAction === "publish"}
        onOpenChange={(open) => !open && setPendingAction(null)}
        onConfirm={onPublish}
        title={isScheduling ? "Schedule this test?" : "Publish this test?"}
        description={
          isScheduling
            ? "It will automatically go live for students at its scheduled start time."
            : "It will immediately become visible and attemptable by students."
        }
        confirmLabel={publishLabel}
      />

      <ConfirmDialog
        open={pendingAction === "archive"}
        onOpenChange={(open) => !open && setPendingAction(null)}
        onConfirm={onArchive}
        title="Archive this test?"
        description="It will be removed from students' live/upcoming lists. Existing attempts and results are kept, but this can't easily be undone."
        confirmLabel="Archive"
        variant="destructive"
      />
    </>
  );
}
