import { CreditCard, FileText, Star, TrendingUp } from "lucide-react";

export const tenantNav = [
  {
    label: "Overview",
    href: "/dashboard/tenant",
    icon: TrendingUp,
    match: (p: string) => p === "/dashboard/tenant",
  },
  {
    label: "My Requests",
    href: "/dashboard/tenant/requests",
    icon: FileText,
    match: (p: string) => p.startsWith("/dashboard/tenant/requests"),
  },
  {
    label: "Payments",
    href: "/dashboard/tenant/payments",
    icon: CreditCard,
    match: (p: string) => p.startsWith("/dashboard/tenant/payments"),
  },
  {
    label: "My Reviews",
    href: "/dashboard/tenant/reviews",
    icon: Star,
    match: (p: string) => p.startsWith("/dashboard/tenant/reviews"),
  },
];
