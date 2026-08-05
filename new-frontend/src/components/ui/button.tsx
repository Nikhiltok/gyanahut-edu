import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold font-sans transition-colors disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50",
  {
    variants: {
      variant: {
        primary: "bg-gold text-gold-ink hover:brightness-105",
        outline: "border border-outline-border bg-transparent text-fg hover:bg-fg/5",
        ghost: "bg-transparent text-accent-fg hover:underline",
      },
      size: {
        default: "h-11 px-5",
        sm: "h-9 px-4 text-[13px]",
        lg: "h-[44px] px-6",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}
