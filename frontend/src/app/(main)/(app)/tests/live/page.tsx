"use client";

import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { useState } from "react";

import { PageHeader } from "@/components/common/PageHeader";
import { TestCard } from "@/components/exam/TestCard";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getProfile } from "@/services/auth.service";
import { getLiveTests } from "@/services/test.service";

const ALL_SUBJECTS = "__ALL__";

export default function LiveTestsPage() {
  const { data: tests, isLoading } = useQuery({ queryKey: ["tests-live"], queryFn: getLiveTests });
  const { data: profile } = useQuery({ queryKey: ["profile"], queryFn: getProfile });
  const [search, setSearch] = useState("");
  const [activeSubject, setActiveSubject] = useState(ALL_SUBJECTS);

  const targetExamIds = new Set((profile?.target_exams ?? []).map((e) => e.id));
  const targetExamTests =
    targetExamIds.size > 0 ? (tests ?? []).filter((t) => targetExamIds.has(t.exam)) : (tests ?? []);

  const subjects = Array.from(
    new Set(targetExamTests.map((t) => t.subject_name).filter((name): name is string => !!name)),
  );

  const filteredTests = targetExamTests
    .filter((t) => activeSubject === ALL_SUBJECTS || t.subject_name === activeSubject)
    .filter((t) => t.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="w-full space-y-6 p-8">
      <PageHeader
        title="Live Tests"
        subtitle={targetExamIds.size > 0 ? "Showing tests for your target exam(s)." : "Attempt tests that are live right now."}
      />

      {!isLoading && (tests ?? []).length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Tabs value={activeSubject} onValueChange={(v) => setActiveSubject((v as string) ?? ALL_SUBJECTS)}>
            <TabsList>
              <TabsTrigger value={ALL_SUBJECTS}>All Subjects</TabsTrigger>
              {subjects.map((subject) => (
                <TabsTrigger key={subject} value={subject}>
                  {subject}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search tests..."
              className="w-56 pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      )}

      {isLoading ? (
        <Skeleton className="h-24 w-full" />
      ) : filteredTests.length === 0 ? (
        <p className="text-muted-foreground">No live tests right now.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTests.map((test) => (
            <TestCard key={test.id} test={test} actionLabel="Attempt" />
          ))}
        </div>
      )}
    </div>
  );
}
