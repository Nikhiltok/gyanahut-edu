"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { Suspense, useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getErrorMessage } from "@/lib/api-error";
import { bulkImportQuestions, getImportHistory } from "@/services/question-imports.service";

function BulkImportContent() {
  const searchParams = useSearchParams();
  const topicId = searchParams.get("topic") ?? undefined;
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: history, isLoading, refetch } = useQuery({
    queryKey: ["import-history"],
    queryFn: getImportHistory,
  });

  const uploadMutation = useMutation({
    mutationFn: () => bulkImportQuestions(file!, "csv", topicId),
    onSuccess: (result) => {
      toast.success(`Import finished — ${result.success} of ${result.total} succeeded.`);
      setFile(null);
      refetch();
    },
    onError: (error) => toast.error(getErrorMessage(error, "Import failed.")),
  });

  return (
    <div className="space-y-5">
      <Card className="p-5">
        <p className="text-xs text-fg">
          Required: topic, question_text, option_a–d, correct_option
        </p>
        <p className="mt-1 text-xs text-muted-fg">
          Optional: difficulty, marks, negative_marks, explanation, language
        </p>
      </Card>

      {topicId && (
        <p className="text-xs text-muted-fg">
          Scoped to topic ID {topicId} (used when a row omits &quot;topic&quot;).
        </p>
      )}

      <span className="inline-block rounded-md border border-border px-4 py-2 text-xs text-fg">Format: CSV</span>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          const dropped = e.dataTransfer.files?.[0];
          if (dropped) setFile(dropped);
        }}
        onClick={() => fileInputRef.current?.click()}
        className={`flex h-[100px] cursor-pointer items-center justify-center rounded-[10px] border-2 border-dashed text-[13px] text-muted-fg transition-colors ${
          dragging ? "border-gold" : "border-border"
        }`}
      >
        {file ? file.name : "Drag and drop a file, or click to upload"}
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          className="hidden"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
      </div>

      <Button disabled={!file || uploadMutation.isPending} onClick={() => uploadMutation.mutate()}>
        {uploadMutation.isPending ? "Uploading..." : "Upload"}
      </Button>

      <Card className="overflow-x-auto p-0">
        <table className="w-full text-left text-[12px]">
          <thead>
            <tr className="border-b border-border text-[11.5px] font-semibold text-muted-fg">
              <th className="px-6 py-3">File</th>
              <th className="px-4 py-3">Format</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Success</th>
              <th className="px-4 py-3">Failed</th>
              <th className="px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {(history ?? []).map((entry) => (
              <tr key={entry.id} className="border-b border-border/60 last:border-none">
                <td className="px-6 py-3 text-fg">{entry.file_name}</td>
                <td className="px-4 py-3 text-fg uppercase">{entry.file_format}</td>
                <td className="px-4 py-3 text-fg">{entry.total}</td>
                <td className="px-4 py-3 text-fg">{entry.success}</td>
                <td className="px-4 py-3 text-fg">{entry.failed}</td>
                <td className={entry.status === "COMPLETED" ? "px-6 py-3 text-success-fg" : "px-6 py-3 text-danger-fg"}>
                  {entry.status === "COMPLETED" ? "Done" : "Failed"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {isLoading && <p className="p-4 text-sm text-muted-fg">Loading import history…</p>}
        {!isLoading && history?.length === 0 && <p className="p-4 text-sm text-muted-fg">No imports yet.</p>}
      </Card>
    </div>
  );
}

export default function BulkImportPage() {
  return (
    <Suspense fallback={null}>
      <BulkImportContent />
    </Suspense>
  );
}
