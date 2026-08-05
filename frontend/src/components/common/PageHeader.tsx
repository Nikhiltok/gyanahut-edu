import { GradientBanner } from "@/components/common/GradientBanner";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <GradientBanner>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
          {subtitle && <p className="mt-2 text-sm text-white/85">{subtitle}</p>}
        </div>
        {action && <div className="flex flex-wrap items-center gap-3">{action}</div>}
      </div>
    </GradientBanner>
  );
}
