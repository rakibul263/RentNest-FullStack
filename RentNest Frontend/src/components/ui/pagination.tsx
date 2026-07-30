"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  page: number;
  totalPages: number;
  total?: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({
  page,
  totalPages,
  total,
  onPageChange,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages: number[] = [];
  const start = Math.max(1, Math.min(page - 2, totalPages - 4));
  const end = Math.min(totalPages, start + 4);
  for (let i = start; i <= end; i++) pages.push(i);

  const btn =
    "inline-flex h-9 min-w-9 items-center justify-center rounded-xl px-2 text-sm font-semibold transition-colors";

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-3 py-4",
        className
      )}
    >
      {total !== undefined && (
        <p className="text-sm text-muted-foreground">
          {total} {total === 1 ? "result" : "results"}
        </p>
      )}
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className={cn(btn, "text-muted-foreground hover:bg-muted disabled:opacity-40")}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        {start > 1 && (
          <>
            <button onClick={() => onPageChange(1)} className={cn(btn, "text-muted-foreground hover:bg-muted")}>
              1
            </button>
            {start > 2 && <span className="px-1 text-muted-foreground">…</span>}
          </>
        )}
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={cn(
              btn,
              p === page
                ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                : "text-muted-foreground hover:bg-muted"
            )}
            aria-current={p === page ? "page" : undefined}
          >
            {p}
          </button>
        ))}
        {end < totalPages && (
          <>
            {end < totalPages - 1 && <span className="px-1 text-muted-foreground">…</span>}
            <button onClick={() => onPageChange(totalPages)} className={cn(btn, "text-muted-foreground hover:bg-muted")}>
              {totalPages}
            </button>
          </>
        )}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className={cn(btn, "text-muted-foreground hover:bg-muted disabled:opacity-40")}
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
