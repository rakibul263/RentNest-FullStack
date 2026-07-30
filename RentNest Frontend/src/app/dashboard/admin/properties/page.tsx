"use client";

import { useQuery } from "@tanstack/react-query";
import { Building2 } from "lucide-react";
import Link from "next/link";
import { DashboardShell } from "@/components/dashboard-shell";
import { adminNav } from "@/app/dashboard/admin/nav";
import { adminApi } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/utils";

export default function AdminPropertiesPage() {
  const properties = useQuery({
    queryKey: ["admin-properties"],
    queryFn: () => adminApi.properties(1, 100),
  });
  const allProperties = properties.data?.data ?? [];

  return (
    <DashboardShell nav={adminNav} title="Content Moderation" subtitle="Inspect all listings across the platform">
      {properties.isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-2xl" />
          ))}
        </div>
      ) : allProperties.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No properties yet"
          description="Listings will appear here as landlords create them."
        />
      ) : (
        <div className="space-y-3">
          {allProperties.map((p) => (
            <div
              key={p.id}
              className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 transition-colors hover:border-primary/30 sm:flex-row sm:items-center"
            >
              <div className="relative h-20 w-full shrink-0 overflow-hidden rounded-xl bg-muted sm:w-28">
                {p.images?.[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.images[0]} alt={p.title} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                    No image
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    href={`/properties/${p.id}`}
                    className="line-clamp-1 text-sm font-bold text-foreground hover:text-primary"
                  >
                    {p.title}
                  </Link>
                  {p.isAvailable ? (
                    <Badge variant="success">Listed</Badge>
                  ) : (
                    <Badge variant="secondary">Unavailable</Badge>
                  )}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {p.city} · by {p.landlord?.name} · {p._count?.rentalRequests ?? 0} requests ·{" "}
                  {p._count?.reviews ?? 0} reviews
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-extrabold text-primary">{formatCurrency(p.price)}/mo</span>
                <Link
                  href={`/properties/${p.id}`}
                  className="rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                >
                  View
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardShell>
  );
}
