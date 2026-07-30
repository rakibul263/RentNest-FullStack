"use client";

import Link from "next/link";
import { ArrowRight, CalendarDays, CreditCard, FileText, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge, PaymentStatusBadge } from "@/components/ui/status-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { daysBetween, formatCurrency, formatDate, formatDateTime } from "@/lib/utils";
import type { Payment, RentalRequest, Review } from "@/lib/types";

export function RequestTable({
  requests,
  onReview,
}: {
  requests: RentalRequest[];
  onReview: (r: RentalRequest) => void;
}) {
  if (requests.length === 0) {
    return (
      <EmptyState
        icon={FileText}
        title="No rental requests yet"
        description="Browse available rental properties to get started."
        action={{ label: "Browse properties", onClick: () => window.location.assign("/properties") }}
      />
    );
  }

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
                <p className="mt-1.5 line-clamp-1 text-xs text-muted-foreground">“{r.message}”</p>
              )}
            </div>
            <div className="flex shrink-0 gap-2">
              {r.status === "approved" && (
                <Link href={`/dashboard/tenant/requests/${r.id}/pay`}>
                  <Button size="sm" className="gap-1.5">
                    Pay Now <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              )}
              {(r.status === "active" || r.status === "completed") && (
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1.5 text-amber-600 dark:text-amber-400"
                  onClick={() => onReview(r)}
                >
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

export function PaymentsView({ payments }: { payments: Payment[] }) {
  if (payments.length === 0) {
    return (
      <EmptyState
        icon={CreditCard}
        title="No payments yet"
        description="Payments you make for approved rentals will appear here."
      />
    );
  }
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
                <span className="capitalize">{p.provider}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-extrabold text-foreground">{formatCurrency(p.amount)}</span>
            <PaymentStatusBadge status={p.status} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ReviewsView({
  reviews,
  title = "Property",
}: {
  reviews: (Review & { property?: { title?: string } })[];
  title?: string;
}) {
  if (reviews.length === 0) {
    return (
      <EmptyState
        icon={Star}
        title="No reviews yet"
        description="Reviews you leave after a completed stay will appear here."
        action={{ label: "Browse properties", onClick: () => window.location.assign("/properties") }}
      />
    );
  }
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {reviews.map((r) => (
        <div key={r.id} className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-foreground">
              {r.property?.title ?? title}
            </p>
            <Badge variant="warning">{r.rating}/5</Badge>
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

export function TableSkeleton() {
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
