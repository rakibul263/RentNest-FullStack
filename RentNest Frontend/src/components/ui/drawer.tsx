"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  side?: "left" | "right" | "bottom";
  className?: string;
}

const sideClasses = {
  left: "inset-y-0 left-0 max-w-md w-full rounded-r-3xl",
  right: "inset-y-0 right-0 max-w-md w-full rounded-l-3xl",
  bottom: "inset-x-0 bottom-0 rounded-t-3xl w-full max-h-[85vh]",
};

export function Drawer({
  open,
  onClose,
  title,
  children,
  footer,
  side = "right",
  className,
}: DrawerProps) {
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-50">
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            className={cn(
              "absolute flex flex-col bg-card text-card-foreground shadow-2xl",
              sideClasses[side],
              className
            )}
            initial={
              side === "left"
                ? { x: "-100%" }
                : side === "right"
                  ? { x: "100%" }
                  : { y: "100%" }
            }
            animate={{ x: 0, y: 0 }}
            exit={
              side === "left"
                ? { x: "-100%" }
                : side === "right"
                  ? { x: "100%" }
                  : { y: "100%" }
            }
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
          >
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              {title ? (
                <h2 className="text-base font-bold text-foreground">{title}</h2>
              ) : (
                <span />
              )}
              <button
                onClick={onClose}
                className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label="Close drawer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5">{children}</div>
            {footer && (
              <div className="border-t border-border p-4">{footer}</div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
