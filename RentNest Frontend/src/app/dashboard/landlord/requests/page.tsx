"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { CalendarDays, Check, FileText, Home, MessageSquareText, X } from "lucide-react";
import { DashboardShell } from "@/components/dashboard-shell";
import { landlordApi } from "@/lib/api";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar } from "@/components/ui/avatar";
import { daysBetween, formatCurrency, formatDate } from "@/lib/utils";
import type { RentalRequest } from "@/lib/types";

const NAV = [
  { label: "Overview", href: "/dashboard/landlord", icon: Home, match: (p: string) => p === "/dashboard/landlord" },
  { label: "Requests", href: "/dashboard/landlord/requests", icon: FileText, match: (p: string) => p.startsWith("/dashboard/landlord/requests") },
];

export default function LandlordRequestsPage() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["landlord-requests"],
    queryFn: landlordApi.requests,
  });
  const requests = data?.data ?? [];

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: "approved" | "rejected" }) =>
      landlordApi.updateRequestStatus(id, status),
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: ["landlord-requests"] });
      const prev = queryClient.getQueryData(["landlord-requests"]);
      queryClient.setQueryData(["landlord-requests"], (old: unknown) => {
        if (!old || typeof old !== "object") return old;
        const response = old as { data?: RentalRequest[] };
        if (!Array.isArray(response.data)) return old;
        return {
          ...response,
          data: response.data.map((r) => (r.id === id ? { ...r, status } : r)),
        };
      });
      return { prev };
    },
    onError: (err: Error, _vars, ctx) => {
      queryClient.setQueryData(["landlord-requests"], ctx?.prev);
      toast.error(err.message);
    },
    onSuccess: (res) => {
      toast.success(res.message || "Request updated");
      queryClient.invalidateQueries({ queryKey: ["landlord-requests"] });
      queryClient.invalidateQueries({ queryKey: ["landlord-stats"] });
    },
  });

  const pending = requests.filter((r) => r.status === "pending");

  return (
    <DashboardShell nav={NAV} title="Request Management" subtitle="Approve or reject incoming rental requests">
      <div className="space-y-6">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total Requests</p>
            <p className="mt-1 text-2xl font-extrabold text-foreground">{requests.length}</p>
          </div>
          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">Pending</p>
            <p className="mt-1 text-2xl font-extrabold text-foreground">{pending.length}</p>
          </div>
          <div className="rounded-2xl border border-success/20 bg-success/5 p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-success">Approved</p>
            <p className="mt-1 text-2xl font-extrabold text-foreground">
              {requests.filter((r) => r.status === "approved").length}
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-28 w-full rounded-2xl" />
            ))}
          </div>
        ) : requests.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No rental requests yet"
            description="When tenants request to rent your properties, they'll show up here for approval."
            action={{ label: "Add a property", onClick: () => (window.location.href = "/dashboard/landlord/properties/new") }}
          />
        ) : (
          <div className="space-y-3">
            {requests.map((r, i) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/30 lg:flex-row lg:items-center"
              >
                <div className="flex flex-1 items-start gap-4">
                  <Avatar name={r.tenant?.name ?? "Tenant"} className="h-11 w-11" />
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-bold text-foreground">{r.tenant?.name ?? "Tenant"}</p>
                      <StatusBadge status={r.status} />
                    </div>
                    <p className="mt-0.5 text-sm font-semibold text-primary">
                      {r.property?.title ?? "Property"}
                    </p>
                    <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <CalendarDays className="h-3.5 w-3.5" />
                        {formatDate(r.startDate)} → {formatDate(r.endDate)}
                      </span>
                      <span>{daysBetween(r.startDate, r.endDate)} nights</span>
                      <span className="font-semibold text-foreground">{formatCurrency(r.property?.price ?? 0)}/mo</span>
                    </p>
                    {r.message && (
                      <p className="mt-1.5 flex items-start gap-1.5 text-xs text-muted-foreground">
                        <MessageSquareText className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                        “{r.message}”
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex shrink-0 gap-2 lg:flex-col">
                  <p className="hidden text-[11px] font-medium text-muted-foreground lg:block">
                    {r.tenant?.email}
                  </p>
                  {r.status === "pending" ? (
                    <>
                      <Button
                        size="sm"
                        variant="success"
                        className="flex-1 lg:w-32"
                        disabled={statusMutation.isPending}
                        onClick={() => statusMutation.mutate({ id: r.id, status: "approved" })}
                      >
                        <Check className="h-4 w-4" /> Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="flex-1 lg:w-32"
                        disabled={statusMutation.isPending}
                        onClick={() => statusMutation.mutate({ id: r.id, status: "rejected" })}
                      >
                        <X className="h-4 w-4" /> Reject
                      </Button>
                    </>
                  ) : (
                    <span className="hidden text-xs font-medium text-muted-foreground lg:block">
                      Processed
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
