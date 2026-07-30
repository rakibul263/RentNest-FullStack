"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatedCounter } from "./animated-counter";

interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  trend?: string;
  trendUp?: boolean;
  gradient?: string;
  className?: string;
}

export function StatsCard({
  icon: Icon,
  label,
  value,
  prefix,
  suffix,
  trend,
  trendUp,
  gradient = "from-primary to-secondary",
  className,
}: StatsCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-border bg-card p-5 card-shadow transition-shadow hover:card-shadow-lg",
        className
      )}
    >
      <div
        className={cn(
          "absolute -right-8 -top-8 h-28 w-28 rounded-full bg-gradient-to-br opacity-10 blur-2xl transition-opacity group-hover:opacity-20",
          gradient
        )}
      />
      <div className="flex items-start justify-between">
        <div
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-sm",
            gradient
          )}
        >
          <Icon className="h-5.5 w-5.5" />
        </div>
        {trend && (
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-xs font-semibold",
              trendUp
                ? "bg-success/10 text-success"
                : "bg-danger/10 text-danger"
            )}
          >
            {trend}
          </span>
        )}
      </div>
      <div className="mt-4">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <p className="mt-1 text-2xl font-bold tracking-tight text-foreground">
          <AnimatedCounter value={value} prefix={prefix} suffix={suffix} />
        </p>
      </div>
    </motion.div>
  );
}
