"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { getApiErrorMessage } from "@/utils/api-error";

import type { AdminCrudApi } from "@/services/exam.service";
import { DataTable, type DataTableColumn } from "./DataTable";
import { DeleteDialog } from "./DeleteDialog";
import { EntityFormDialog, type FieldConfig, type FieldValue } from "./EntityFormDialog";

interface AdminCrudPageProps<T extends { id: string }> {
  title: string;
  queryKey: string;
  api: AdminCrudApi<T>;
  columns: DataTableColumn<T>[];
  fields: FieldConfig[];
  toFormValues?: (row: T) => Record<string, FieldValue>;
}

export function AdminCrudPage<T extends { id: string }>({
  title,
  queryKey,
  api,
  columns,
  fields,
  toFormValues,
}: AdminCrudPageProps<T>) {
  const queryClient = useQueryClient();
  const { data: rows, isLoading } = useQuery({ queryKey: [queryKey], queryFn: () => api.list() });

  const [formOpen, setFormOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<T | null>(null);
  const [deletingRow, setDeletingRow] = useState<T | null>(null);
  const [formKey, setFormKey] = useState(0);

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: [queryKey] });
  }

  const createMutation = useMutation({
    mutationFn: (values: Record<string, FieldValue>) => api.create(values as Partial<T>),
    onSuccess: () => {
      toast.success(`${title} created`);
      setFormOpen(false);
      invalidate();
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  const updateMutation = useMutation({
    mutationFn: (values: Record<string, FieldValue>) => api.update(editingRow!.id, values as Partial<T>),
    onSuccess: () => {
      toast.success(`${title} updated`);
      setFormOpen(false);
      setEditingRow(null);
      invalidate();
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  const deleteMutation = useMutation({
    mutationFn: (row: T) => api.remove(row.id),
    onSuccess: () => {
      toast.success(`${title} deleted`);
      setDeletingRow(null);
      invalidate();
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  return (
    <div className="space-y-4 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{title}</h1>
        <Button
          onClick={() => {
            setEditingRow(null);
            setFormKey((k) => k + 1);
            setFormOpen(true);
          }}
        >
          Add {title}
        </Button>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : (
        <DataTable
          columns={columns}
          rows={rows ?? []}
          onEdit={(row) => {
            setEditingRow(row);
            setFormKey((k) => k + 1);
            setFormOpen(true);
          }}
          onDelete={(row) => setDeletingRow(row)}
        />
      )}

      <EntityFormDialog
        key={formKey}
        open={formOpen}
        onOpenChange={setFormOpen}
        title={editingRow ? `Edit ${title}` : `Add ${title}`}
        fields={fields}
        initialValues={editingRow ? (toFormValues ? toFormValues(editingRow) : (editingRow as Record<string, FieldValue>)) : undefined}
        onSubmit={async (values) => {
          if (editingRow) {
            await updateMutation.mutateAsync(values);
          } else {
            await createMutation.mutateAsync(values);
          }
        }}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />

      <DeleteDialog
        open={!!deletingRow}
        onOpenChange={(open) => !open && setDeletingRow(null)}
        onConfirm={() => deletingRow && deleteMutation.mutate(deletingRow)}
        isDeleting={deleteMutation.isPending}
        title={`Delete this ${title.toLowerCase().replace(/s$/, "")}?`}
      />
    </div>
  );
}
