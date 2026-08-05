"use client";

import { useQuery } from "@tanstack/react-query";
import { Line, LineChart, ResponsiveContainer } from "recharts";

import { Card } from "@/components/ui/card";
import {
  getAdminAttemptsChart,
  getAdminDashboardStats,
  getAdminGrowthChart,
  getAdminPerformanceChart,
} from "@/services/analytics.service";
import type { DayCountPoint, DayPerformancePoint } from "@/services/analytics.service";

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <Card className="border-none bg-surface-alt p-4">
      <p className="text-[11.5px] text-muted-fg">{label}</p>
      <p className="mt-2 font-heading text-[22px] font-semibold text-fg">{value}</p>
    </Card>
  );
}

function ChartCard({
  title,
  data,
  dataKey,
}: {
  title: string;
  data: (DayCountPoint | DayPerformancePoint)[] | undefined;
  dataKey: string;
}) {
  return (
    <Card className="p-5">
      <h3 className="text-[12.5px] font-semibold text-fg">{title}</h3>
      <div className="mt-3 h-[130px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data ?? []}>
            <Line type="monotone" dataKey={dataKey} stroke="var(--gold)" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

export default function AdminDashboardPage() {
  const { data: stats } = useQuery({ queryKey: ["admin-dashboard-stats"], queryFn: getAdminDashboardStats });
  const { data: growth } = useQuery({ queryKey: ["admin-growth"], queryFn: getAdminGrowthChart });
  const { data: attempts } = useQuery({ queryKey: ["admin-attempts"], queryFn: getAdminAttemptsChart });
  const { data: performance } = useQuery({ queryKey: ["admin-performance"], queryFn: getAdminPerformanceChart });

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <StatTile label="Students" value={stats ? stats.students.toLocaleString() : "—"} />
        <StatTile label="Tests" value={stats ? String(stats.tests) : "—"} />
        <StatTile label="Questions" value={stats ? stats.questions.toLocaleString() : "—"} />
        <StatTile label="Live tests" value={stats ? String(stats.live_tests) : "—"} />
        <StatTile label="Revenue" value={stats ? `₹${stats.revenue.toLocaleString()}` : "—"} />
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <ChartCard title="Student growth (30d)" data={growth} dataKey="count" />
        <ChartCard title="Test attempts (30d)" data={attempts} dataKey="count" />
        <ChartCard title="Average score (30d)" data={performance} dataKey="average_score" />
      </div>
    </div>
  );
}
