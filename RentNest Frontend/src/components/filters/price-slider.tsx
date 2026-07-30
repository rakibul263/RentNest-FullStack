"use client";

import * as React from "react";
import { cn, formatCurrency } from "@/lib/utils";

interface PriceSliderProps {
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  step?: number;
  className?: string;
}

export function PriceSlider({
  min,
  max,
  value,
  onChange,
  step = 50,
  className,
}: PriceSliderProps) {
  const [lo, hi] = value;

  const handleLo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Math.min(Number(e.target.value), hi - step);
    onChange([v, hi]);
  };
  const handleHi = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Math.max(Number(e.target.value), lo + step);
    onChange([lo, v]);
  };

  const pct = (v: number) => ((v - min) / (max - min)) * 100;

  return (
    <div className={cn("w-full", className)}>
      <div className="mb-5 flex items-center justify-between">
        <div className="rounded-lg bg-muted px-2.5 py-1 text-xs font-semibold text-foreground">
          {formatCurrency(lo)}
        </div>
        <div className="rounded-lg bg-muted px-2.5 py-1 text-xs font-semibold text-foreground">
          {formatCurrency(hi)}
        </div>
      </div>

      <div className="relative h-6">
        <div className="absolute top-1/2 h-1.5 w-full -translate-y-1/2 rounded-full bg-muted" />
        <div
          className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-primary"
          style={{ left: `${pct(lo)}%`, right: `${100 - pct(hi)}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={lo}
          onChange={handleLo}
          className="slider-input pointer-events-none absolute inset-0 h-full w-full cursor-pointer appearance-none bg-transparent [&::-moz-range-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:pointer-events-auto"
          aria-label="Minimum price"
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={hi}
          onChange={handleHi}
          className="slider-input pointer-events-none absolute inset-0 h-full w-full cursor-pointer appearance-none bg-transparent [&::-moz-range-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:pointer-events-auto"
          aria-label="Maximum price"
        />
      </div>
      <style jsx>{`
        .slider-input::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          pointer-events: auto;
          height: 20px;
          width: 20px;
          border-radius: 9999px;
          background: var(--color-primary);
          border: 3px solid var(--color-card);
          box-shadow: 0 1px 4px rgb(0 0 0 / 0.3);
          cursor: grab;
        }
        .slider-input::-moz-range-thumb {
          pointer-events: auto;
          height: 20px;
          width: 20px;
          border-radius: 9999px;
          background: var(--color-primary);
          border: 3px solid var(--color-card);
          box-shadow: 0 1px 4px rgb(0 0 0 / 0.3);
          cursor: grab;
        }
      `}</style>
    </div>
  );
}
