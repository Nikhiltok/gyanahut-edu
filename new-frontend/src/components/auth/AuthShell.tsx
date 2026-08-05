import { ThemeToggle } from "@/components/common/ThemeToggle";
import { Logo } from "@/components/common/Logo";

const FEATURES = [
  "Live tests with real-time ranking",
  "10,000+ question bank",
  "Performance analytics after every attempt",
];

const BADGES = ["NTA compliant", "Secure environment"];

export function AuthShell({
  tagline,
  children,
}: {
  tagline: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-bg px-4 py-10">
      <div className="absolute right-6 top-6">
        <ThemeToggle />
      </div>

      <div className="flex w-full max-w-[900px] overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
        <div className="hidden w-[340px] shrink-0 flex-col justify-between bg-sidebar-bg p-9 text-white md:flex">
          <div>
            <Logo />
            <h2 className="mt-9 font-heading text-xl font-semibold">Master your exams</h2>
            <p className="mt-2 text-[12.5px] leading-relaxed text-white/60">{tagline}</p>

            <div className="mt-6 space-y-0 border-t border-white/15">
              {FEATURES.map((feature) => (
                <div key={feature} className="flex items-center gap-3 border-b border-white/15 py-3">
                  <span className="h-[22px] w-[22px] shrink-0 rounded-full border-[1.6px] border-gold" />
                  <span className="text-[12.5px] text-white/90">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {BADGES.map((badge) => (
              <span
                key={badge}
                className="rounded-[5px] bg-gold/[0.22] px-3 py-1 font-mono text-[11px] font-medium text-chip-fg"
              >
                {badge}
              </span>
            ))}
          </div>
        </div>

        <div className="flex-1 p-9 sm:p-11">{children}</div>
      </div>
    </div>
  );
}
