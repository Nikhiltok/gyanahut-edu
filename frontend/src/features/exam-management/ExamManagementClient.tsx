"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronRight, Sparkles, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { DataTable, type DataTableColumn } from "@/components/common/DataTable";
import { DeleteDialog } from "@/components/common/DeleteDialog";
import { EntityFormDialog, type FieldConfig, type FieldValue } from "@/components/common/EntityFormDialog";
import { Button } from "@/components/ui/button";
import { AIGenerateDialog } from "@/features/questions/AIGenerateDialog";
import {
  adminCategoryApi,
  adminChapterApi,
  adminExamApi,
  adminSubjectApi,
  adminTopicApi,
} from "@/services/exam.service";
import { getApiErrorMessage } from "@/utils/api-error";
import type { Chapter, Exam, ExamCategory, Subject, Topic } from "@/types/exam";

const EXAM_TYPES = [
  "SSC", "UPSC", "BPSC", "CTET", "STET", "BANKING", "RAILWAY", "POLICE", "DEFENCE",
  "STATE_GOVT", "ENGINEERING", "MEDICAL", "CA",
];

type Row = ExamCategory | Exam | Subject | Chapter | Topic;
type Level = "category" | "exam" | "subject" | "chapter" | "topic";

// The 5 admin CRUD APIs are structurally identical (list/get/create/update/remove)
// but each is parameterized on a different entity type, which TypeScript can't
// call polymorphically through a union. This local shape — and the single cast
// where each api is assigned to a level — is the one place that's erased.
interface GenericCrudApi {
  list: (params?: Record<string, string>) => Promise<Row[]>;
  create: (payload: Record<string, unknown>) => Promise<Row>;
  update: (id: string, payload: Record<string, unknown>) => Promise<Row>;
  remove: (id: string) => Promise<void>;
}

const LEVEL_LABEL: Record<Level, string> = {
  category: "Category",
  exam: "Exam",
  subject: "Subject",
  chapter: "Chapter",
  topic: "Topic",
};

export function ExamManagementClient() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [examId, setExamId] = useState<string | null>(null);
  const [subjectId, setSubjectId] = useState<string | null>(null);
  const [chapterId, setChapterId] = useState<string | null>(null);

  const [formOpen, setFormOpen] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const [editingRow, setEditingRow] = useState<Row | null>(null);
  const [deletingRow, setDeletingRow] = useState<Row | null>(null);
  const [aiTopic, setAiTopic] = useState<Topic | null>(null);

  const { data: categories, isLoading: loadingCategories } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: () => adminCategoryApi.list(),
  });
  const { data: exams, isLoading: loadingExams } = useQuery({
    queryKey: ["admin-exams", categoryId],
    queryFn: () => adminExamApi.list({ category: categoryId! }),
    enabled: !!categoryId,
  });
  const { data: subjects, isLoading: loadingSubjects } = useQuery({
    queryKey: ["admin-subjects", examId],
    queryFn: () => adminSubjectApi.list({ exam: examId! }),
    enabled: !!examId,
  });
  const { data: chapters, isLoading: loadingChapters } = useQuery({
    queryKey: ["admin-chapters", subjectId],
    queryFn: () => adminChapterApi.list({ subject: subjectId! }),
    enabled: !!subjectId,
  });
  const { data: topics, isLoading: loadingTopics } = useQuery({
    queryKey: ["admin-topics", chapterId],
    queryFn: () => adminTopicApi.list({ chapter: chapterId! }),
    enabled: !!chapterId,
  });

  const selectedCategory = categories?.find((c) => c.id === categoryId);
  const selectedExam = exams?.find((e) => e.id === examId);
  const selectedSubject = subjects?.find((s) => s.id === subjectId);
  const selectedChapter = chapters?.find((c) => c.id === chapterId);

  let level: Level = "category";
  if (categoryId && !examId) level = "exam";
  else if (examId && !subjectId) level = "subject";
  else if (subjectId && !chapterId) level = "chapter";
  else if (chapterId) level = "topic";

  const levelConfig = {
    category: {
      items: categories,
      isLoading: loadingCategories,
      api: adminCategoryApi as unknown as GenericCrudApi,
      queryKey: "admin-categories",
      fields: [
        { name: "name", label: "Name", type: "text", required: true },
        { name: "description", label: "Description", type: "textarea" },
        { name: "status", label: "Active", type: "checkbox" },
      ] as FieldConfig[],
      parentPayload: {} as Record<string, string>,
    },
    exam: {
      items: exams,
      isLoading: loadingExams,
      api: adminExamApi as unknown as GenericCrudApi,
      queryKey: "admin-exams",
      fields: [
        { name: "name", label: "Name", type: "text", required: true },
        {
          name: "exam_type",
          label: "Exam Type",
          type: "select",
          required: true,
          options: EXAM_TYPES.map((t) => ({ value: t, label: t })),
        },
        { name: "description", label: "Description", type: "textarea" },
        { name: "status", label: "Active", type: "checkbox" },
      ] as FieldConfig[],
      parentPayload: { category: categoryId ?? "" },
    },
    subject: {
      items: subjects,
      isLoading: loadingSubjects,
      api: adminSubjectApi as unknown as GenericCrudApi,
      queryKey: "admin-subjects",
      fields: [
        { name: "name", label: "Name", type: "text", required: true },
        { name: "description", label: "Description", type: "textarea" },
        { name: "order", label: "Order", type: "number" },
      ] as FieldConfig[],
      parentPayload: { exam: examId ?? "" },
    },
    chapter: {
      items: chapters,
      isLoading: loadingChapters,
      api: adminChapterApi as unknown as GenericCrudApi,
      queryKey: "admin-chapters",
      fields: [
        { name: "name", label: "Name", type: "text", required: true },
        { name: "order", label: "Order", type: "number" },
      ] as FieldConfig[],
      parentPayload: { subject: subjectId ?? "" },
    },
    topic: {
      items: topics,
      isLoading: loadingTopics,
      api: adminTopicApi as unknown as GenericCrudApi,
      queryKey: "admin-topics",
      fields: [
        { name: "name", label: "Name", type: "text", required: true },
        { name: "description", label: "Description", type: "textarea" },
        { name: "order", label: "Order", type: "number" },
      ] as FieldConfig[],
      parentPayload: { chapter: chapterId ?? "" },
    },
  }[level];

  function invalidateCurrentLevel() {
    queryClient.invalidateQueries({ queryKey: [levelConfig.queryKey] });
  }

  const createMutation = useMutation({
    mutationFn: (values: Record<string, FieldValue>) =>
      levelConfig.api.create({ ...values, ...levelConfig.parentPayload }),
    onSuccess: () => {
      toast.success(`${LEVEL_LABEL[level]} created`);
      setFormOpen(false);
      invalidateCurrentLevel();
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  const updateMutation = useMutation({
    mutationFn: (values: Record<string, FieldValue>) =>
      levelConfig.api.update(editingRow!.id, { ...values, ...levelConfig.parentPayload }),
    onSuccess: () => {
      toast.success(`${LEVEL_LABEL[level]} updated`);
      setFormOpen(false);
      setEditingRow(null);
      invalidateCurrentLevel();
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  const deleteMutation = useMutation({
    mutationFn: (row: Row) => levelConfig.api.remove(row.id),
    onSuccess: () => {
      toast.success(`${LEVEL_LABEL[level]} deleted`);
      setDeletingRow(null);
      invalidateCurrentLevel();
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  function handleRowClick(row: Row) {
    if (level === "category") setCategoryId(row.id);
    else if (level === "exam") setExamId(row.id);
    else if (level === "subject") setSubjectId(row.id);
    else if (level === "chapter") setChapterId(row.id);
  }

  function openUpload(topic: Topic) {
    router.push(`/admin-dashboard/questions/import?topic=${topic.id}&topicName=${encodeURIComponent(topic.name)}`);
  }

  const columns: DataTableColumn<Row>[] = [
    { header: "Name", render: (row) => (row as { name: string }).name },
    ...("order" in (levelConfig.items?.[0] ?? {})
      ? [{ header: "Order", render: (row: Row) => (row as Subject).order } as DataTableColumn<Row>]
      : []),
    ...(level === "topic"
      ? [
          {
            header: "Questions",
            render: (row: Row) => (
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => openUpload(row as Topic)}>
                  <Upload className="size-3.5" />
                  Upload
                </Button>
                <Button size="sm" variant="outline" onClick={() => setAiTopic(row as Topic)}>
                  <Sparkles className="size-3.5" />
                  Generate with AI
                </Button>
              </div>
            ),
          } as DataTableColumn<Row>,
        ]
      : []),
  ];

  const breadcrumbs: { label: string; onClick: () => void }[] = [
    { label: "All Categories", onClick: () => setCategoryId(null) },
  ];
  if (selectedCategory) {
    breadcrumbs.push({ label: selectedCategory.name, onClick: () => setExamId(null) });
  }
  if (selectedExam) {
    breadcrumbs.push({ label: selectedExam.name, onClick: () => setSubjectId(null) });
  }
  if (selectedSubject) {
    breadcrumbs.push({ label: selectedSubject.name, onClick: () => setChapterId(null) });
  }
  if (selectedChapter) {
    breadcrumbs.push({ label: selectedChapter.name, onClick: () => {} });
  }

  return (
    <div className="space-y-4 p-8">
      <h1 className="text-2xl font-semibold">Question Management</h1>

      <nav className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
        {breadcrumbs.map((crumb, index) => (
          <span key={crumb.label} className="flex items-center gap-1">
            {index > 0 && <ChevronRight className="size-3.5" />}
            {index === breadcrumbs.length - 1 ? (
              <span className="text-foreground">{crumb.label}</span>
            ) : (
              <button className="hover:text-foreground hover:underline" onClick={crumb.onClick}>
                {crumb.label}
              </button>
            )}
          </span>
        ))}
      </nav>

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">{LEVEL_LABEL[level]}s</h2>
        <Button
          onClick={() => {
            setEditingRow(null);
            setFormKey((k) => k + 1);
            setFormOpen(true);
          }}
        >
          Add {LEVEL_LABEL[level]}
        </Button>
      </div>

      {levelConfig.isLoading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : (
        <>
          <DataTable<Row>
            columns={columns}
            rows={(levelConfig.items as Row[] | undefined) ?? []}
            onEdit={(row) => {
              setEditingRow(row);
              setFormKey((k) => k + 1);
              setFormOpen(true);
            }}
            onDelete={(row) => setDeletingRow(row)}
            onRowClick={level === "topic" ? undefined : handleRowClick}
          />
          {level !== "topic" && (levelConfig.items?.length ?? 0) > 0 && (
            <p className="text-xs text-muted-foreground">Click a row to open it and manage its children.</p>
          )}
        </>
      )}

      <EntityFormDialog
        key={formKey}
        open={formOpen}
        onOpenChange={setFormOpen}
        title={editingRow ? `Edit ${LEVEL_LABEL[level]}` : `Add ${LEVEL_LABEL[level]}`}
        fields={levelConfig.fields}
        initialValues={editingRow ? (editingRow as unknown as Record<string, FieldValue>) : undefined}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
        onSubmit={async (values) => {
          if (editingRow) {
            await updateMutation.mutateAsync(values);
          } else {
            await createMutation.mutateAsync(values);
          }
        }}
      />

      <DeleteDialog
        open={!!deletingRow}
        onOpenChange={(open) => !open && setDeletingRow(null)}
        onConfirm={() => deletingRow && deleteMutation.mutate(deletingRow)}
        isDeleting={deleteMutation.isPending}
        title={`Delete this ${LEVEL_LABEL[level].toLowerCase()}?`}
      />

      <AIGenerateDialog topic={aiTopic} onOpenChange={(open) => !open && setAiTopic(null)} />
    </div>
  );
}
