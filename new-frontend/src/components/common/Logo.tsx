import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="h-4 w-4 rounded-full border-[1.5px] border-gold bg-gold" />
      <span className="font-heading text-base font-bold text-white">Gyanahut Edu</span>
    </div>
  );
}
