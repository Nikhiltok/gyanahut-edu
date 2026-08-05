import { cn } from "@/lib/utils";
import { resolveMediaUrl } from "@/utils/media";

function initials(name?: string) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase() || "?";
}

interface UserAvatarProps {
  name?: string;
  imageUrl?: string | null;
  className?: string;
}

export function UserAvatar({ name, imageUrl, className }: UserAvatarProps) {
  const src = resolveMediaUrl(imageUrl);
  return (
    <span
      className={cn(
        "flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white/15 text-sm font-semibold text-white",
        className,
      )}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={name ?? "Profile"} className="size-full object-cover" />
      ) : (
        initials(name)
      )}
    </span>
  );
}
