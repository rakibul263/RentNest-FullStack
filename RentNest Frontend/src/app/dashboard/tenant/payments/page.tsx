"use client";

import { useQuery } from "@tanstack/react-query";
import { DashboardShell } from "@/components/dashboard-shell";
import { PaymentsView, TableSkeleton } from "@/components/tenant-views";
import { paymentApi } from "@/lib/api";
import { tenantNav } from "@/app/dashboard/tenant/nav";

export default function TenantPaymentsPage() {
  const { data, isLoading } = useQuery({ queryKey: ["payments"], queryFn: paymentApi.history });
  const payments = data?.data ?? [];

  return (
    <DashboardShell nav={tenantNav} title="Payment History" subtitle="All your transactions in one place">
      {isLoading ? <TableSkeleton /> : <PaymentsView payments={payments} />}
    </DashboardShell>
  );
}
