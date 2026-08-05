"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
import { getCategory, getChapter, getExam, getSubject } from "@/services/exam.service";
import { startAIGeneration } from "@/services/question-imports.service";
import type { Topic } from "@/types/exam";

const topicApi = adminCrud<Topic>("topics");

export default function AdminTopicsInChapterPage() {
  const {
    category: categorySlug,
    exam: examSlug,
    subjectId,
    chapterId,
  } = useParams<{ category: string; exam: string; subjectId: string; chapterId: string }>();
  const queryClient = useQueryClient();

  const { data: category } = useQuery({ queryKey: ["category", categorySlug], queryFn: () => getCategory(categorySlug) });
  const { data: exam } = useQuery({ queryKey: ["exam", examSlug], queryFn: () => getExam(examSlug) });
  const { data: subject } = useQuery({ queryKey: ["subject", subjectId], queryFn: () => getSubject(subjectId) });
  const { data: chapter } = useQuery({ queryKey: ["chapter", chapterId], queryFn: () => getChapter(chapterId) });
  const { data: topics, isLoading } = useQuery({
    queryKey: ["admin-topics", chapterId],
    queryFn: () => topicApi.list({ chapter: chapterId }),
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Topic | null>(null);
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
      const payload = { name, description, order, chapter: chapterId };
      return editing ? topicApi.update(editing.id, payload) : topicApi.create(payload);
    },
    onSuccess: () => {
      toast.success(editing ? "Topic updated" : "Topic created");
      queryClient.invalidateQueries({ queryKey: ["admin-topics"] });
      setDialogOpen(false);
    },
    onError: (error) => toast.error(getErrorMessage(error, "Could not save topic.")),
  });

  const deleteMutation = useMutation({
    mutationFn: topicApi.remove,
    onSuccess: () => {
      toast.success("Topic deleted");
      queryClient.invalidateQueries({ queryKey: ["admin-topics"] });
    },
    onError: (error) => toast.error(getErrorMessage(error, "Could not delete topic.")),
  });

  const [aiTopic, setAiTopic] = useState<Topic | null>(null);
  const [aiCount, setAiCount] = useState(10);
  const [aiDifficulty, setAiDifficulty] = useState("MEDIUM");

  const aiMutation = useMutation({
    mutationFn: () => startAIGeneration(aiTopic!.id, aiDifficulty, aiCount),
    onSuccess: () => {
      toast.success("AI generation started — check back shortly for new questions.");
      setAiTopic(null);
    },
    onError: (error) => toast.error(getErrorMessage(error, "Could not start AI generation.")),
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <Breadcrumb
          items={[
            { label: "Categories", href: "/admin/categories" },
            { label: category?.name ?? categorySlug, href: `/admin/categories/${categorySlug}` },
            { label: exam?.name ?? examSlug, href: `/admin/categories/${categorySlug}/${examSlug}` },
            {
              label: subject?.name ?? "",
              href: `/admin/categories/${categorySlug}/${examSlug}/subjects/${subjectId}`,
            },
            { label: chapter?.name ?? "" },
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
          Add topic
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
            {(topics ?? []).map((topic) => (
              <tr key={topic.id} className="border-b border-border/60 last:border-none">
                <td className="px-6 py-3 text-fg">{topic.name}</td>
                <td className="px-4 py-3 text-fg">{topic.description || "—"}</td>
                <td className="px-4 py-3 text-fg">{topic.order}</td>
                <td className="whitespace-nowrap px-6 py-3 text-right">
                  <a
                    href={`/admin/questions/import?topic=${topic.id}`}
                    className="mr-3 font-medium text-accent-fg"
                  >
                    Upload
                  </a>
                  <button
                    type="button"
                    onClick={() => setAiTopic(topic)}
                    className="mr-3 font-medium text-accent-fg"
                  >
                    Generate with AI
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(topic);
                      setDialogOpen(true);
                    }}
                    className="mr-3 font-medium text-accent-fg"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm("Delete this topic?")) deleteMutation.mutate(topic.id);
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
        {isLoading && <p className="p-4 text-sm text-muted-fg">Loading topics…</p>}
        {!isLoading && topics?.length === 0 && <p className="p-4 text-sm text-muted-fg">No topics yet.</p>}
      </Card>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} title={editing ? "Edit topic" : "Add topic"}>
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
            {saveMutation.isPending ? "Saving..." : "Save topic"}
          </Button>
        </form>
      </Dialog>

      <Dialog open={!!aiTopic} onClose={() => setAiTopic(null)} title={`Generate with AI — ${aiTopic?.name ?? ""}`}>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            aiMutation.mutate();
          }}
        >
          <div className="grid grid-cols-2 gap-3">
            <Input
              type="number"
              min={1}
              max={50}
              value={aiCount}
              onChange={(e) => setAiCount(Number(e.target.value))}
              placeholder="How many questions"
            />
            <Select value={aiDifficulty} onChange={(e) => setAiDifficulty(e.target.value)}>
              <option value="EASY">Easy</option>
              <option value="MEDIUM">Medium</option>
              <option value="HARD">Hard</option>
            </Select>
          </div>
          <p className="text-xs text-muted-fg">
            Requires an OpenAI API key configured on the backend — if none is set, this will fail with a clear
            error.
          </p>
          <Button type="submit" className="w-full" disabled={aiMutation.isPending}>
            {aiMutation.isPending ? "Starting..." : "Start generation"}
          </Button>
        </form>
      </Dialog>
    </div>
  );
}
