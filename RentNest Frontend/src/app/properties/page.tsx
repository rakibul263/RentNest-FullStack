"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { LayoutGrid, List, SlidersHorizontal, TrendingUp } from "lucide-react";
import { propertyApi } from "@/lib/api";
import { cn } from "@/lib/utils";
import {
  DEFAULT_FILTERS,
  FilterSidebar,
  type PropertyFilterState,
} from "@/components/filters/filter-sidebar";
import {
  PropertyCard,
  PropertyCardSkeleton,
} from "@/components/property-card";
import { PropertyRow } from "@/components/property-row";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Pagination } from "@/components/ui/pagination";
import { Drawer } from "@/components/ui/drawer";
import { EmptyState, ErrorState } from "@/components/ui/empty-state";
import { SearchX } from "lucide-react";

const MAX_PRICE = DEFAULT_FILTERS.maxPrice;

function parseFilters(searchParams: URLSearchParams): PropertyFilterState {
  const minPrice = Number(searchParams.get("minPrice") ?? DEFAULT_FILTERS.minPrice);
  const maxPrice = Math.min(
    Number(searchParams.get("maxPrice") ?? MAX_PRICE),
    MAX_PRICE
  );
  return {
    location: searchParams.get("location") ?? "",
    category: searchParams.get("category") ?? "",
    minPrice: Math.min(minPrice, maxPrice),
    maxPrice,
    bedrooms: searchParams.get("bedrooms") ?? "",
  };
}

export default function PropertiesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<PropertyFilterState>(() =>
    parseFilters(searchParams)
  );
  const [debouncedLocation, setDebouncedLocation] = useState(filters.location);
  const [sort, setSort] = useState("newest");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [page, setPage] = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const firstRender = useRef(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedLocation(filters.location);
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [filters.location]);

  const updateUrl = useCallback(
    (f: PropertyFilterState, p: number) => {
      const params = new URLSearchParams();
      if (f.location) params.set("location", f.location);
      if (f.category) params.set("category", f.category);
      if (f.minPrice !== DEFAULT_FILTERS.minPrice) params.set("minPrice", String(f.minPrice));
      if (f.maxPrice !== MAX_PRICE) params.set("maxPrice", String(f.maxPrice));
      if (f.bedrooms) params.set("bedrooms", f.bedrooms);
      if (p > 1) params.set("page", String(p));
      const qs = params.toString();
      router.replace(qs ? `/properties?${qs}` : "/properties", { scroll: false });
    },
    [router]
  );

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    updateUrl(filters, page);
  }, [filters, page, updateUrl]);

  const bedroomsParam = filters.bedrooms === "3+" ? 3 : (filters.bedrooms ? Number(filters.bedrooms) : undefined);

  const query = useQuery({
    queryKey: ["properties", debouncedLocation, filters.category, filters.minPrice, filters.maxPrice, bedroomsParam, sort, page],
    queryFn: () =>
      propertyApi.list({
        location: debouncedLocation || undefined,
        category: filters.category || undefined,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        bedrooms: bedroomsParam,
        page,
        limit: 12,
      }),
  });

  const properties = useMemo(() => query.data?.data ?? [], [query.data?.data]);
  const total = query.data?.meta?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / 12));

  const sorted = useMemo(() => {
    const arr = [...properties];
    if (sort === "price-asc") arr.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") arr.sort((a, b) => b.price - a.price);
    return arr;
  }, [properties, sort]);

  const applyFilters = (f: PropertyFilterState) => {
    setFilters(f);
    setPage(1);
  };
  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setPage(1);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-24 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-balance text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Browse Properties
        </h1>
        <p className="mt-2 text-muted-foreground">
          {query.isLoading ? "Searching…" : `${total} rental ${total === 1 ? "property" : "properties"} found`}
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <aside className="sticky top-24 hidden max-h-[calc(100vh-7rem)] self-start overflow-y-auto rounded-3xl border border-border bg-card p-6 lg:block">
          <FilterSidebar
            filters={filters}
            onChange={applyFilters}
            onReset={resetFilters}
          />
        </aside>

        <div>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="gap-2 lg:hidden"
                onClick={() => setDrawerOpen(true)}
              >
                <SlidersHorizontal className="h-4 w-4" /> Filters
              </Button>
              <div className="flex rounded-xl border border-border bg-card p-1">
                {(["grid", "list"] as const).map((v) => (
                  <button
                    key={v}
                    onClick={() => setView(v)}
                    className={cn(
                      "flex h-8 w-9 items-center justify-center rounded-lg transition-colors",
                      view === v
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                    aria-label={`${v} view`}
                  >
                    {v === "grid" ? (
                      <LayoutGrid className="h-4 w-4" />
                    ) : (
                      <List className="h-4 w-4" />
                    )}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Sort by</span>
              <Select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  setPage(1);
                }}
                className="w-44"
                aria-label="Sort"
              >
                <option value="newest">Newest first</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </Select>
            </div>
          </div>

          {query.isLoading ? (
            <div
              className={cn(
                view === "grid"
                  ? "grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3"
                  : "space-y-4"
              )}
            >
              {Array.from({ length: 6 }).map((_, i) => (
                <PropertyCardSkeleton key={i} />
              ))}
            </div>
          ) : query.error ? (
            <ErrorState
              icon={TrendingUp}
              title="Couldn't load properties"
              description="We hit a snag while loading properties. Please try again."
              onRetry={() => query.refetch()}
            />
          ) : properties.length === 0 ? (
            <EmptyState
              icon={SearchX}
              title="No properties match your filters"
              description="Try adjusting your search criteria or browse all available listings."
              action={{ label: "Clear filters", onClick: resetFilters }}
            />
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={cn(
                view === "grid"
                  ? "grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3"
                  : "space-y-4"
              )}
            >
              {sorted.map((p, i) =>
                view === "grid" ? (
                  <PropertyCard key={p.id} property={p} index={i} />
                ) : (
                  <PropertyRow key={p.id} property={p} />
                )
              )}
            </motion.div>
          )}

          <Pagination
            page={page}
            totalPages={totalPages}
            total={total}
            onPageChange={setPage}
            className="justify-between"
          />
        </div>
      </div>

      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Filters"
        side="bottom"
      >
        <FilterSidebar
          filters={filters}
          onChange={(f) => {
            applyFilters(f);
            setDrawerOpen(false);
          }}
          onReset={() => {
            resetFilters();
            setDrawerOpen(false);
          }}
          compact
        />
      </Drawer>
    </div>
  );
}
