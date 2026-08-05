"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

import { PublicFooter } from "@/components/common/PublicFooter";
import { PublicHeader } from "@/components/common/PublicHeader";
import { Card } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getCategories } from "@/services/exam.service";

const STEPS = [
  { number: "1", title: "Pick your exam", body: "Choose from SSC, UPSC, Banking, Railways and more." },
  { number: "2", title: "Attempt mock tests", body: "Live tests, scheduled mocks, or infinite practice." },
  { number: "3", title: "Track and improve", body: "Accuracy, rank and weak-topic analytics." },
];

const REASONS = [
  { letter: "A", title: "Topic-wise practice", body: "Drill down to the exact chapter you're weak in." },
  { letter: "B", title: "Full-length mock tests", body: "Simulate the real exam hall, timer included." },
  { letter: "C", title: "Detailed analytics", body: "See exactly where marks are being lost." },
  { letter: "D", title: "All-India ranking", body: "Know where you stand against every aspirant." },
];

export default function HomePage() {
  const { data: categories } = useQuery({ queryKey: ["categories"], queryFn: getCategories });

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <PublicHeader />

      <main className="flex-1">
        <section className="mx-auto grid max-w-6xl gap-10 px-8 py-16 md:grid-cols-2 md:px-16">
          <div>
            <span className="inline-block rounded-[5px] bg-chip-bg px-4 py-1.5 font-mono text-[11px] font-medium text-chip-fg">
              Trusted by aspirants preparing for SSC, UPSC, Banking and more
            </span>
            <h1 className="mt-6 font-heading text-4xl font-semibold leading-tight text-fg">
              Crack your government exam with Gyanahut Edu
            </h1>
            <p className="mt-4 font-mono text-[13px] text-accent-fg">
              विद्या ददाति विनयं — knowledge grants discipline.
            </p>
            <p className="mt-3 text-[15px] leading-relaxed text-muted-fg">
              Topic-wise practice, full-length mocks and live ranked tests, built around real exam structure.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/register" className={buttonVariants({ size: "lg" })}>
                Get started free
              </Link>
              <Link href="/exams" className={buttonVariants({ variant: "outline", size: "lg" })}>
                Browse exams
              </Link>
            </div>
          </div>

          <Card className="relative overflow-hidden p-7">
            <div className="absolute left-0 top-0 h-full w-2.5 bg-chip-bg" />
            <div className="flex items-center justify-between">
              <span className="font-heading text-[15px] font-bold text-fg">Gyanahut Edu</span>
              <span className="rounded-[5px] bg-chip-bg px-3 py-1 font-mono text-[11px] font-medium text-chip-fg">
                Hall ticket
              </span>
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-dashed border-border pt-4">
              <span className="text-[12.5px] text-muted-fg">Candidate</span>
              <span className="text-[12.5px] font-medium text-fg">Aspirant, You</span>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-[12.5px] text-muted-fg">Target exam</span>
              <span className="text-[12.5px] font-medium text-fg">SSC CGL · Banking PO</span>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-[12.5px] text-muted-fg">Roll no.</span>
              <span className="text-[12.5px] font-medium text-fg">GH-2026-04471</span>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-[12.5px] text-muted-fg">Status</span>
              <span className="text-[12.5px] font-medium text-success-fg">Eligible to attempt</span>
            </div>
            <div className="mt-6 flex h-8 items-end gap-1">
              {[18, 30, 12, 24, 16, 28, 10, 20, 15, 29, 14, 19].map((h, i) => (
                <span key={i} className="w-1 rounded-sm bg-fg" style={{ height: `${h}px` }} />
              ))}
            </div>
          </Card>
        </section>

        <section className="mx-auto max-w-6xl px-8 py-10 md:px-16">
          <h2 className="font-heading text-2xl font-semibold text-fg">How it works</h2>
          <p className="mt-1 text-[13.5px] text-muted-fg">Three steps, same as any exam-day routine.</p>

          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {STEPS.map((step) => (
              <Card key={step.number} className="p-6">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-chip-bg font-heading text-base font-bold text-chip-fg">
                  {step.number}
                </span>
                <h3 className="mt-4 font-heading text-[15.5px] font-semibold text-fg">{step.title}</h3>
                <p className="mt-1.5 text-xs text-muted-fg">{step.body}</p>
              </Card>
            ))}
          </div>
        </section>

        <section id="categories" className="mx-auto max-w-6xl scroll-mt-24 px-8 py-10 md:px-16">
          <h2 className="font-heading text-2xl font-semibold text-fg">Popular exam categories</h2>
          <p className="mt-1 text-[13.5px] text-muted-fg">A live look at what aspirants are practising right now.</p>

          {categories?.length === 0 && (
            <p className="mt-6 text-sm text-muted-fg">No exam categories are published yet.</p>
          )}

          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {(categories ?? []).slice(0, 4).map((category) => (
              <Card key={category.id} className="p-6">
                <span className="block h-7 w-7 rounded-full bg-chip-bg" />
                <h3 className="mt-4 font-heading text-[15px] font-semibold text-fg">{category.name}</h3>
                <p className="mt-1 text-[11.5px] text-muted-fg">{category.description}</p>
                <Link href={`/exams/${category.slug}`} className="mt-3 block text-[11.5px] font-medium text-accent-fg">
                  Explore tests →
                </Link>
              </Card>
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <Link href="/exams" className={buttonVariants({ variant: "outline" })}>
              View all categories
            </Link>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-8 py-10 md:px-16">
          <h2 className="font-heading text-2xl font-semibold text-fg">Why Gyanahut Edu?</h2>
          <div className="mt-6 grid gap-x-10 gap-y-6 sm:grid-cols-2">
            {REASONS.map((reason) => (
              <div key={reason.letter} className="flex gap-3">
                <span className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-gold font-mono text-[11px] font-semibold text-gold-ink">
                  {reason.letter}
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-fg">{reason.title}</h3>
                  <p className="mt-1 text-xs text-muted-fg">{reason.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-8 py-10 md:px-16">
          <div className={cn("rounded-2xl bg-sidebar-bg px-8 py-10 text-center")}>
            <h2 className="font-heading text-xl font-semibold text-white">
              Your admit card to a government job starts here
            </h2>
            <p className="mt-2 text-[13px] text-white/65">Free to start. No credit card required.</p>
            <Link href="/register" className={cn(buttonVariants({ size: "lg" }), "mt-6 inline-flex")}>
              Get started free
            </Link>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
