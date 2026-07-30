"use client";

import { useQuery } from "@tanstack/react-query";
import { CalendarDays, FileText } from "lucide-react";
import { DashboardShell } from "@/components/dashboard-shell";
import { adminNav } from "@/app/dashboard/admin/nav";
import { adminApi } from "@/lib/api";
import { StatusBadge } from "@/components/ui/status-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar } from "@/components/ui/avatar";
import { daysBetween, formatCurrency, formatDate } from "@/lib/utils";

export default function AdminRequestsPage() {
  const rentals = useQuery({
    queryKey: ["admin-rentals"],
    queryFn: () => adminApi.rentals(1, 100),
  });
  const allRentals = rentals.data?.data ?? [];

  return (
    <DashboardShell nav={adminNav} title="Rental Requests" subtitle="All rental requests across the platform">
      {rentals.isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-2xl" />
          ))}
        </div>
      ) : allRentals.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No rental requests"
          description="Rental requests from tenants will appear here."
        />
      ) : (
        <div className="space-y-3">
          {allRentals.map((r) => (
            <div
              key={r.id}
              className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 transition-colors hover:border-primary/30 sm:flex-row sm:items-center"
            >
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <Avatar name={r.tenant?.name ?? "T"} className="h-10 w-10 text-xs" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-foreground">
                    {r.tenant?.name} → {r.property?.title}
                  </p>
                  <p className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {formatDate(r.startDate)} → {formatDate(r.endDate)}
                    </span>
                    <span>{daysBetween(r.startDate, r.endDate)} nights</span>
                    <span className="font-semibold text-foreground">{formatCurrency(r.property?.price ?? 0)}/mo</span>
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 items-center justify-between gap-4 sm:justify-end">
                <span className="hidden text-xs text-muted-foreground sm:block">{r.landlord?.name}</span>
                <StatusBadge status={r.status} />
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardShell>
  );
}
