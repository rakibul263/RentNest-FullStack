"use client";

import { Star } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";

export function RatingStars({
  value,
  onChange,
  size = 18,
  className,
  readOnly,
}: {
  value: number;
  onChange?: (v: number) => void;
  size?: number;
  className?: string;
  readOnly?: boolean;
}) {
  const [hover, setHover] = React.useState<number | null>(null);
  const active = hover ?? value;

  return (
    <div
      className={cn("flex items-center gap-0.5", className)}
      role={readOnly ? undefined : "radiogroup"}
      aria-label={readOnly ? `Rated ${value} out of 5` : undefined}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = active >= star;
        const partial = !filled && active > star - 1;
        return (
          <button
            key={star}
            type="button"
            disabled={readOnly}
            onClick={() => onChange?.(star)}
            onMouseEnter={() => !readOnly && setHover(star)}
            onMouseLeave={() => !readOnly && setHover(null)}
            className={cn(
              "transition-transform",
              !readOnly && "cursor-pointer hover:scale-125",
              readOnly && "cursor-default"
            )}
            aria-label={readOnly ? undefined : `Rate ${star} stars`}
            aria-checked={readOnly ? undefined : value === star}
            role={readOnly ? undefined : "radio"}
          >
            <span className="relative inline-flex">
              <Star
                style={{ width: size, height: size }}
                className={cn(
                  "text-muted transition-colors",
                  (filled || partial) && "text-accent"
                )}
                fill={filled || partial ? "currentColor" : "none"}
                strokeWidth={1.5}
              />
              {partial && (
                <span className="absolute inset-0 overflow-hidden" style={{ width: `${(active % 1) * 100}%` }}>
                  <Star
                    style={{ width: size, height: size }}
                    className="text-accent"
                    fill="currentColor"
                    strokeWidth={1.5}
                  />
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export function StarDisplay({ value, size = 14 }: { value: number; size?: number }) {
  const full = Math.floor(value);
  const hasHalf = value - full >= 0.5;
  return (
    <span className="inline-flex items-center">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          style={{ width: size, height: size }}
          className={cn(
            "text-muted",
            (s <= full || (s === full + 1 && hasHalf)) && "text-accent"
          )}
          fill={s <= full || (s === full + 1 && hasHalf) ? "currentColor" : "none"}
          strokeWidth={1.5}
        />
      ))}
    </span>
  );
}
