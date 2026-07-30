"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Briefcase,
  Building2,
  Home,
  LayoutTemplate,
  HousePlus,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { Category } from "@/lib/types";
import { SectionHeading } from "@/components/ui/section-heading";
import { Skeleton } from "@/components/ui/skeleton";

const DEFAULT_ICON: Record<string, LucideIcon> = {
  apartment: Building2,
  villa: Home,
  studio: LayoutTemplate,
  office: Briefcase,
  "family house": HousePlus,
  "shared room": Users,
};

function iconFor(name: string): LucideIcon {
  return DEFAULT_ICON[name.toLowerCase()] ?? Building2;
}

export function CategoryCards({
  categories,
  counts,
}: {
  categories: Category[];
  counts: Record<string, number>;
}) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Browse by Type"
        title="Explore Property Categories"
        subtitle="From cozy studios to spacious family homes — find the perfect fit for your lifestyle."
      />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {categories.map((cat, i) => {
          const Icon = iconFor(cat.name);
          const count = counts[cat.name] ?? 0;
          return (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              whileHover={{ y: -6 }}
            >
              <Link
                href={`/properties?category=${encodeURIComponent(cat.name)}`}
                className="group flex h-full flex-col items-center gap-3 rounded-3xl border border-border bg-card p-6 text-center card-shadow transition-all hover:border-primary/30 hover:card-shadow-lg"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 text-primary transition-all duration-300 group-hover:from-primary group-hover:to-secondary group-hover:text-white group-hover:shadow-lg group-hover:shadow-primary/30">
                  <Icon className="h-7 w-7" />
                </span>
                <div>
                  <p className="text-sm font-bold text-foreground">{cat.name}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {count} {count === 1 ? "property" : "properties"}
                  </p>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

export function CategoryCardsSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto mb-10 max-w-2xl space-y-3 text-center">
        <Skeleton className="mx-auto h-4 w-40" />
        <Skeleton className="mx-auto h-8 w-72" />
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col items-center gap-3 rounded-3xl border border-border bg-card p-6"
          >
            <Skeleton className="h-14 w-14 rounded-2xl" />
            <div className="space-y-1.5 text-center">
              <Skeleton className="h-3.5 w-20" />
              <Skeleton className="h-3 w-14" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
