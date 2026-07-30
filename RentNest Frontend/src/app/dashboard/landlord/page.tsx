"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Banknote,
  Building2,
  Clock,
  Eye,
  FileText,
  Home,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { DashboardShell } from "@/components/dashboard-shell";
import { landlordApi } from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";
import { StatsCard } from "@/components/ui/stats-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar } from "@/components/ui/avatar";
import {
  cn,
  formatCompactCurrency,
  formatCurrency,
  formatDate,
} from "@/lib/utils";
import type { Property } from "@/lib/types";

const NAV = [
  { label: "Overview", href: "/dashboard/landlord", icon: Home, match: (p: string) => p === "/dashboard/landlord" },
  { label: "Requests", href: "/dashboard/landlord/requests", icon: FileText, match: (p: string) => p.startsWith("/dashboard/landlord/requests") },
];

export default function LandlordDashboardPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const properties = useQuery({ queryKey: ["landlord-properties"], queryFn: landlordApi.properties });
  const requests = useQuery({ queryKey: ["landlord-requests"], queryFn: landlordApi.requests });

  const allProperties = useMemo(() => properties.data?.data ?? [], [properties.data?.data]);
  const allRequests = useMemo(() => requests.data?.data ?? [], [requests.data?.data]);

  const stats = useMemo(() => {
    const active = allRequests.filter((r) => r.status === "active").length;
    const pending = allRequests.filter((r) => r.status === "pending").length;
    const occupied = allRequests.filter((r) => r.status === "active" || r.status === "completed").length;
    const revenue = allRequests
      .filter((r) => r.status === "active" || r.status === "completed")
      .reduce((a, r) => a + (r.property?.price ?? 0), 0);
    const occupancy = allProperties.length ? Math.round((occupied / allProperties.length) * 100) : 0;
    return { pending, revenue, occupancy, active };
  }, [allRequests, allProperties]);

  const revenueByMonth = useMemo(() => {
    const map = new Map<string, number>();
    allRequests
      .filter((r) => r.status === "active" || r.status === "completed")
      .forEach((r) => {
        const key = new Date(r.createdAt).toLocaleString("en-US", { month: "short" });
        map.set(key, (map.get(key) ?? 0) + (r.property?.price ?? 0));
      });
    return Array.from(map.entries()).map(([month, total]) => ({ month, total }));
  }, [allRequests]);

  const availabilityMutation = useMutation({
    mutationFn: ({ id, isAvailable }: { id: string; isAvailable: boolean }) =>
      landlordApi.updateProperty(id, { isAvailable }),
    onMutate: async ({ id, isAvailable }) => {
      await queryClient.cancelQueries({ queryKey: ["landlord-properties"] });
      const prev = queryClient.getQueryData<Property[]>(["landlord-properties"]);
      queryClient.setQueryData<Property[]>(["landlord-properties"], (old) =>
        old?.map((p) => (p.id === id ? { ...p, isAvailable } : p)) ?? []
      );
      return { prev };
    },
    onError: (err: Error, _v, ctx) => {
      queryClient.setQueryData(["landlord-properties"], ctx?.prev);
      toast.error(err.message);
    },
    onSuccess: (res) => {
      toast.success(res.message || "Availability updated");
      queryClient.invalidateQueries({ queryKey: ["landlord-properties"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => landlordApi.deleteProperty(id),
    onSuccess: (res) => {
      toast.success(res.message || "Property deleted");
      queryClient.invalidateQueries({ queryKey: ["landlord-properties"] });
      queryClient.invalidateQueries({ queryKey: ["landlord-requests"] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const recentRequests = allRequests.slice(0, 5);
  const greeting = user?.name?.split(" ")[0] ?? "there";

  return (
    <DashboardShell nav={NAV} title="Landlord Dashboard" subtitle="Manage your listings and requests">
      <div className="space-y-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-foreground">
              Welcome back, {greeting} 🏠
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Here&apos;s how your properties are performing.
            </p>
          </div>
          <Link href="/dashboard/landlord/properties/new">
            <Button size="lg" className="gap-2">
              <Plus className="h-4.5 w-4.5" /> Add Property
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatsCard icon={Building2} label="Properties" value={allProperties.length} gradient="from-primary to-secondary" />
          <StatsCard icon={Banknote} label="Monthly Revenue" value={stats.revenue} prefix="$" gradient="from-emerald-500 to-teal-600" />
          <StatsCard icon={Clock} label="Pending Requests" value={stats.pending} gradient="from-amber-400 to-orange-500" />
          <StatsCard icon={Eye} label="Occupancy Rate" value={stats.occupancy} suffix="%" gradient="from-violet-500 to-purple-600" />
        </div>

        <div className="grid gap-6 lg:grid-cols-5">
          <div className="rounded-3xl border border-border bg-card p-6 lg:col-span-3">
            <h3 className="text-base font-bold text-foreground">Revenue Overview</h3>
            <p className="text-xs text-muted-foreground">Expected monthly revenue from active rentals</p>
            <div className="mt-4 h-64">
              {revenueByMonth.length === 0 ? (
                <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                  No revenue data yet — approved requests will appear here
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueByMonth} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
                    <defs>
                      <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.4} />
                        <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
                    <Tooltip
                      contentStyle={{
                        background: "var(--color-card)",
                        border: "1px solid var(--color-border)",
                        borderRadius: 12,
                        fontSize: 12,
                      }}
                      formatter={(v) => [formatCurrency(Number(v)), "Revenue"]}
                    />
                    <Area type="monotone" dataKey="total" stroke="var(--color-primary)" strokeWidth={2.5} fill="url(#rev)" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 lg:col-span-2">
            <h3 className="text-base font-bold text-foreground">Recent Requests</h3>
            <p className="text-xs text-muted-foreground">Latest activity on your listings</p>
            {requests.isLoading ? (
              <div className="mt-4 space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-14 w-full rounded-xl" />
                ))}
              </div>
            ) : recentRequests.length === 0 ? (
              <EmptyState
                icon={FileText}
                title="No requests yet"
                description="Tenant requests will appear here."
                compact
                className="mt-4 border-0 bg-transparent py-8"
              />
            ) : (
              <div className="mt-4 space-y-3">
                {recentRequests.map((r) => (
                  <div key={r.id} className="flex items-center gap-3 rounded-xl border border-border bg-card p-3">
                    <Avatar name={r.tenant?.name ?? "T"} className="h-9 w-9 text-xs" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-foreground">{r.tenant?.name}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {r.property?.title} · {formatDate(r.startDate)}
                      </p>
                    </div>
                    <StatusBadge status={r.status} />
                  </div>
                ))}
              </div>
            )}
            <Link
              href="/dashboard/landlord/requests"
              className="mt-4 inline-flex text-sm font-semibold text-primary hover:underline"
            >
              View all requests →
            </Link>
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-base font-bold text-foreground">My Properties</h3>
          {properties.isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-64 w-full rounded-2xl" />
              ))}
            </div>
          ) : allProperties.length === 0 ? (
            <EmptyState
              icon={Building2}
              title="No properties listed yet"
              description="Create your first listing to start receiving rental requests."
              action={{ label: "Add your first property", onClick: () => (window.location.href = "/dashboard/landlord/properties/new") }}
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {allProperties.map((p) => (
                <div
                  key={p.id}
                  className="group overflow-hidden rounded-2xl border border-border bg-card card-shadow transition-all hover:card-shadow-lg"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                    {p.images?.[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={p.images[0]}
                        alt={p.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                        No image
                      </div>
                    )}
                    <span
                      className={cn(
                        "absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-semibold shadow-sm backdrop-blur",
                        p.isAvailable
                          ? "bg-white/90 text-emerald-600"
                          : "bg-white/90 text-red-500"
                      )}
                    >
                      {p.isAvailable ? "Available" : "Unavailable"}
                    </span>
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h4 className="line-clamp-1 text-sm font-bold text-foreground">{p.title}</h4>
                        <p className="text-xs text-muted-foreground">
                          {p.city} · {p.bedrooms} bd / {p.bathrooms} ba
                        </p>
                      </div>
                      <p className="shrink-0 text-sm font-extrabold text-primary">
                        {formatCompactCurrency(p.price)}
                        <span className="text-[10px] font-medium text-muted-foreground">/mo</span>
                      </p>
                    </div>

                    <div className="mt-3 flex items-center justify-between rounded-xl bg-muted/60 px-3 py-2">
                      <span className="text-xs font-medium text-muted-foreground">
                        {p._count?.rentalRequests ?? 0} requests · {p._count?.reviews ?? 0} reviews
                      </span>
                      <span className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                        Active
                        <Switch
                          checked={p.isAvailable}
                          onCheckedChange={(v) =>
                            availabilityMutation.mutate({ id: p.id, isAvailable: v })
                          }
                          disabled={availabilityMutation.isPending}
                          label={`Toggle availability for ${p.title}`}
                        />
                      </span>
                    </div>

                    <div className="mt-3 flex gap-2">
                      <Link href={`/dashboard/landlord/properties/${p.id}/edit`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full gap-1.5">
                          <Pencil className="h-3.5 w-3.5" /> Edit
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-1/3 gap-1.5 text-danger hover:border-danger/40 hover:text-danger"
                        disabled={deleteMutation.isPending}
                        onClick={() => {
                          if (confirm(`Delete "${p.title}"? This cannot be undone.`)) {
                            deleteMutation.mutate(p.id);
                          }
                        }}
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
