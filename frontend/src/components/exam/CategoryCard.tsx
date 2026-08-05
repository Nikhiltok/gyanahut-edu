import {
  ArrowRight,
  Banknote,
  BookOpen,
  Building2,
  Calculator,
  Cog,
  GraduationCap,
  MapPin,
  Scale,
  Shield,
  Stethoscope,
  TrainFront,
} from "lucide-react";
import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ExamCategory } from "@/types/exam";

const ICON_RULES: { match: RegExp; icon: typeof BookOpen }[] = [
  { match: /ssc/i, icon: Building2 },
  { match: /upsc/i, icon: Scale },
  { match: /bank/i, icon: Banknote },
  { match: /rail/i, icon: TrainFront },
  { match: /charter|ca\b|commerce/i, icon: Calculator },
  { match: /defence|defense|police|army/i, icon: Shield },
  { match: /engineer/i, icon: Cog },
  { match: /medical|health/i, icon: Stethoscope },
  { match: /state|government/i, icon: MapPin },
  { match: /teach/i, icon: GraduationCap },
];

function iconFor(name: string) {
  return ICON_RULES.find((rule) => rule.match.test(name))?.icon ?? BookOpen;
}

export function CategoryCard({ category }: { category: ExamCategory }) {
  // Category names are dynamic seeded data (admin can add more), not a fixed
  // static set — the icon is genuinely resolved by name at render time.
  const Icon = iconFor(category.name);

  return (
    <Link href={`/category/${category.slug}`} className="group block h-full">
      <Card className="h-full border-border/60 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10">
        <CardHeader>
          <span className="flex size-12 items-center justify-center rounded-lg bg-[#ffdbca] text-primary">
            {/* eslint-disable-next-line react-hooks/static-components -- icon intentionally resolved by category name */}
            <Icon className="size-6" />
          </span>
          <CardTitle className="pt-2 text-2xl font-semibold">{category.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="line-clamp-2 text-sm text-foreground">{category.description}</p>
          <span className="flex items-center gap-1 text-sm font-medium text-primary">
            Explore tests
            <ArrowRight className="size-4 -translate-x-1 transition-transform duration-200 group-hover:translate-x-0" />
          </span>
        </CardContent>
      </Card>
    </Link>
  );
}
