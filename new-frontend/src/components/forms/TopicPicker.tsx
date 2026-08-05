"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { Select } from "@/components/ui/select";
import { getCategories, getChapters, getExams, getSubjects, getTopics } from "@/services/exam.service";

export function TopicPicker({ value, onChange }: { value: string; onChange: (topicId: string) => void }) {
  const [categorySlug, setCategorySlug] = useState("");
  const [examId, setExamId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [chapterId, setChapterId] = useState("");

  const { data: categories } = useQuery({ queryKey: ["categories"], queryFn: getCategories });
  const { data: exams } = useQuery({
    queryKey: ["exams", categorySlug],
    queryFn: () => getExams({ category: categorySlug }),
    enabled: !!categorySlug,
  });
  const { data: subjects } = useQuery({
    queryKey: ["subjects", examId],
    queryFn: () => getSubjects(examId),
    enabled: !!examId,
  });
  const { data: chapters } = useQuery({
    queryKey: ["chapters", subjectId],
    queryFn: () => getChapters(subjectId),
    enabled: !!subjectId,
  });
  const { data: topics } = useQuery({
    queryKey: ["topics", chapterId],
    queryFn: () => getTopics(chapterId),
    enabled: !!chapterId,
  });

  return (
    <div className="grid grid-cols-2 gap-3">
      <Select
        value={categorySlug}
        onChange={(e) => {
          setCategorySlug(e.target.value);
          setExamId("");
          setSubjectId("");
          setChapterId("");
          onChange("");
        }}
      >
        <option value="">Category</option>
        {(categories ?? []).map((c) => (
          <option key={c.id} value={c.slug}>
            {c.name}
          </option>
        ))}
      </Select>

      <Select
        value={examId}
        onChange={(e) => {
          setExamId(e.target.value);
          setSubjectId("");
          setChapterId("");
          onChange("");
        }}
        disabled={!categorySlug}
      >
        <option value="">Exam</option>
        {(exams ?? []).map((e) => (
          <option key={e.id} value={e.id}>
            {e.name}
          </option>
        ))}
      </Select>

      <Select
        value={subjectId}
        onChange={(e) => {
          setSubjectId(e.target.value);
          setChapterId("");
          onChange("");
        }}
        disabled={!examId}
      >
        <option value="">Subject</option>
        {(subjects ?? []).map((s) => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </Select>

      <Select
        value={chapterId}
        onChange={(e) => {
          setChapterId(e.target.value);
          onChange("");
        }}
        disabled={!subjectId}
      >
        <option value="">Chapter</option>
        {(chapters ?? []).map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </Select>

      <Select value={value} onChange={(e) => onChange(e.target.value)} disabled={!chapterId} className="col-span-2">
        <option value="">Select topic</option>
        {(topics ?? []).map((t) => (
          <option key={t.id} value={t.id}>
            {t.name}
          </option>
        ))}
      </Select>
    </div>
  );
}
