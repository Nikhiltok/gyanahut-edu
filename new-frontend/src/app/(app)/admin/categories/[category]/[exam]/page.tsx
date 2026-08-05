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
import { getCategory, getExam } from "@/services/exam.service";
import type { Subject } from "@/types/exam";

const subjectApi = adminCrud<Subject>("subjects");

export default function AdminSubjectsInExamPage() {
  const { category: categorySlug, exam: examSlug } = useParams<{ category: string; exam: string }>();
  const queryClient = useQueryClient();

  const { data: category } = useQuery({ queryKey: ["category", categorySlug], queryFn: () => getCategory(categorySlug) });
  const { data: exam } = useQuery({ queryKey: ["exam", examSlug], queryFn: () => getExam(examSlug) });
  const { data: subjects, isLoading } = useQuery({
    queryKey: ["admin-subjects", exam?.id],
    queryFn: () => subjectApi.list({ exam: exam!.id }),
    enabled: !!exam?.id,
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Subject | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [order, setOrder] = useState(0);

  useEffect(() => {
    if (!dialogOpen) return;
    setName(editing?.name ?? "");
    setDescription(editing?.description ?? "");
    setOrder(editing?.order ?? 0);
  }, [dialogOpen, editing]);

  const saveMutation = useMutation({
    mutationFn: () => {
      const payload = { name, description, order, exam: exam!.id };
      return editing ? subjectApi.update(editing.id, payload) : subjectApi.create(payload);
    },
    onSuccess: () => {
      toast.success(editing ? "Subject updated" : "Subject created");
      queryClient.invalidateQueries({ queryKey: ["admin-subjects"] });
      setDialogOpen(false);
    },
    onError: (error) => toast.error(getErrorMessage(error, "Could not save subject.")),
  });

  const deleteMutation = useMutation({
    mutationFn: subjectApi.remove,
    onSuccess: () => {
      toast.success("Subject deleted");
      queryClient.invalidateQueries({ queryKey: ["admin-subjects"] });
    },
    onError: (error) => toast.error(getErrorMessage(error, "Could not delete subject.")),
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <Breadcrumb
          items={[
            { label: "Categories", href: "/admin/categories" },
            { label: category?.name ?? categorySlug, href: `/admin/categories/${categorySlug}` },
            { label: exam?.name ?? examSlug },
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
          Add subject
        </button>
      </div>

      <Card className="overflow-x-auto p-0">
        <table className="w-full text-left text-[12px]">
          <thead>
            <tr className="border-b border-border text-[11.5px] font-semibold text-muted-fg">
              <th className="px-6 py-3">Name</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3">Order</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(subjects ?? []).map((subject) => (
              <tr key={subject.id} className="border-b border-border/60 last:border-none">
                <td className="px-6 py-3 text-fg">
                  <Link
                    href={`/admin/categories/${categorySlug}/${examSlug}/subjects/${subject.id}`}
                    className="font-medium text-accent-fg"
                  >
                    {subject.name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-fg">{subject.description || "—"}</td>
                <td className="px-4 py-3 text-fg">{subject.order}</td>
                <td className="px-6 py-3 text-right">
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(subject);
                      setDialogOpen(true);
                    }}
                    className="mr-3 font-medium text-accent-fg"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm("Delete this subject?")) deleteMutation.mutate(subject.id);
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
        {isLoading && <p className="p-4 text-sm text-muted-fg">Loading subjects…</p>}
        {!isLoading && subjects?.length === 0 && <p className="p-4 text-sm text-muted-fg">No subjects yet.</p>}
      </Card>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} title={editing ? "Edit subject" : "Add subject"}>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            saveMutation.mutate();
          }}
        >
          <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <Input placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
          <Input
            type="number"
            placeholder="Order"
            value={order}
            onChange={(e) => setOrder(Number(e.target.value))}
          />
          <Button type="submit" className="w-full" disabled={saveMutation.isPending}>
            {saveMutation.isPending ? "Saving..." : "Save subject"}
          </Button>
        </form>
      </Dialog>
    </div>
  );
}
