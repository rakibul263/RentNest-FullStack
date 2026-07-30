"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { MapPin, RotateCcw, SlidersHorizontal } from "lucide-react";
import { categoryApi } from "@/lib/api";
import { cn } from "@/lib/utils";
import { PriceSlider } from "./price-slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export interface PropertyFilterState {
  location: string;
  category: string;
  minPrice: number;
  maxPrice: number;
  bedrooms: string;
}

export const DEFAULT_FILTERS: PropertyFilterState = {
  location: "",
  category: "",
  minPrice: 0,
  maxPrice: 300000,
  bedrooms: "",
};

interface FilterSidebarProps {
  filters: PropertyFilterState;
  onChange: (f: PropertyFilterState) => void;
  onReset: () => void;
  className?: string;
  compact?: boolean;
}

export function FilterSidebar({
  filters,
  onChange,
  onReset,
  className,
  compact,
}: FilterSidebarProps) {
  const categories = useQuery({
    queryKey: ["categories"],
    queryFn: categoryApi.list,
  });

  const hasActiveFilters =
    filters.location ||
    filters.category ||
    filters.bedrooms ||
    filters.minPrice !== DEFAULT_FILTERS.minPrice ||
    filters.maxPrice !== DEFAULT_FILTERS.maxPrice;

  const set = (patch: Partial<PropertyFilterState>) =>
    onChange({ ...filters, ...patch });

  const categoryTabs = categories.data?.data ?? [];

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      className={cn("space-y-7", className)}
    >
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-base font-bold text-foreground">
          <SlidersHorizontal className="h-4 w-4 text-primary" /> Filters
        </h2>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="gap-1 text-xs text-primary hover:text-primary-hover"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Reset
          </Button>
        )}
      </div>

      <div>
        <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Location
        </label>
        <div className="relative">
          <MapPin className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={filters.location}
            onChange={(e) => set({ location: e.target.value })}
            placeholder="City, address…"
            className="pl-10"
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Budget (per month)
        </label>
        <PriceSlider
          min={DEFAULT_FILTERS.minPrice}
          max={DEFAULT_FILTERS.maxPrice}
          value={[filters.minPrice, filters.maxPrice]}
          onChange={([minPrice, maxPrice]) => set({ minPrice, maxPrice })}
        />
      </div>

      <div>
        <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Property Type
        </label>
        {categories.isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-9 w-full" />
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {categoryTabs.map((cat) => (
              <button
                key={cat.id}
                onClick={() => set({ category: filters.category === cat.name ? "" : cat.name })}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all",
                  filters.category === cat.name
                    ? "border-primary bg-primary text-primary-foreground shadow-sm shadow-primary/25"
                    : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
                )}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}
      </div>

      <div>
        <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Bedrooms
        </label>
        <div className="grid grid-cols-4 gap-2">
          {["", "1", "2", "3+"].map((b) => (
            <button
              key={b}
              onClick={() => set({ bedrooms: filters.bedrooms === b ? "" : b })}
              className={cn(
                "rounded-xl border py-2 text-sm font-semibold transition-all",
                filters.bedrooms === b
                  ? "border-primary bg-primary text-primary-foreground shadow-sm shadow-primary/25"
                  : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
              )}
            >
              {b === "" ? "Any" : b}
            </button>
          ))}
        </div>
      </div>

      {compact && hasActiveFilters && (
        <Button variant="outline" onClick={onReset} className="w-full gap-2">
          <RotateCcw className="h-4 w-4" /> Reset filters
        </Button>
      )}
    </motion.div>
  );
}
