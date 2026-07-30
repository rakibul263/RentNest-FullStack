"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DashboardShell } from "@/components/dashboard-shell";
import { RequestTable, TableSkeleton } from "@/components/tenant-views";
import { ReviewModal } from "@/components/review-modal";
import { rentalApi } from "@/lib/api";
import type { RentalRequest } from "@/lib/types";
import { tenantNav } from "@/app/dashboard/tenant/nav";

export default function TenantRequestsPage() {
  const { data, isLoading } = useQuery({ queryKey: ["rentals"], queryFn: rentalApi.my });
  const [reviewTarget, setReviewTarget] = useState<RentalRequest | null>(null);
  const requests = data?.data ?? [];

  return (
    <DashboardShell nav={tenantNav} title="My Requests" subtitle="Track and manage your rental requests">
      <div className="space-y-6">
        {isLoading ? (
          <TableSkeleton />
        ) : (
          <RequestTable requests={requests} onReview={setReviewTarget} />
        )}
      </div>
      {reviewTarget && (
        <ReviewModal
          open
          onClose={() => setReviewTarget(null)}
          propertyId={reviewTarget.propertyId}
          rentalRequestId={reviewTarget.id}
          propertyTitle={reviewTarget.property?.title ?? "Property"}
        />
      )}
    </DashboardShell>
  );
}
