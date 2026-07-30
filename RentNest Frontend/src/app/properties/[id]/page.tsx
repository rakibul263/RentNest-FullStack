"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Bath,
  BedDouble,
  Check,
  MapPin,
  Phone,
  Ruler,
  ShieldCheck,
  Star,
  TrendingUp,
  X,
} from "lucide-react";
import * as React from "react";
import { propertyApi } from "@/lib/api";
import { PropertyGallery, GallerySkeleton } from "@/components/property-gallery";
import { RequestToRentModal } from "@/components/request-to-rent-modal";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/ui/empty-state";
import { RatingStars, StarDisplay } from "@/components/ui/rating-stars";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import type { Property } from "@/lib/types";

const TABS = ["Overview", "Amenities", "Reviews", "Location"] as const;

const POLICIES = [
  {
    title: "Smoking",
    allowed: false,
    note: "Strictly no smoking inside the property",
  },
  {
    title: "Pets",
    allowed: true,
    note: "Small pets allowed with a security deposit",
  },
  {
    title: "Subletting",
    allowed: false,
    note: "Subletting requires landlord approval",
  },
];

export default function PropertyDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  const { user } = useAuth();
  const [tab, setTab] = React.useState<(typeof TABS)[number]>("Overview");
  const [requestOpen, setRequestOpen] = React.useState(false);

  const query = useQuery({
    queryKey: ["property", id],
    queryFn: () => propertyApi.byId(id),
    retry: 1,
  });

  const property = query.data?.data as Property | undefined;

  if (query.isLoading) return <PropertyDetailsSkeleton />;

  if (query.error || !property) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-28 sm:px-6 lg:px-8">
        <ErrorState
          icon={TrendingUp}
          title="Property not found"
          description={query.error?.message || "This property may have been removed."}
          onRetry={() => query.refetch()}
        />
      </div>
    );
  }

  const reviews = property.reviews ?? [];
  const avgRating = reviews.length
    ? reviews.reduce((a, r) => a + r.rating, 0) / reviews.length
    : null;

  const canRequest =
    user?.role === "tenant" || !user;

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-24 sm:px-6 lg:px-8">
      <PropertyGallery images={property.images} title={property.title} />

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_380px]">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            {property.isAvailable ? (
              <Badge variant="success">
                <Check className="h-3 w-3" /> Available
              </Badge>
            ) : (
              <Badge variant="destructive">
                <X className="h-3 w-3" /> Unavailable
              </Badge>
            )}
            {property.category && (
              <Badge variant="outline">{property.category.name}</Badge>
            )}
            {avgRating !== null && (
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground">
                <StarDisplay value={avgRating} />
                {avgRating.toFixed(1)}
                <span className="font-normal text-muted-foreground">
                  ({reviews.length} reviews)
                </span>
              </span>
            )}
          </div>

          <h1 className="mt-3 text-balance text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            {property.title}
          </h1>
          <p className="mt-2 flex items-center gap-1.5 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            {property.address}, {property.city}
            {property.state ? `, ${property.state}` : ""}
            {property.zipCode ? ` ${property.zipCode}` : ""}
          </p>

          <div className="mt-6 flex flex-wrap gap-6 border-y border-border py-5 text-sm">
            <div className="flex items-center gap-2">
              <BedDouble className="h-5 w-5 text-primary" />
              <span>
                <strong className="text-foreground">{property.bedrooms}</strong>{" "}
                <span className="text-muted-foreground">Bedrooms</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Bath className="h-5 w-5 text-primary" />
              <span>
                <strong className="text-foreground">{property.bathrooms}</strong>{" "}
                <span className="text-muted-foreground">Bathrooms</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Ruler className="h-5 w-5 text-primary" />
              <span>
                <strong className="text-foreground">{property.area}</strong>{" "}
                <span className="text-muted-foreground">m²</span>
              </span>
            </div>
          </div>

          <div className="mt-6 flex gap-1 overflow-x-auto rounded-2xl border border-border bg-card p-1.5">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  "relative flex-1 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors",
                  tab === t ? "text-primary" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {tab === t && (
                  <motion.span
                    layoutId="property-tab"
                    className="absolute inset-0 rounded-xl bg-primary/10"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="relative">{t}</span>
              </button>
            ))}
          </div>

          <div className="mt-6">
            {tab === "Overview" && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h2 className="text-lg font-bold text-foreground">About this property</h2>
                <p className="mt-3 whitespace-pre-line leading-relaxed text-muted-foreground">
                  {property.description}
                </p>
              </motion.div>
            )}

            {tab === "Amenities" && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h2 className="text-lg font-bold text-foreground">What this place offers</h2>
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                   {(property.amenities.length ? property.amenities : ["No amenities listed"]).map(
                    (a) => (
                      <div
                        key={a}
                        className="flex items-center gap-2.5 rounded-xl border border-border bg-card px-3.5 py-3 text-sm font-medium text-foreground"
                      >
                        <span
                          className={cn(
                            "flex h-6 w-6 items-center justify-center rounded-full",
                            property.amenities.length
                              ? "bg-success/10 text-success"
                              : "bg-muted text-muted-foreground"
                          )}
                        >
                          {property.amenities.length ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
                        </span>
                        {a}
                      </div>
                    )
                  )}
                </div>

                <h2 className="mt-8 text-lg font-bold text-foreground">House Rules</h2>
                <div className="mt-4 space-y-3">
                  {POLICIES.map((p) => (
                    <div
                      key={p.title}
                      className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3"
                    >
                      <div>
                        <p className="text-sm font-semibold text-foreground">{p.title}</p>
                        <p className="text-xs text-muted-foreground">{p.note}</p>
                      </div>
                      <Badge variant={p.allowed ? "success" : "destructive"}>
                        {p.allowed ? "Allowed" : "Not allowed"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {tab === "Reviews" && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-foreground">
                    Guest Reviews
                  </h2>
                  {avgRating !== null && (
                    <div className="flex items-center gap-2 rounded-xl bg-muted px-3 py-1.5">
                      <Star className="h-4 w-4 text-accent" fill="currentColor" />
                      <span className="text-sm font-bold text-foreground">{avgRating.toFixed(1)}</span>
                      <span className="text-xs text-muted-foreground">/ 5</span>
                    </div>
                  )}
                </div>
                {reviews.length === 0 ? (
                  <p className="mt-4 rounded-2xl border border-dashed border-border bg-card/40 p-8 text-center text-sm text-muted-foreground">
                    No reviews yet. Be the first to review this property after your stay!
                  </p>
                ) : (
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    {reviews.map((review) => (
                      <div
                        key={review.id}
                        className="rounded-2xl border border-border bg-card p-5 card-shadow"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar name={review.tenant?.name ?? "Tenant"} className="h-9 w-9 text-xs" />
                          <div>
                            <p className="text-sm font-bold text-foreground">{review.tenant?.name ?? "Tenant"}</p>
                            <p className="text-xs text-muted-foreground">{formatDate(review.createdAt)}</p>
                          </div>
                        </div>
                        <div className="mt-3">
                          <RatingStars value={review.rating} readOnly size={15} />
                        </div>
                        {review.comment && (
                          <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                            {review.comment}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {tab === "Location" && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                <h2 className="text-lg font-bold text-foreground">Location</h2>
                <p className="mt-3 flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4 text-primary" />
                  {property.address}, {property.city}
                </p>
                <div className="mt-4 flex h-64 items-center justify-center overflow-hidden rounded-3xl border border-border bg-muted">
                  <div className="text-center">
                    <MapPin className="mx-auto h-8 w-8 text-primary" />
                    <p className="mt-2 text-sm font-semibold text-foreground">{property.city}</p>
                    <p className="text-xs text-muted-foreground">
                      {property.lat && property.lng
                        ? `${property.lat.toFixed(4)}, ${property.lng.toFixed(4)}`
                        : "Interactive map coming soon"}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-3xl border border-border bg-card p-6 card-shadow-lg">
            <div className="flex items-baseline justify-between">
              <p className="text-3xl font-extrabold text-primary">
                {formatCurrency(property.price)}
                <span className="text-sm font-medium text-muted-foreground">/month</span>
              </p>
              {avgRating !== null && (
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-foreground">
                  <Star className="h-4 w-4 text-accent" fill="currentColor" />
                  {avgRating.toFixed(1)}
                </span>
              )}
            </div>

            {property.isAvailable && (
              <div className="mt-3 flex items-center gap-2 rounded-xl bg-success/10 px-3 py-2 text-xs font-semibold text-success">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
                </span>
                Available for rent — {property.bedrooms} bd / {property.bathrooms} ba
              </div>
            )}

            <div className="mt-5 border-t border-border pt-5">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Hosted by
              </p>
              <div className="mt-3 flex items-center gap-3">
                <Avatar name={property.landlord?.name ?? "Owner"} className="h-12 w-12" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-foreground">
                    {property.landlord?.name ?? "Property Owner"}
                  </p>
                  <p className="flex items-center gap-1 text-xs text-success">
                    <ShieldCheck className="h-3.5 w-3.5" /> Verified landlord
                  </p>
                </div>
              </div>
              {property.landlord?.phone && (
                <p className="mt-3 flex items-center gap-2 rounded-xl bg-muted px-3 py-2 text-xs text-muted-foreground">
                  <Phone className="h-3.5 w-3.5" /> {property.landlord.phone}
                </p>
              )}
            </div>

            <div className="mt-6 space-y-3">
              {canRequest ? (
                <Button
                  size="lg"
                  className="w-full"
                  disabled={!property.isAvailable}
                  onClick={() => setRequestOpen(true)}
                >
                  Request to Rent
                </Button>
              ) : (
                <Button size="lg" className="w-full" disabled>
                  Landlords can&apos;t rent their own listings
                </Button>
              )}
              <p className="text-center text-xs text-muted-foreground">
                You won&apos;t be charged until the landlord approves.
              </p>
            </div>
          </div>
        </aside>
      </div>

      <RequestToRentModal
        open={requestOpen}
        onClose={() => setRequestOpen(false)}
        propertyId={property.id}
        propertyTitle={property.title}
      />
    </div>
  );
}

function PropertyDetailsSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-24 sm:px-6 lg:px-8">
      <GallerySkeleton />
      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_380px]">
        <div className="space-y-4">
          <Skeleton className="h-7 w-32" />
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-5 w-1/2" />
          <div className="flex gap-4">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-24" />
          </div>
          <Skeleton className="h-12 w-full" />
          <div className="space-y-3 pt-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
        <div className="space-y-4">
          <Skeleton className="h-72 w-full rounded-3xl" />
        </div>
      </div>
    </div>
  );
}
