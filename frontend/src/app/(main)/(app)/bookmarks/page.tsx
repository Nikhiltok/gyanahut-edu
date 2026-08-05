"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getBookmarks, removeBookmark } from "@/services/question.service";
import { getApiErrorMessage } from "@/utils/api-error";

export default function BookmarksPage() {
  const queryClient = useQueryClient();
  const { data: bookmarks, isLoading } = useQuery({ queryKey: ["bookmarks"], queryFn: getBookmarks });

  const removeMutation = useMutation({
    mutationFn: (id: string) => removeBookmark(id),
    onSuccess: () => {
      toast.success("Bookmark removed");
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  return (
    <div className="w-full space-y-6 p-8">
      <PageHeader title="Bookmarked Questions" subtitle="Questions you've saved for later revision." />
      {isLoading ? (
        <Skeleton className="h-40 w-full" />
      ) : (bookmarks ?? []).length === 0 ? (
        <p className="text-muted-foreground">You haven&apos;t bookmarked any questions yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          {(bookmarks ?? []).map((bookmark) => (
            <Card key={bookmark.id}>
              <CardContent className="flex items-start justify-between gap-4 py-4">
                <p>{bookmark.question_detail.question_text}</p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => removeMutation.mutate(bookmark.id)}
                  disabled={removeMutation.isPending}
                >
                  Remove
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
