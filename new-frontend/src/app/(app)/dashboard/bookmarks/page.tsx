"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useSelector } from "react-redux";

import { Card } from "@/components/ui/card";
import { getErrorMessage } from "@/lib/api-error";
import { getBookmarks, removeBookmark } from "@/services/bookmarks.service";
import type { RootState } from "@/store";

export default function BookmarksPage() {
  const queryClient = useQueryClient();
  const selectedExamIds = useSelector((state: RootState) => state.examFilter.selectedExamIds);
  const { data: bookmarks, isLoading } = useQuery({
    queryKey: ["bookmarks", selectedExamIds],
    queryFn: () => getBookmarks(selectedExamIds),
  });

  const removeMutation = useMutation({
    mutationFn: removeBookmark,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["bookmarks"] }),
    onError: (error) => toast.error(getErrorMessage(error, "Could not remove bookmark.")),
  });

  return (
    <div className="mx-auto max-w-5xl space-y-3">
      {isLoading && <p className="text-sm text-muted-fg">Loading bookmarks…</p>}
      {!isLoading && bookmarks?.length === 0 && <p className="text-sm text-muted-fg">No bookmarked questions yet.</p>}

      {(bookmarks ?? []).map((bookmark) => (
        <Card key={bookmark.id} className="flex items-center justify-between p-5">
          <p className="text-[13px] text-fg">{bookmark.question_detail.question_text}</p>
          <button
            type="button"
            onClick={() => removeMutation.mutate(bookmark.id)}
            disabled={removeMutation.isPending}
            className="shrink-0 pl-4 text-[11.5px] font-medium text-danger-fg disabled:opacity-60"
          >
            Remove
          </button>
        </Card>
      ))}
    </div>
  );
}
