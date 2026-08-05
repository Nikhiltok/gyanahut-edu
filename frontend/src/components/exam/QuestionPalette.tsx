import { cn } from "@/lib/utils";

export type QuestionStatus = "not-visited" | "not-answered" | "answered" | "marked" | "answered-marked";

interface QuestionPaletteProps {
  count: number;
  currentIndex: number;
  statuses: QuestionStatus[];
  onSelect: (index: number) => void;
}

const STATUS_CLASSES: Record<QuestionStatus, string> = {
  "not-visited": "bg-muted text-muted-foreground",
  "not-answered": "bg-destructive text-white",
  answered: "bg-emerald-600 text-white",
  marked: "bg-blue-600 text-white",
  "answered-marked": "bg-blue-600 text-white ring-2 ring-emerald-500 ring-inset",
};

const LEGEND: { status: QuestionStatus; label: string }[] = [
  { status: "answered", label: "Answered" },
  { status: "not-answered", label: "Not Answered" },
  { status: "marked", label: "Marked for Review" },
  { status: "not-visited", label: "Not Visited" },
];

export function QuestionPalette({ count, currentIndex, statuses, onSelect }: QuestionPaletteProps) {
  const countsByStatus = statuses.reduce<Partial<Record<QuestionStatus, number>>>((acc, status) => {
    acc[status] = (acc[status] ?? 0) + 1;
    return acc;
  }, {});
  const markedTotal = (countsByStatus.marked ?? 0) + (countsByStatus["answered-marked"] ?? 0);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-5 gap-2">
        {Array.from({ length: count }).map((_, index) => (
          <button
            key={index}
            onClick={() => onSelect(index)}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-lg text-sm font-semibold shadow-sm transition-transform hover:scale-105",
              currentIndex === index
                ? "bg-[#f97316] text-white ring-2 ring-[#f97316] ring-offset-2 ring-offset-background"
                : STATUS_CLASSES[statuses[index] ?? "not-visited"],
            )}
          >
            {index + 1}
          </button>
        ))}
      </div>

      <div className="space-y-2 border-t pt-3 text-sm text-muted-foreground">
        {LEGEND.map((item) => (
          <div key={item.status} className="flex items-center gap-2">
            <span className={cn("size-3 shrink-0 rounded-sm", STATUS_CLASSES[item.status])} />
            {item.label} ({item.status === "marked" ? markedTotal : (countsByStatus[item.status] ?? 0)})
          </div>
        ))}
      </div>
    </div>
  );
}
