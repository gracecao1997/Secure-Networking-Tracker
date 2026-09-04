import * as React from "react";
import { cn } from "@/lib/utils";
import type { Priority } from "@/lib/types";

const priorityClass: Record<Priority, string> = {
  high: "border-red-200 bg-red-50 text-red-800",
  medium: "border-amber-200 bg-amber-50 text-amber-900",
  low: "border-teal-200 bg-teal-50 text-teal-800",
};

export function Badge({
  className,
  priority,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { priority?: Priority }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-[var(--radius)] border px-2 py-1 text-xs font-medium capitalize",
        priority ? priorityClass[priority] : "border-border bg-muted text-foreground",
        className,
      )}
      {...props}
    />
  );
}
