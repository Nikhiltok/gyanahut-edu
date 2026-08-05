import { cn } from "@/lib/utils";

export function GradientBanner({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary to-[#721315] p-8 text-white shadow-lg shadow-primary/20",
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-25 [background-image:radial-gradient(circle_at_15%_20%,white,transparent_35%),radial-gradient(circle_at_85%_80%,white,transparent_30%)]"
      />
      <div className="relative">{children}</div>
    </div>
  );
}
