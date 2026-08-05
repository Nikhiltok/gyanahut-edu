import Link from "next/link";

import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  dark?: boolean;
  showTagline?: boolean;
}

export function Logo({ className, dark, showTagline }: LogoProps) {
  return (
    <Link
      href="/"
      className={cn(
        "flex flex-col text-xl leading-none font-heading font-bold tracking-tight",
        dark ? "text-white" : "text-primary",
        className,
      )}
    >
      Gyanahut Edu
      {showTagline && (
        <span className={cn("mt-1.5 text-[11px] font-normal italic", dark ? "text-white/70" : "text-muted-foreground")}>
          अभ्यासात् सिद्धिः — Success through Practice
        </span>
      )}
    </Link>
  );
}
