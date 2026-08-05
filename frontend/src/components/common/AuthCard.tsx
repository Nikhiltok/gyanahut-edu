import { BadgeCheck, BarChart3, BrainCircuit, MonitorPlay, ShieldCheck } from "lucide-react";

import { Logo } from "@/components/common/Logo";

interface AuthCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

const HIGHLIGHTS = [
  { icon: MonitorPlay, title: "Live Tests", text: "Real-time competitive environment with thousands of peers." },
  { icon: BrainCircuit, title: "Question Bank", text: "100,000+ curated problems with deep conceptual solutions." },
  { icon: BarChart3, title: "Performance Analytics", text: "AI-driven insights to pinpoint and fix weak areas." },
];

const BADGES = [
  { icon: BadgeCheck, text: "NTA Compliant" },
  { icon: ShieldCheck, text: "Secure Environment" },
];

export function AuthCard({ title, description, children }: AuthCardProps) {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-primary via-primary to-[#721315] p-10 text-white lg:flex">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_20%_20%,white,transparent_35%),radial-gradient(circle_at_80%_60%,white,transparent_30%)]"
        />
        <Logo dark showTagline />

        <div className="relative space-y-6">
          <h2 className="max-w-sm text-4xl font-bold leading-tight">Master Your Exams</h2>
          <ul className="space-y-4">
            {HIGHLIGHTS.map((item) => (
              <li
                key={item.title}
                className="flex items-start gap-4 rounded-2xl border border-white/15 bg-white/10 p-4"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white/15">
                  <item.icon className="size-5" />
                </span>
                <div>
                  <p className="font-semibold">{item.title}</p>
                  <p className="mt-0.5 text-sm text-white/80">{item.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative flex items-center gap-6 text-xs text-white/80">
          {BADGES.map((badge) => (
            <span key={badge.text} className="flex items-center gap-1.5">
              <badge.icon className="size-4" />
              {badge.text}
            </span>
          ))}
        </div>
      </div>

      <div className="flex min-h-screen flex-col px-6 py-12">
        <div className="self-center lg:hidden">
          <Logo />
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm space-y-6">
            <div className="space-y-1.5 text-center lg:text-left">
              <h1 className="font-heading text-3xl font-bold tracking-tight">{title}</h1>
              {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
            </div>
            {children}
          </div>
        </div>
        <p className="text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Gyanahut Edu. All rights reserved.
        </p>
      </div>
    </div>
  );
}
