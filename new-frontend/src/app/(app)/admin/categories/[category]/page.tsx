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
import { Select } from "@/components/ui/select";
import { getErrorMessage } from "@/lib/api-error";
import { adminCrud } from "@/services/admin-crud";
import { getCategory } from "@/services/exam.service";
import type { Exam } from "@/types/exam";

const examApi = adminCrud<Exam>("exams");

const EXAM_TYPES = [
  "SSC", "UPSC", "BPSC", "CTET", "STET", "BANKING", "RAILWAY", "POLICE", "DEFENCE",
  "STATE_GOVT", "ENGINEERING", "MEDICAL", "CA",
];

export default function AdminExamsInCategoryPage() {
  const { category: categorySlug } = useParams<{ category: string }>();
  const queryClient = useQueryClient();

  const { data: category } = useQuery({
    queryKey: ["category", categorySlug],
    queryFn: () => getCategory(categorySlug),
  });
  const { data: exams, isLoading } = useQuery({
    queryKey: ["admin-exams", category?.id],
    queryFn: () => examApi.list({ category: category!.id }),
    enabled: !!category?.id,
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Exam | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [examType, setExamType] = useState("SSC");

  useEffect(() => {
    if (!dialogOpen) return;
    setName(editing?.name ?? "");
    setDescription(editing?.description ?? "");
    setExamType(editing?.exam_type ?? "SSC");
  }, [dialogOpen, editing]);

  const saveMutation = useMutation({
    mutationFn: () => {
      const payload = { name, description, exam_type: examType, category: category!.id };
      return editing ? examApi.update(editing.id, payload) : examApi.create(payload);
    },
    onSuccess: () => {
      toast.success(editing ? "Exam updated" : "Exam created");
      queryClient.invalidateQueries({ queryKey: ["admin-exams"] });
      setDialogOpen(false);
    },
    onError: (error) => toast.error(getErrorMessage(error, "Could not save exam.")),
  });

  const deleteMutation = useMutation({
    mutationFn: examApi.remove,
    onSuccess: () => {
      toast.success("Exam deleted");
      queryClient.invalidateQueries({ queryKey: ["admin-exams"] });
    },
    onError: (error) => toast.error(getErrorMessage(error, "Could not delete exam.")),
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <Breadcrumb items={[{ label: "Categories", href: "/admin/categories" }, { label: category?.name ?? categorySlug }]} />
        <button
          type="button"
          onClick={() => {
            setEditing(null);
            setDialogOpen(true);
          }}
          className={buttonVariants()}
        >
          Add exam
        </button>
      </div>

      <Card className="overflow-x-auto p-0">
        <table className="w-full text-left text-[12px]">
          <thead>
            <tr className="border-b border-border text-[11.5px] font-semibold text-muted-fg">
              <th className="px-6 py-3">Name</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(exams ?? []).map((exam) => (
              <tr key={exam.id} className="border-b border-border/60 last:border-none">
                <td className="px-6 py-3 text-fg">
                  <Link href={`/admin/categories/${categorySlug}/${exam.slug}`} className="font-medium text-accent-fg">
                    {exam.name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-fg">{exam.exam_type}</td>
                <td className="px-4 py-3 text-fg">{exam.description || "—"}</td>
                <td className="px-6 py-3 text-right">
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(exam);
                      setDialogOpen(true);
                    }}
                    className="mr-3 font-medium text-accent-fg"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm("Delete this exam?")) deleteMutation.mutate(exam.id);
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
        {isLoading && <p className="p-4 text-sm text-muted-fg">Loading exams…</p>}
        {!isLoading && exams?.length === 0 && <p className="p-4 text-sm text-muted-fg">No exams in this category yet.</p>}
      </Card>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} title={editing ? "Edit exam" : "Add exam"}>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            saveMutation.mutate();
          }}
        >
          <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <Select value={examType} onChange={(e) => setExamType(e.target.value)}>
            {EXAM_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </Select>
          <Input placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
          <Button type="submit" className="w-full" disabled={saveMutation.isPending}>
            {saveMutation.isPending ? "Saving..." : "Save exam"}
          </Button>
        </form>
      </Dialog>
    </div>
  );
}
