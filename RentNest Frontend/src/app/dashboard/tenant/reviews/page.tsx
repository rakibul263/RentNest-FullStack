"use client";

import { useQuery } from "@tanstack/react-query";
import { DashboardShell } from "@/components/dashboard-shell";
import { ReviewsView, TableSkeleton } from "@/components/tenant-views";
import { reviewApi } from "@/lib/api";
import { tenantNav } from "@/app/dashboard/tenant/nav";

export default function TenantReviewsPage() {
  const { data, isLoading } = useQuery({ queryKey: ["reviews", "my"], queryFn: reviewApi.my });
  const reviews = data?.data ?? [];

  return (
    <DashboardShell nav={tenantNav} title="My Reviews" subtitle="Reviews you've left for properties">
      {isLoading ? <TableSkeleton /> : <ReviewsView reviews={reviews} />}
    </DashboardShell>
  );
}
