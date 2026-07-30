"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  CalendarDays,
  CreditCard,
  Star,
  Star as StarIcon,
  FileText,
} from "lucide-react";
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { DashboardShell } from "@/components/dashboard-shell";
import { StatsCard } from "@/components/ui/stats-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge, PaymentStatusBadge } from "@/components/ui/status-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { ReviewModal } from "@/components/review-modal";
import { paymentApi, rentalApi, reviewApi } from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";
import {
  cn,
  daysBetween,
  formatCurrency,
  formatDate,
  formatDateTime,
} from "@/lib/utils";
import { RentalStatus } from "@/lib/types";
import type { RentalRequest } from "@/lib/types";
import { tenantNav } from "@/app/dashboard/tenant/nav";

const STATUS_COLORS: Record<string, string> = {
  pending: "#F59E0B",
  approved: "#2563EB",
  rejected: "#EF4444",
  active: "#22C55E",
  completed: "#71717A",
  cancelled: "#A1A1AA",
};

const TABS = ["Requests", "Payments", "Reviews"] as const;

export default function TenantDashboardPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState<(typeof TABS)[number]>("Requests");
  const [reviewTarget, setReviewTarget] = useState<RentalRequest | null>(null);

  const requests = useQuery({ queryKey: ["rentals"], queryFn: rentalApi.my });
  const payments = useQuery({ queryKey: ["payments"], queryFn: paymentApi.history });
  const reviews = useQuery({ queryKey: ["reviews", "my"], queryFn: reviewApi.my });

  const allRequests = useMemo(() => requests.data?.data ?? [], [requests.data?.data]);
  const allPayments = useMemo(() => payments.data?.data ?? [], [payments.data?.data]);
  const myReviews = useMemo(() => reviews.data?.data ?? [], [reviews.data?.data]);

  const stats = useMemo(() => {
    const active = allRequests.filter((r) => r.status === "active").length;
    const completed = allRequests.filter((r) => r.status === "completed").length;
    const paid = allPayments.filter((p) => p.status === "completed");
    const spent = paid.reduce((a, p) => a + p.amount, 0);
    return { active, completed, spent, reviewCount: myReviews.length };
  }, [allRequests, allPayments, myReviews]);

  const statusDistribution = useMemo(() => {
    const counts: Record<string, number> = {};
    allRequests.forEach((r) => {
      counts[r.status] = (counts[r.status] ?? 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [allRequests]);

  const monthlyPayments = useMemo(() => {
    const map = new Map<string, number>();
    allPayments
      .filter((p) => p.status === "completed" && p.paidAt)
      .forEach((p) => {
        const key = new Date(p.paidAt!).toLocaleString("en-US", { month: "short" });
        map.set(key, (map.get(key) ?? 0) + p.amount);
      });
    return Array.from(map.entries()).map(([month, total]) => ({ month, total }));
  }, [allPayments]);

  const greeting = user?.name?.split(" ")[0] ?? "there";

  return (
    <DashboardShell nav={tenantNav} title="Tenant Dashboard" subtitle="Manage your rentals">
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground">
            Hello, {greeting} 👋
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Here&apos;s what&apos;s happening with your rentals.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatsCard icon={FileText} label="Total Requests" value={allRequests.length} gradient="from-primary to-secondary" />
          <StatsCard icon={CreditCard} label="Total Paid" value={stats.spent} prefix="$" gradient="from-emerald-500 to-teal-600" />
          <StatsCard icon={StarIcon} label="Reviews Given" value={stats.reviewCount} gradient="from-amber-400 to-orange-500" />
          <StatsCard icon={CalendarDays} label="Active Rentals" value={stats.active} gradient="from-violet-500 to-purple-600" />
        </div>

        <div className="grid gap-6 lg:grid-cols-5">
          <div className="rounded-3xl border border-border bg-card p-6 lg:col-span-3">
            <h3 className="text-base font-bold text-foreground">Monthly Payments</h3>
            <p className="text-xs text-muted-foreground">Completed payments, last months</p>
            <div className="mt-4 h-64">
              {monthlyPayments.length === 0 ? (
                <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                  No payment data yet
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyPayments} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                    <XAxis dataKey="month" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
                    <Tooltip
                      cursor={{ fill: "var(--color-muted)", opacity: 0.4 }}
                      contentStyle={{
                        background: "var(--color-card)",
                        border: "1px solid var(--color-border)",
                        borderRadius: 12,
                        fontSize: 12,
                      }}
                      formatter={(v) => [formatCurrency(Number(v)), "Spent"]}
                    />
                    <Bar dataKey="total" radius={[8, 8, 0, 0]} fill="var(--color-primary)" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 lg:col-span-2">
            <h3 className="text-base font-bold text-foreground">Request Status</h3>
            <p className="text-xs text-muted-foreground">Breakdown of all rental requests</p>
            <div className="mt-2 h-56">
              {statusDistribution.length === 0 ? (
                <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                  No requests yet
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusDistribution}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={3}
                    >
                      {statusDistribution.map((entry) => (
                        <Cell key={entry.name} fill={STATUS_COLORS[entry.name] ?? "#71717A"} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: "var(--color-card)",
                        border: "1px solid var(--color-border)",
                        borderRadius: 12,
                        fontSize: 12,
                      }}
                      formatter={(v, n) => [`${v} requests`, String(n).toUpperCase()]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
            <div className="mt-1 flex flex-wrap gap-3">
              {statusDistribution.map((s) => (
                <span key={s.name} className="inline-flex items-center gap-1.5 text-xs font-medium capitalize text-muted-foreground">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: STATUS_COLORS[s.name] }} />
                  {s.name} · {s.value}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <h3 className="text-base font-bold text-foreground">Recent Requests</h3>
            <div className="flex rounded-xl bg-muted p-1">
              {TABS.map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
                    tab === t ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {requests.isLoading ? (
              <RequestTableSkeleton />
            ) : tab === "Requests" ? (
              allRequests.length === 0 ? (
                <EmptyState
                  icon={FileText}
                  title="No rental requests yet"
                  description="Browse available rental properties to get started."
                  action={{ label: "Browse properties", onClick: () => window.location.assign("/properties") }}
                />
              ) : (
                <RequestTable
                  requests={allRequests}
                  onReview={(r) => setReviewTarget(r)}
                />
              )
            ) : tab === "Payments" ? (
              <PaymentsView payments={allPayments} loading={payments.isLoading} />
            ) : (
              <ReviewsView reviews={myReviews} loading={reviews.isLoading} />
            )}
          </div>
        </div>
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

function RequestTable({
  requests,
  onReview,
}: {
  requests: RentalRequest[];
  onReview: (r: RentalRequest) => void;
}) {
  return (
    <div className="space-y-3">
      {requests.map((r) => {
        const image = r.property?.images?.[0];
        return (
          <div
            key={r.id}
            className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 transition-colors hover:border-primary/30 sm:flex-row sm:items-center"
          >
            <div className="relative h-24 w-full shrink-0 overflow-hidden rounded-xl bg-muted sm:w-32">
              {image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={image} alt={r.property?.title ?? ""} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                  No image
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href={`/properties/${r.propertyId}`}
                  className="line-clamp-1 text-sm font-bold text-foreground hover:text-primary"
                >
                  {r.property?.title ?? "Property"}
                </Link>
                <StatusBadge status={r.status} />
              </div>
              <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <CalendarDays className="h-3.5 w-3.5" />
                  {formatDate(r.startDate)} → {formatDate(r.endDate)}
                </span>
                <span>{daysBetween(r.startDate, r.endDate)} nights</span>
                <span className="font-semibold text-foreground">{formatCurrency(r.property?.price ?? 0)}/mo</span>
              </p>
              {r.message && (
                <p className="mt-1.5 line-clamp-1 text-xs text-muted-foreground">
                  “{r.message}”
                </p>
              )}
            </div>
            <div className="flex shrink-0 gap-2">
              {r.status === "approved" && (
                <Link href={`/dashboard/tenant/requests/${r.id}/pay`}>
                  <Button size="sm" variant="default" className="gap-1.5">
                    Pay Now <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              )}
              {(r.status === "active" || r.status === "completed") && (
                <Button size="sm" variant="outline" className="gap-1.5 text-amber-600 dark:text-amber-400" onClick={() => onReview(r)}>
                  <Star className="h-3.5 w-3.5" /> Leave Review
                </Button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function PaymentsView({
  payments,
  loading,
}: {
  payments: { id: string; amount: number; status: RentalStatus | "pending" | "completed" | "failed"; paidAt: string | null; createdAt: string; rentalRequest?: { property?: { title?: string } }; provider?: string }[];
  loading: boolean;
}) {
  if (loading) return <RequestTableSkeleton />;
  if (payments.length === 0)
    return (
      <EmptyState
        icon={CreditCard}
        title="No payments yet"
        description="Payments you make for approved rentals will appear here."
      />
    );
  return (
    <div className="space-y-3">
      {payments.map((p) => (
        <div
          key={p.id}
          className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-card px-4 py-3.5"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/10 text-success">
              <CreditCard className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-bold text-foreground">
                {p.rentalRequest?.property?.title ?? "Rental payment"}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatDateTime(p.paidAt ?? p.createdAt)} · via{" "}
                <span className="capitalize">{p.provider ?? "stripe"}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-extrabold text-foreground">{formatCurrency(p.amount)}</span>
            <PaymentStatusBadge status={p.status as "pending" | "completed" | "failed"} />
          </div>
        </div>
      ))}
    </div>
  );
}

function ReviewsView({
  reviews,
  loading,
}: {
  reviews: { id: string; rating: number; comment: string | null; createdAt: string; property?: { title?: string } }[];
  loading: boolean;
}) {
  if (loading) return <RequestTableSkeleton />;
  if (reviews.length === 0)
    return (
      <EmptyState
        icon={Star}
        title="No reviews yet"
        description="Reviews you leave after a completed stay will appear here."
        action={{ label: "Browse properties", onClick: () => window.location.assign("/properties") }}
      />
    );
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {reviews.map((r) => (
        <div key={r.id} className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-foreground">{r.property?.title ?? "Property"}</p>
            <Badge variant="warning">
              {r.rating}/5
            </Badge>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">{formatDate(r.createdAt)}</p>
          {r.comment && (
            <p className="mt-2.5 line-clamp-3 text-sm text-muted-foreground">{r.comment}</p>
          )}
        </div>
      ))}
    </div>
  );
}

function RequestTableSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4">
          <Skeleton className="h-24 w-32 shrink-0 rounded-xl" />
          <div className="flex-1 space-y-2.5">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-2/3" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-9 w-24" />
        </div>
      ))}
    </div>
  );
}
