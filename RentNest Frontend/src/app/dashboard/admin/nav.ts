import { Building2, FileText, TrendingUp, Users } from "lucide-react";

export const adminNav = [
  { label: "Overview", href: "/dashboard/admin", icon: TrendingUp, match: (p: string) => p === "/dashboard/admin" },
  { label: "Users", href: "/dashboard/admin/users", icon: Users, match: (p: string) => p.startsWith("/dashboard/admin/users") },
  { label: "Properties", href: "/dashboard/admin/properties", icon: Building2, match: (p: string) => p.startsWith("/dashboard/admin/properties") },
  { label: "Requests", href: "/dashboard/admin/requests", icon: FileText, match: (p: string) => p.startsWith("/dashboard/admin/requests") },
];
