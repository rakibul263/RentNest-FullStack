import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { PaymentStatus, RentalStatus, UserRole } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatCompactCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(amount);
}

export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return "—";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export function formatDateTime(date: string | Date | null): string {
  if (!date) return "—";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(date));
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat("en-US").format(n);
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function daysBetween(a: string | Date, b: string | Date): number {
  const ms = new Date(b).getTime() - new Date(a).getTime();
  return Math.max(1, Math.round(ms / (1000 * 60 * 60 * 24)));
}

export const ROLE_META: Record<
  UserRole,
  { label: string; color: string; bg: string }
> = {
  tenant: {
    label: "Tenant",
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-500/10",
  },
  landlord: {
    label: "Landlord",
    color: "text-teal-600 dark:text-teal-400",
    bg: "bg-teal-500/10",
  },
  admin: {
    label: "Admin",
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-500/10",
  },
};

export const STATUS_META: Record<
  RentalStatus,
  { label: string; classes: string; dot: string }
> = {
  pending: {
    label: "Pending",
    classes: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    dot: "bg-amber-500",
  },
  approved: {
    label: "Approved",
    classes: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    dot: "bg-blue-500",
  },
  rejected: {
    label: "Rejected",
    classes: "bg-red-500/10 text-red-600 dark:text-red-400",
    dot: "bg-red-500",
  },
  active: {
    label: "Active",
    classes: "bg-green-500/10 text-green-600 dark:text-green-400",
    dot: "bg-green-500",
  },
  completed: {
    label: "Completed",
    classes: "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400",
    dot: "bg-zinc-500",
  },
  cancelled: {
    label: "Cancelled",
    classes: "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400",
    dot: "bg-zinc-500",
  },
};

export const PAYMENT_STATUS_META: Record<
  PaymentStatus,
  { label: string; classes: string; dot: string }
> = {
  pending: {
    label: "Pending",
    classes: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    dot: "bg-amber-500",
  },
  completed: {
    label: "Completed",
    classes: "bg-green-500/10 text-green-600 dark:text-green-400",
    dot: "bg-green-500",
  },
  failed: {
    label: "Failed",
    classes: "bg-red-500/10 text-red-600 dark:text-red-400",
    dot: "bg-red-500",
  },
};

export const AMENITIES = [
  "WiFi",
  "Parking",
  "Gym",
  "Pool",
  "Air Conditioning",
  "Heating",
  "Washer",
  "Dryer",
  "Dishwasher",
  "Balcony",
  "Elevator",
  "Furnished",
  "Pets Allowed",
  "Security",
  "Garden",
  "Smart Home",
] as const;

export const PROPERTY_TYPES = [
  "Apartment",
  "Villa",
  "Studio",
  "Office",
  "Family House",
  "Shared Room",
] as const;

export const CATEGORY_ICONS: Record<string, string> = {
  apartment: "building-2",
  villa: "home",
  studio: "layout-single",
  office: "briefcase",
  "family house": "house-plus",
  "shared room": "users",
};

export function fallbackImage(): string {
  return "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80";
}
