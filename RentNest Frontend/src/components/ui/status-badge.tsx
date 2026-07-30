"use client";

import { cn, ROLE_META, STATUS_META, PAYMENT_STATUS_META } from "@/lib/utils";
import type { PaymentStatus, RentalStatus, UserRole } from "@/lib/types";

export function StatusBadge({
  status,
  className,
}: {
  status: RentalStatus;
  className?: string;
}) {
  const meta = STATUS_META[status];
  if (!meta) return null;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
        meta.classes,
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", meta.dot)} />
      {meta.label}
    </span>
  );
}

export function PaymentStatusBadge({
  status,
  className,
}: {
  status: PaymentStatus;
  className?: string;
}) {
  const meta = PAYMENT_STATUS_META[status];
  if (!meta) return null;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
        meta.classes,
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", meta.dot)} />
      {meta.label}
    </span>
  );
}

export function RoleBadge({
  role,
  className,
}: {
  role: UserRole;
  className?: string;
}) {
  const meta = ROLE_META[role];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
        meta.bg,
        meta.color,
        className
      )}
    >
      {meta.label}
    </span>
  );
}
