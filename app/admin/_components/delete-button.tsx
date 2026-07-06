"use client";

import { useFormStatus } from "react-dom";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function DeleteButton({
  confirmLabel = "Delete this item?",
  compact = false,
}: {
  confirmLabel?: string;
  compact?: boolean;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      onClick={(e) => {
        if (!confirm(confirmLabel)) e.preventDefault();
      }}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md text-sm text-destructive transition-colors hover:bg-destructive/10 disabled:opacity-50",
        compact ? "px-2 py-1" : "px-3 py-2",
      )}
    >
      <Trash2 className="size-4" />
      {!compact && (pending ? "Deleting..." : "Delete")}
    </button>
  );
}
