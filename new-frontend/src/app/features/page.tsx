import Link from "next/link";

import { PublicFooter } from "@/components/common/PublicFooter";
import { PublicHeader } from "@/components/common/PublicHeader";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const FEATURES = [
  {
    title: "Topic-wise practice",
    body: "Drill into a single chapter or topic until it's second nature.",
  },
  {
    title: "Full-length mock tests",
    body: "Complete exam simulations with real question count and duration.",
  },
  {
    title: "Accurate negative marking",
    body: "Every mock mirrors the exact penalty structure of the real exam.",
  },
  {
    title: "Detailed analytics",
    body: "Subject-wise accuracy, time spent, and where marks are slipping.",
  },
  {
    title: "All-India ranking",
    body: "Compare your score against every other aspirant on the same test.",
  },
  {
    title: "Bookmarks & revision",
    body: "Save questions and revisit your wrong and difficult ones anytime.",
  },
];

export default function FeaturesPage() {
  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <PublicHeader />

      <main className="flex-1">
        <section className="mx-auto max-w-3xl px-8 py-16 text-center md:px-16">
          <h1 className="font-heading text-[28px] font-semibold text-fg">
            Everything you need to clear the cut-off
          </h1>
          <p className="mt-3 text-[13.5px] text-muted-fg">
            Built around how Indian competitive exams are actually scored — negative marking included.
          </p>
          <Link href="/register" className={cn(buttonVariants({ size: "lg" }), "mt-6 inline-flex")}>
            Start practicing free
          </Link>
        </section>

        <section className="mx-auto max-w-6xl px-8 pb-16 md:px-16">
          <div className="grid gap-5 md:grid-cols-3">
            {FEATURES.map((feature) => (
              <Card key={feature.title} className="p-6">
                <span className="block h-7 w-7 rounded-full bg-chip-bg" />
                <h3 className="mt-4 font-heading text-sm font-semibold text-fg">{feature.title}</h3>
                <p className="mt-1.5 text-[11.5px] text-muted-fg">{feature.body}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-8 pb-16 md:px-16">
          <div className="rounded-2xl bg-sidebar-bg px-8 py-9 text-center">
            <h2 className="font-heading text-lg font-semibold text-white">
              Ready to start your preparation?
            </h2>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <Link href="/register" className={buttonVariants()}>
                Create account
              </Link>
              <Link
                href="/exams"
                className={cn(buttonVariants({ variant: "outline" }), "border-white/50 text-white hover:bg-white/10")}
              >
                Browse exams
              </Link>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
