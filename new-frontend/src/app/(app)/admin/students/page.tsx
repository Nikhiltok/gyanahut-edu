"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getAdminStudents } from "@/services/student.service";

export default function AdminStudentsPage() {
  const [search, setSearch] = useState("");
  const { data: students, isLoading } = useQuery({
    queryKey: ["admin-students", search],
    queryFn: () => getAdminStudents(search ? { search } : undefined),
  });

  return (
    <div className="space-y-5">
      <Input
        placeholder="Search by name, email, or phone"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-[320px]"
      />

      <Card className="overflow-x-auto p-0">
        <table className="w-full text-left text-[12px]">
          <thead>
            <tr className="border-b border-border text-[11.5px] font-semibold text-muted-fg">
              <th className="px-6 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Target exam</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-6 py-3">Joined</th>
            </tr>
          </thead>
          <tbody>
            {(students ?? []).map((student) => (
              <tr key={student.id} className="border-b border-border/60 last:border-none">
                <td className="px-6 py-3 text-fg">{student.name}</td>
                <td className="px-4 py-3 text-fg">{student.email}</td>
                <td className="px-4 py-3 text-fg">{student.phone || "—"}</td>
                <td className="px-4 py-3 text-fg">
                  {[student.city, student.state].filter(Boolean).join(", ") || "—"}
                </td>
                <td className="px-4 py-3 text-fg">
                  {student.target_exams.map((e) => e.name).join(", ") || "—"}
                </td>
                <td className={student.is_active ? "px-4 py-3 text-success-fg" : "px-4 py-3 text-muted-fg"}>
                  {student.is_active ? "Active" : "Inactive"}
                </td>
                <td className="px-6 py-3 text-fg">
                  {new Date(student.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {isLoading && <p className="p-4 text-sm text-muted-fg">Loading students…</p>}
        {!isLoading && students?.length === 0 && <p className="p-4 text-sm text-muted-fg">No students found.</p>}
      </Card>
    </div>
  );
}
