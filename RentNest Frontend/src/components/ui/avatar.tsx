"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import * as React from "react";
import { cn, getInitials } from "@/lib/utils";

export function Avatar({
  name,
  src,
  className,
}: {
  name: string;
  src?: string | null;
  className?: string;
}) {
  const [error, setError] = React.useState(false);
  return (
    <span
      className={cn(
        "relative inline-flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-primary to-secondary text-sm font-bold text-primary-foreground",
        className
      )}
    >
      {src && !error ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={name}
          className="h-full w-full object-cover"
          onError={() => setError(true)}
        />
      ) : (
        getInitials(name)
      )}
    </span>
  );
}

interface DropdownProps {
  trigger: React.ReactNode;
  children: React.ReactNode | ((onClose: () => void) => React.ReactNode);
  align?: "left" | "right";
  className?: string;
}

export function Dropdown({
  trigger,
  children,
  align = "right",
  className,
}: DropdownProps) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="cursor-pointer"
      >
        {trigger}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            className={cn(
              "absolute z-50 mt-2 min-w-52 overflow-hidden rounded-2xl border border-border bg-card p-1.5 shadow-xl card-shadow-lg",
              align === "right" ? "right-0" : "left-0",
              className
            )}
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
          >
            {typeof children === "function"
              ? children(() => setOpen(false))
              : children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function MenuButton({
  children,
  onClick,
  className,
  danger,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  danger?: boolean;
}) {
  return (
    <button
      role="menuitem"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
        danger && "text-danger hover:bg-danger/10 hover:text-danger",
        className
      )}
    >
      {children}
    </button>
  );
}

export function MenuLabel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground",
        className
      )}
    >
      {children}
    </div>
  );
}

export function MenuSeparator({ className }: { className?: string }) {
  return <div className={cn("my-1.5 h-px bg-border", className)} />;
}

export function SelectButton({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "flex w-full items-center justify-between gap-2 rounded-xl border border-input bg-card px-4 py-2.5 text-sm font-medium shadow-sm transition-colors hover:border-primary/40",
        className
      )}
    >
      {children}
      <ChevronDown className="h-4 w-4 text-muted-foreground" />
    </span>
  );
}
