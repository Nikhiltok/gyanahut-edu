"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { getErrorMessage } from "@/lib/api-error";
import { adminCrud } from "@/services/admin-crud";
import type { ExamCategory } from "@/types/exam";

const categoryApi = adminCrud<ExamCategory>("categories");

export default function AdminCategoriesPage() {
  const queryClient = useQueryClient();
  const { data: categories, isLoading } = useQuery({ queryKey: ["admin-categories"], queryFn: () => categoryApi.list() });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<ExamCategory | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (!dialogOpen) return;
    setName(editing?.name ?? "");
    setDescription(editing?.description ?? "");
  }, [dialogOpen, editing]);

  const saveMutation = useMutation({
    mutationFn: () =>
      editing ? categoryApi.update(editing.id, { name, description }) : categoryApi.create({ name, description }),
    onSuccess: () => {
      toast.success(editing ? "Category updated" : "Category created");
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      setDialogOpen(false);
    },
    onError: (error) => toast.error(getErrorMessage(error, "Could not save category.")),
  });

  const deleteMutation = useMutation({
    mutationFn: categoryApi.remove,
    onSuccess: () => {
      toast.success("Category deleted");
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
    },
    onError: (error) => toast.error(getErrorMessage(error, "Could not delete category.")),
  });

  return (
    <div className="space-y-5">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => {
            setEditing(null);
            setDialogOpen(true);
          }}
          className={buttonVariants()}
        >
          Add category
        </button>
      </div>

      <Card className="overflow-x-auto p-0">
        <table className="w-full text-left text-[12px]">
          <thead>
            <tr className="border-b border-border text-[11.5px] font-semibold text-muted-fg">
              <th className="px-6 py-3">Name</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(categories ?? []).map((category) => (
              <tr key={category.id} className="border-b border-border/60 last:border-none">
                <td className="px-6 py-3 text-fg">
                  <Link href={`/admin/categories/${category.slug}`} className="font-medium text-accent-fg">
                    {category.name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-fg">{category.description || "—"}</td>
                <td className="px-6 py-3 text-right">
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(category);
                      setDialogOpen(true);
                    }}
                    className="mr-3 font-medium text-accent-fg"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm("Delete this category?")) deleteMutation.mutate(category.id);
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
        {isLoading && <p className="p-4 text-sm text-muted-fg">Loading categories…</p>}
        {!isLoading && categories?.length === 0 && <p className="p-4 text-sm text-muted-fg">No categories yet.</p>}
      </Card>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} title={editing ? "Edit category" : "Add category"}>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            saveMutation.mutate();
          }}
        >
          <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <Input
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Button type="submit" className="w-full" disabled={saveMutation.isPending}>
            {saveMutation.isPending ? "Saving..." : "Save category"}
          </Button>
        </form>
      </Dialog>
    </div>
  );
}
