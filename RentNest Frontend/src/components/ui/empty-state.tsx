"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
  className?: string;
  compact?: boolean;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
  compact,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card/40 px-6 py-16 text-center",
        compact && "py-10",
        className
      )}
    >
      <div className="relative mb-5">
        <div className="absolute inset-0 -m-3 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 blur-xl" />
        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 text-primary">
          <Icon className="h-8 w-8" />
        </div>
      </div>
      <h3 className="text-lg font-bold text-foreground">{title}</h3>
      {description && (
        <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
          {description}
        </p>
      )}
      {action && (
        <Button onClick={action.onClick} className="mt-6" variant="default">
          {action.label}
        </Button>
      )}
    </motion.div>
  );
}

export interface ErrorStateProps {
  icon?: LucideIcon;
  title?: string;
  description?: string;
  onRetry?: () => void;
  actionLabel?: string;
  className?: string;
  children?: ReactNode;
}

export function ErrorState({
  icon: Icon,
  title = "Something went wrong",
  description = "We hit a snag while loading this. Please try again.",
  onRetry,
  actionLabel = "Try again",
  className,
  children,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-3xl border border-border bg-card/40 px-6 py-16 text-center",
        className
      )}
    >
      {Icon && (
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-danger/10 text-danger">
          <Icon className="h-8 w-8" />
        </div>
      )}
      <h3 className="text-lg font-bold text-foreground">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
        {description}
      </p>
      {children}
      {onRetry && (
        <Button onClick={onRetry} className="mt-6">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
