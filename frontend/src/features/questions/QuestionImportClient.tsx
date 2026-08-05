"use client";

import { useQuery } from "@tanstack/react-query";
import { Download } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { FileDropzone } from "@/components/common/FileDropzone";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { bulkImportQuestions, getImportHistory } from "@/services/question.service";
import { getApiErrorMessage } from "@/utils/api-error";
import type { BulkImportResult } from "@/types/question";

const FORMATS = [
  { value: "csv", label: "CSV" },
  { value: "json", label: "JSON" },
  { value: "xlsx", label: "Excel (XLSX)" },
];

interface ColumnSpec {
  name: string;
  required: boolean;
  description: string;
}

const BASE_COLUMNS: ColumnSpec[] = [
  { name: "question_text", required: true, description: "The question text" },
  { name: "option_a", required: true, description: "Option A text" },
  { name: "option_b", required: true, description: "Option B text" },
  { name: "option_c", required: true, description: "Option C text" },
  { name: "option_d", required: true, description: "Option D text" },
  { name: "correct_option", required: true, description: "One of: A, B, C, D" },
  { name: "difficulty", required: false, description: "EASY, MEDIUM, or HARD (default: MEDIUM)" },
  { name: "marks", required: false, description: "Marks for a correct answer (default: 1)" },
  { name: "negative_marks", required: false, description: "Marks deducted for a wrong answer (default: 0)" },
  { name: "explanation", required: false, description: "Shown to students after they attempt the question" },
  { name: "language", required: false, description: "Default: en" },
];

const EXAMPLE_ROW: Record<string, string | number> = {
  topic: "<topic-uuid>",
  question_text: "What is the capital of France?",
  option_a: "Paris",
  option_b: "London",
  option_c: "Berlin",
  option_d: "Madrid",
  correct_option: "A",
  difficulty: "EASY",
  marks: 1,
  negative_marks: 0,
  explanation: "Paris is the capital of France.",
  language: "en",
};

function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function QuestionImportClient() {
  const searchParams = useSearchParams();
  const topicId = searchParams.get("topic") ?? undefined;
  const topicName = searchParams.get("topicName");

  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState("csv");
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState<BulkImportResult | null>(null);

  const { data: history, refetch } = useQuery({ queryKey: ["import-history"], queryFn: getImportHistory });

  const columns: ColumnSpec[] = topicId
    ? BASE_COLUMNS
    : [{ name: "topic", required: true, description: "Topic UUID this question belongs to" }, ...BASE_COLUMNS];

  const exampleRow: Record<string, string | number> = { ...EXAMPLE_ROW };
  if (topicId) {
    delete exampleRow.topic;
  }

  const csvHeader = columns.map((c) => c.name).join(",");
  const csvRow = columns.map((c) => String(exampleRow[c.name] ?? "")).join(",");
  const csvExample = `${csvHeader}\n${csvRow}`;

  const jsonExample = JSON.stringify([exampleRow], null, 2);

  async function handleUpload() {
    if (!file) {
      toast.error("Choose a file first");
      return;
    }
    setIsUploading(true);
    try {
      const uploadResult = await bulkImportQuestions(file, format, topicId);
      setResult(uploadResult);
      toast.success(`Imported ${uploadResult.success}/${uploadResult.total} questions`);
      refetch();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Import failed"));
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="max-w-3xl space-y-6 p-8">
      <h1 className="text-2xl font-semibold">Bulk Question Upload</h1>

      {topicId && (
        <div className="rounded-md border border-primary/30 bg-primary/5 px-4 py-2 text-sm">
          Uploading for topic: <span className="font-medium">{topicName ?? topicId}</span> — rows without a
          &quot;topic&quot; column will use this topic automatically.
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>File format reference</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="overflow-x-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Column</TableHead>
                  <TableHead>Required</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {columns.map((col) => (
                  <TableRow key={col.name}>
                    <TableCell className="font-mono text-xs">{col.name}</TableCell>
                    <TableCell>
                      <Badge variant={col.required ? "default" : "secondary"}>
                        {col.required ? "Required" : "Optional"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{col.description}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {format === "csv" && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">CSV example</p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => downloadFile(csvExample + "\n", "questions_template.csv", "text/csv")}
                >
                  <Download className="size-3.5" />
                  Download CSV template
                </Button>
              </div>
              <pre className="overflow-x-auto rounded-md border bg-muted/50 p-3 text-xs">{csvExample}</pre>
            </div>
          )}

          {format === "json" && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">JSON example</p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    downloadFile(jsonExample, "questions_template.json", "application/json")
                  }
                >
                  <Download className="size-3.5" />
                  Download JSON template
                </Button>
              </div>
              <pre className="overflow-x-auto rounded-md border bg-muted/50 p-3 text-xs">{jsonExample}</pre>
            </div>
          )}

          {format === "xlsx" && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Excel (XLSX) format</p>
              <p className="text-sm text-muted-foreground">
                Use the same column names as the table above in row 1 (the header row), with one question per
                row below it. The easiest way: download the CSV template above and open/save it as .xlsx in
                Excel or Google Sheets.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Upload file</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select value={format} onValueChange={(v) => setFormat(v ?? "csv")}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FORMATS.map((f) => (
                <SelectItem key={f.value} value={f.value}>
                  {f.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <FileDropzone
            file={file}
            onFileChange={setFile}
            accept=".csv,.json,.xlsx"
            hint="CSV, JSON, or XLSX"
          />

          <Button onClick={handleUpload} disabled={isUploading || !file} className="w-full sm:w-auto">
            {isUploading ? "Uploading..." : "Upload"}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Import result</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-4 text-sm">
              <span>Total: {result.total}</span>
              <span className="text-emerald-600">Success: {result.success}</span>
              <span className="text-destructive">Failed: {result.failed}</span>
            </div>
            {result.errors.length > 0 && (
              <div className="max-h-60 overflow-y-auto rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Row</TableHead>
                      <TableHead>Errors</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {result.errors.map((e) => (
                      <TableRow key={e.row}>
                        <TableCell>{e.row}</TableCell>
                        <TableCell>{e.errors.join(", ")}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Import history</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>File</TableHead>
                <TableHead>Format</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Success</TableHead>
                <TableHead>Failed</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(history ?? []).map((h) => (
                <TableRow key={h.id}>
                  <TableCell>{h.file_name}</TableCell>
                  <TableCell>{h.file_format}</TableCell>
                  <TableCell>{h.total}</TableCell>
                  <TableCell>{h.success}</TableCell>
                  <TableCell>{h.failed}</TableCell>
                  <TableCell>
                    <Badge variant={h.status === "COMPLETED" ? "default" : "destructive"}>{h.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
