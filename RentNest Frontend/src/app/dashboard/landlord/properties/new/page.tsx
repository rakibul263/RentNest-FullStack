"use client";

import { Home } from "lucide-react";
import { DashboardShell } from "@/components/dashboard-shell";
import { PropertyForm } from "@/components/landlord/property-form";

const NAV = [
  { label: "Overview", href: "/dashboard/landlord", icon: Home, match: (p: string) => p === "/dashboard/landlord" },
];

export default function NewPropertyPage() {
  return (
    <DashboardShell nav={NAV} title="Add Property" subtitle="Create a new listing to attract tenants">
      <div className="mx-auto max-w-4xl">
        <PropertyForm />
      </div>
    </DashboardShell>
  );
}
