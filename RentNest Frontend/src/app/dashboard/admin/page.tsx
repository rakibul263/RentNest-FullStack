"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Building2,
  CreditCard,
  FileText,
  Search,
  Users,
} from "lucide-react";
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { DashboardShell } from "@/components/dashboard-shell";
import { adminNav } from "@/app/dashboard/admin/nav";
import { adminApi } from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";
import { StatsCard } from "@/components/ui/stats-card";
import { RoleBadge } from "@/components/ui/status-badge";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar } from "@/components/ui/avatar";
import { UserBanButton } from "@/components/admin/user-ban-button";
import { cn, formatDate } from "@/lib/utils";

const ROLE_COLORS: Record<string, string> = {
  tenant: "#2563EB",
  landlord: "#14B8A6",
  admin: "#F59E0B",
};

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const users = useQuery({
    queryKey: ["admin-users", page],
    queryFn: () => adminApi.users(page, 10),
  });
  const properties = useQuery({
    queryKey: ["admin-properties"],
    queryFn: () => adminApi.properties(1, 100),
  });
  const rentals = useQuery({
    queryKey: ["admin-rentals"],
    queryFn: () => adminApi.rentals(1, 100),
  });

  const allUsers = useMemo(() => users.data?.data ?? [], [users.data?.data]);
  const total = users.data?.meta?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / 10));
  const allProperties = useMemo(() => properties.data?.data ?? [], [properties.data?.data]);
  const allRentals = useMemo(() => rentals.data?.data ?? [], [rentals.data?.data]);

  const filteredUsers = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return allUsers;
    return allUsers.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.role.toLowerCase().includes(q)
    );
  }, [allUsers, search]);

  const stats = useMemo(() => {
    const revenue = allRentals
      .filter((r) => r.status === "active" || r.status === "completed")
      .reduce((a, r) => a + (r.property?.price ?? 0), 0);
    const pending = allRentals.filter((r) => r.status === "pending").length;
    return { revenue, pending };
  }, [allRentals]);

  const roleDistribution = useMemo(() => {
    const counts: Record<string, number> = {};
    allUsers.forEach((u) => {
      counts[u.role] = (counts[u.role] ?? 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [allUsers]);

  const greeting = user?.name?.split(" ")[0] ?? "admin";

  return (
    <DashboardShell nav={adminNav} title="Admin Dashboard" subtitle="Platform-wide oversight and moderation">
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground">
            Platform overview, {greeting} 🛡️
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Monitor health, manage users, and moderate content.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatsCard icon={Users} label="Total Users" value={allUsers.length} gradient="from-primary to-secondary" />
          <StatsCard icon={Building2} label="Total Properties" value={allProperties.length} gradient="from-emerald-500 to-teal-600" />
          <StatsCard icon={CreditCard} label="Revenue" value={stats.revenue} prefix="$" gradient="from-amber-400 to-orange-500" />
          <StatsCard icon={FileText} label="Pending Requests" value={stats.pending} gradient="from-violet-500 to-purple-600" />
        </div>

        <div className="grid gap-6 lg:grid-cols-5">
          <div className="rounded-3xl border border-border bg-card p-6 lg:col-span-3">
            <h3 className="text-base font-bold text-foreground">User Role Distribution</h3>
            <p className="text-xs text-muted-foreground">Breakdown of accounts by role</p>
            <div className="mt-4 h-64">
              {roleDistribution.length === 0 ? (
                <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                  No users yet
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={roleDistribution} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} allowDecimals={false} />
                    <Tooltip
                      cursor={{ fill: "var(--color-muted)", opacity: 0.4 }}
                      contentStyle={{
                        background: "var(--color-card)",
                        border: "1px solid var(--color-border)",
                        borderRadius: 12,
                        fontSize: 12,
                      }}
                      formatter={(v) => [`${v} users`]}
                    />
                    <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                      {roleDistribution.map((e) => (
                        <Cell key={e.name} fill={ROLE_COLORS[e.name] ?? "#71717A"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 lg:col-span-2">
            <h3 className="text-base font-bold text-foreground">Recent Rentals</h3>
            <p className="text-xs text-muted-foreground">Latest rental requests across the platform</p>
            <div className="mt-4 space-y-3">
              {rentals.isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-14 w-full rounded-xl" />
                ))
              ) : allRentals.length === 0 ? (
                <EmptyState icon={FileText} title="No rentals yet" compact className="border-0 bg-transparent py-8" />
              ) : (
                allRentals.slice(0, 5).map((r) => (
                  <div key={r.id} className="flex items-center gap-3 rounded-xl border border-border bg-card p-3">
                    <Avatar name={r.tenant?.name ?? "T"} className="h-9 w-9 text-xs" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-foreground">{r.tenant?.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{r.property?.title}</p>
                    </div>
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[11px] font-semibold capitalize",
                        r.status === "pending" && "bg-amber-500/10 text-amber-600 dark:text-amber-400",
                        r.status === "approved" && "bg-blue-500/10 text-blue-600 dark:text-blue-400",
                        r.status === "rejected" && "bg-red-500/10 text-red-600 dark:text-red-400",
                        (r.status === "active" || r.status === "completed") && "bg-green-500/10 text-green-600 dark:text-green-400"
                      )}
                    >
                      {r.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-base font-bold text-foreground">User Management</h3>
            <div className="relative w-full sm:w-72">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, email, role…"
                className="pl-10"
              />
            </div>
          </div>

          {users.isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full rounded-2xl" />
              ))}
            </div>
          ) : filteredUsers.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No users found"
              description="Try adjusting your search or check back later."
            />
          ) : (
            <div className="overflow-hidden rounded-3xl border border-border bg-card">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
                      <th className="px-5 py-3.5 font-semibold">User</th>
                      <th className="px-5 py-3.5 font-semibold">Role</th>
                      <th className="px-5 py-3.5 font-semibold">Joined</th>
                      <th className="px-5 py-3.5 font-semibold">Activity</th>
                      <th className="px-5 py-3.5 font-semibold">Status</th>
                      <th className="px-5 py-3.5 text-right font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((u) => (
                      <tr key={u.id} className="border-b border-border/60 transition-colors last:border-0 hover:bg-muted/30">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <Avatar name={u.name} className="h-9 w-9 text-xs" />
                            <div className="min-w-0">
                              <p className="truncate font-bold text-foreground">{u.name}</p>
                              <p className="truncate text-xs text-muted-foreground">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <RoleBadge role={u.role} />
                        </td>
                        <td className="px-5 py-3.5 text-xs text-muted-foreground">
                          {formatDate(u.createdAt)}
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="flex gap-1.5 text-xs font-medium text-muted-foreground">
                            <Badge variant="secondary">{u._count.properties} props</Badge>
                            <Badge variant="secondary">{u._count.rentalRequests} reqs</Badge>
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          {u.isBanned ? (
                            <Badge variant="destructive">Banned</Badge>
                          ) : (
                            <Badge variant="success">Active</Badge>
                          )}
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <UserBanButton user={u} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="border-t border-border px-5">
                <Pagination
                  page={page}
                  totalPages={totalPages}
                  total={total}
                  onPageChange={setPage}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
