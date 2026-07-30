"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { Home, TrendingUp } from "lucide-react";
import { DashboardShell } from "@/components/dashboard-shell";
import { PropertyForm } from "@/components/landlord/property-form";
import { landlordApi } from "@/lib/api";
import { ErrorState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";

const NAV = [
  { label: "Overview", href: "/dashboard/landlord", icon: Home, match: (p: string) => p === "/dashboard/landlord" },
];

export default function EditPropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  const query = useQuery({
    queryKey: ["landlord-properties"],
    queryFn: landlordApi.properties,
  });

  const property = query.data?.data?.find((p) => p.id === id);

  if (query.isLoading) {
    return (
      <DashboardShell nav={NAV} title="Edit Property">
        <div className="mx-auto max-w-4xl space-y-4">
          <Skeleton className="h-10 w-56" />
          <Skeleton className="h-40 w-full rounded-2xl" />
          <Skeleton className="h-40 w-full rounded-2xl" />
        </div>
      </DashboardShell>
    );
  }

  if (!property) {
    return (
      <DashboardShell nav={NAV} title="Edit Property">
        <ErrorState
          icon={TrendingUp}
          title="Property not found"
          description="This property may have been deleted, or you don't own it."
        />
      </DashboardShell>
    );
  }

  return (
    <DashboardShell nav={NAV} title="Edit Property" subtitle={property.title}>
      <div className="mx-auto max-w-4xl">
        <PropertyForm property={property} />
      </div>
    </DashboardShell>
  );
}
