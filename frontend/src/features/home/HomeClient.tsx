"use client";

import { useQuery } from "@tanstack/react-query";
import { ArrowRight, BarChart3, Clock, ListChecks, SearchCheck, Timer, Trophy } from "lucide-react";
import Link from "next/link";

import { CategoryGrid } from "@/components/exam/CategoryGrid";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getCategories } from "@/services/exam.service";

const FEATURES = [
  { icon: ListChecks, title: "Topic-wise Practice", description: "Drill down from subject to chapter to topic with instant feedback." },
  { icon: Clock, title: "Full-length Mock Tests", description: "Simulate the real exam with timers, negative marking, and palettes." },
  { icon: BarChart3, title: "Detailed Analytics", description: "See your weak topics, accuracy trends, and rank after every attempt." },
  { icon: Trophy, title: "All-India Ranking", description: "Compare your performance nationally, by exam, weekly, and monthly." },
];

const STEPS = [
  { icon: SearchCheck, title: "Pick your exam", description: "Choose your exam category and start with topic-wise practice questions." },
  { icon: Timer, title: "Attempt mock tests", description: "Take full-length mock tests under real exam conditions with a timer." },
  { icon: BarChart3, title: "Track & improve", description: "Review your analytics, fix weak topics, and climb the all-India ranking." },
];

export function HomeClient() {
  const { data: categories, isLoading } = useQuery({ queryKey: ["categories"], queryFn: getCategories });

  return (
    <div className="flex flex-1 flex-col">
      <section className="relative overflow-hidden bg-gradient-to-br from-[#f97316] via-[#f97316] to-[#7f1d1d] px-6 pt-28 pb-24 text-center text-white sm:pt-32">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-25 [background-image:radial-gradient(circle_at_15%_20%,white,transparent_35%),radial-gradient(circle_at_85%_70%,white,transparent_30%)]"
        />
        <div className="relative">
          <span className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-xs font-medium">
            Trusted by aspirants preparing for SSC, UPSC, Banking &amp; more
          </span>
          <h1 className="mx-auto mt-6 max-w-2xl font-heading text-4xl font-bold tracking-tight sm:text-5xl">
            Crack Your Government Exam with Gyanahut Edu
          </h1>
          <p className="mx-auto mt-3 text-sm italic text-white/70">अभ्यासात् सिद्धिः — Success through Practice</p>
          <p className="mx-auto mt-4 max-w-xl text-white/85">
            Practice questions, attempt mock tests, and track your progress for SSC, UPSC, Banking, Railway, and
            more. Join thousands of successful aspirants today.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Button size="lg" variant="secondary" className="h-12 px-8 font-normal" render={<Link href="/register" />}>
              Get Started Free
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12 border-white/30 bg-white/10 px-8 font-normal text-white hover:bg-white/20"
              render={<Link href="/categories" />}
            >
              Browse Exams
            </Button>
          </div>
        </div>

        <div aria-hidden className="pointer-events-none absolute inset-x-0 -bottom-1 leading-none">
          <svg
            className="block h-12 w-full text-background"
            preserveAspectRatio="none"
            viewBox="0 0 1200 120"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1200 120L0 120 309.19 8.18 451.74 116.56 618.17 31.41 788.1 118.25 930.58 30.77 1200 120z"
              fill="currentColor"
            />
          </svg>
        </div>
      </section>

      <section className="mx-auto w-full max-w-5xl px-6 py-16">
        <div className="mb-10 text-center">
          <h2 className="font-heading text-2xl font-semibold">How It Works</h2>
          <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-[#f97316]" />
        </div>
        <div className="relative grid grid-cols-1 gap-8 sm:grid-cols-3">
          <div
            aria-hidden
            className="absolute top-6 left-0 right-0 hidden border-t border-dashed border-border sm:block"
          />
          {STEPS.map((step, index) => (
            <div key={step.title} className="group relative text-center">
              <div className="relative mx-auto mb-4 flex size-20 items-center justify-center rounded-full bg-gradient-to-br from-[#f97316] to-[#7f1d1d] text-primary-foreground shadow-lg shadow-primary/20 transition-transform duration-200 group-hover:scale-110">
                <step.icon className="size-9" />
                <span className="absolute -top-1 -right-1 flex size-8 items-center justify-center rounded-full border-4 border-background bg-foreground text-xs font-bold text-background">
                  {index + 1}
                </span>
              </div>
              <h3 className="font-heading text-lg font-semibold">{step.title}</h3>
              <p className="mt-1 text-sm text-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-5xl space-y-6 border-t px-6 py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-heading text-2xl font-semibold">Popular Exam Categories</h2>
            <p className="mt-1 text-sm text-foreground">
              Explore hundreds of mock tests for various competitive exams.
            </p>
          </div>
          <Button variant="link" className="px-0" render={<Link href="/categories" />}>
            View all categories <ArrowRight className="size-4" />
          </Button>
        </div>
        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        ) : (
          <CategoryGrid categories={categories ?? []} />
        )}
      </section>

      <section className="border-t bg-muted/30 px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="font-heading text-2xl font-semibold">Why Gyanahut Edu?</h2>
            <Button variant="outline" render={<Link href="/features" />}>
              See all features
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((feature) => (
              <Card
                key={feature.title}
                className="border-transparent shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10"
              >
                <CardHeader>
                  <feature.icon className="size-9 text-primary" />
                  <CardTitle className="pt-2 text-2xl leading-tight font-semibold">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t px-6 py-16 text-center">
        <h2 className="font-heading text-2xl font-semibold">Ready to start your preparation?</h2>
        <p className="mx-auto mt-2 max-w-md text-muted-foreground">
          Join thousands of students already using Gyanahut Edu to turn their dreams into government careers.
        </p>
        <div className="mt-6 flex justify-center">
          <Button size="lg" render={<Link href="/register" />}>
            Get Started Free <ArrowRight className="size-4" />
          </Button>
        </div>
      </section>

      <footer className="border-t px-6 py-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Gyanahut Edu. All rights reserved.
      </footer>
    </div>
  );
}
