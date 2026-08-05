"use client";

import { useQuery } from "@tanstack/react-query";

import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { adminTestApi } from "@/services/test.service";
import type { Test } from "@/types/test";

interface AttemptsListDialogProps {
  test: Test | null;
  onOpenChange: (open: boolean) => void;
}

export function AttemptsListDialog({ test, onOpenChange }: AttemptsListDialogProps) {
  const { data: attempts, isLoading } = useQuery({
    queryKey: ["admin-test-attempts", test?.id],
    queryFn: () => adminTestApi.attempts(test!.id),
    enabled: !!test,
  });

  return (
    <Dialog open={!!test} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Attempted by — {test?.title}</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading...</p>
        ) : (attempts ?? []).length === 0 ? (
          <p className="text-sm text-muted-foreground">No student has attempted this test yet.</p>
        ) : (
          <div className="max-h-96 overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Correct</TableHead>
                  <TableHead>Wrong</TableHead>
                  <TableHead>Skipped</TableHead>
                  <TableHead>Accuracy</TableHead>
                  <TableHead>Submitted At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(attempts ?? []).map((attempt) => (
                  <TableRow key={attempt.id}>
                    <TableCell>
                      <p>{attempt.student_name}</p>
                      <p className="text-xs text-muted-foreground">{attempt.student_email}</p>
                    </TableCell>
                    <TableCell className="font-medium">{attempt.score}</TableCell>
                    <TableCell>
                      <Badge variant="default">{attempt.correct_answers}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="destructive">{attempt.wrong_answers}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{attempt.skipped_answers}</Badge>
                    </TableCell>
                    <TableCell>{attempt.accuracy}%</TableCell>
                    <TableCell className="text-xs">{new Date(attempt.submitted_at).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
