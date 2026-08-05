"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Breadcrumb } from "@/components/common/Breadcrumb";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { getErrorMessage } from "@/lib/api-error";
import { adminCrud } from "@/services/admin-crud";
import { getCategory, getExam, getSubject } from "@/services/exam.service";
import type { Chapter } from "@/types/exam";

const chapterApi = adminCrud<Chapter>("chapters");

export default function AdminChaptersInSubjectPage() {
  const {
    category: categorySlug,
    exam: examSlug,
    subjectId,
  } = useParams<{ category: string; exam: string; subjectId: string }>();
  const queryClient = useQueryClient();

  const { data: category } = useQuery({ queryKey: ["category", categorySlug], queryFn: () => getCategory(categorySlug) });
  const { data: exam } = useQuery({ queryKey: ["exam", examSlug], queryFn: () => getExam(examSlug) });
  const { data: subject } = useQuery({ queryKey: ["subject", subjectId], queryFn: () => getSubject(subjectId) });
  const { data: chapters, isLoading } = useQuery({
    queryKey: ["admin-chapters", subjectId],
    queryFn: () => chapterApi.list({ subject: subjectId }),
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Chapter | null>(null);
  const [name, setName] = useState("");
  const [order, setOrder] = useState(0);

  useEffect(() => {
    if (!dialogOpen) return;
    setName(editing?.name ?? "");
    setOrder(editing?.order ?? 0);
  }, [dialogOpen, editing]);

  const saveMutation = useMutation({
    mutationFn: () => {
      const payload = { name, order, subject: subjectId };
      return editing ? chapterApi.update(editing.id, payload) : chapterApi.create(payload);
    },
    onSuccess: () => {
      toast.success(editing ? "Chapter updated" : "Chapter created");
      queryClient.invalidateQueries({ queryKey: ["admin-chapters"] });
      setDialogOpen(false);
    },
    onError: (error) => toast.error(getErrorMessage(error, "Could not save chapter.")),
  });

  const deleteMutation = useMutation({
    mutationFn: chapterApi.remove,
    onSuccess: () => {
      toast.success("Chapter deleted");
      queryClient.invalidateQueries({ queryKey: ["admin-chapters"] });
    },
    onError: (error) => toast.error(getErrorMessage(error, "Could not delete chapter.")),
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <Breadcrumb
          items={[
            { label: "Categories", href: "/admin/categories" },
            { label: category?.name ?? categorySlug, href: `/admin/categories/${categorySlug}` },
            { label: exam?.name ?? examSlug, href: `/admin/categories/${categorySlug}/${examSlug}` },
            { label: subject?.name ?? "" },
          ]}
        />
        <button
          type="button"
          onClick={() => {
            setEditing(null);
            setDialogOpen(true);
          }}
          className={buttonVariants()}
        >
          Add chapter
        </button>
      </div>

      <Card className="overflow-x-auto p-0">
        <table className="w-full text-left text-[12px]">
          <thead>
            <tr className="border-b border-border text-[11.5px] font-semibold text-muted-fg">
              <th className="px-6 py-3">Name</th>
              <th className="px-4 py-3">Order</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(chapters ?? []).map((chapter) => (
              <tr key={chapter.id} className="border-b border-border/60 last:border-none">
                <td className="px-6 py-3 text-fg">
                  <Link
                    href={`/admin/categories/${categorySlug}/${examSlug}/subjects/${subjectId}/chapters/${chapter.id}`}
                    className="font-medium text-accent-fg"
                  >
                    {chapter.name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-fg">{chapter.order}</td>
                <td className="px-6 py-3 text-right">
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(chapter);
                      setDialogOpen(true);
                    }}
                    className="mr-3 font-medium text-accent-fg"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm("Delete this chapter?")) deleteMutation.mutate(chapter.id);
                    }}
                    className="font-medium text-danger-fg"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {isLoading && <p className="p-4 text-sm text-muted-fg">Loading chapters…</p>}
        {!isLoading && chapters?.length === 0 && <p className="p-4 text-sm text-muted-fg">No chapters yet.</p>}
      </Card>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} title={editing ? "Edit chapter" : "Add chapter"}>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            saveMutation.mutate();
          }}
        >
          <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <Input
            type="number"
            placeholder="Order"
            value={order}
            onChange={(e) => setOrder(Number(e.target.value))}
          />
          <Button type="submit" className="w-full" disabled={saveMutation.isPending}>
            {saveMutation.isPending ? "Saving..." : "Save chapter"}
          </Button>
        </form>
      </Dialog>
    </div>
  );
}
