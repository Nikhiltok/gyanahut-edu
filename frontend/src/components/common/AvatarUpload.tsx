"use client";

import { Camera } from "lucide-react";
import { useRef, useState } from "react";

import { resolveMediaUrl } from "@/utils/media";

function initials(name?: string) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase() || "?";
}

interface AvatarUploadProps {
  name: string;
  imageUrl: string | null;
  onUpload: (file: File) => void;
  isUploading?: boolean;
}

export function AvatarUpload({ name, imageUrl, onUpload, isUploading }: AvatarUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    onUpload(file);
  }

  const src = preview ?? resolveMediaUrl(imageUrl);

  return (
    <div className="relative inline-block">
      <div className="flex size-24 items-center justify-center overflow-hidden rounded-full border-4 border-muted bg-muted text-xl font-semibold text-muted-foreground shadow-inner">
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={name} className="size-full object-cover" />
        ) : (
          initials(name)
        )}
      </div>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={isUploading}
        className="absolute bottom-0 right-0 flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-110 disabled:opacity-50"
        aria-label="Change profile photo"
      >
        <Camera className="size-4" />
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />
    </div>
  );
}
