"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: React.ReactNode;
};

export function Checkbox({ label, className, ...props }: Props) {
  return (
    <label className={cn("inline-flex items-center gap-2 cursor-pointer select-none", className)}>
      <span className="relative inline-flex">
        <input
          type="checkbox"
          className="peer h-4 w-4 cursor-pointer appearance-none rounded border border-border-strong bg-surface checked:bg-accent checked:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
          {...props}
        />
        <Check
          size={12}
          className="pointer-events-none absolute inset-0 m-auto text-accent-foreground opacity-0 peer-checked:opacity-100"
        />
      </span>
      {label && <span className="text-sm">{label}</span>}
    </label>
  );
}
