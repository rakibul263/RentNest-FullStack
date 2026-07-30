"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Bath, BedDouble, Check, Heart, MapPin, Ruler, Star } from "lucide-react";
import * as React from "react";
import { cn, formatCompactCurrency, formatCurrency } from "@/lib/utils";
import type { Property } from "@/lib/types";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface PropertyCardProps {
  property: Property;
  index?: number;
}

export function PropertyCard({ property, index = 0 }: PropertyCardProps) {
  const [wishlisted, setWishlisted] = React.useState(false);
  const image = property.images?.[0];

  const avgRating = property.reviews?.length
    ? property.reviews.reduce((a, r) => a + r.rating, 0) / property.reviews.length
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.06, 0.4) }}
      className="group h-full"
    >
      <Link
        href={`/properties/${property.id}`}
        className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card card-shadow transition-all duration-300 group-hover:-translate-y-1.5 group-hover:card-shadow-lg"
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          {image ? (
            <Image
              src={image}
              alt={property.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-muted to-border text-muted-foreground">
              No image
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 transition-opacity group-hover:opacity-80" />

          <div className="absolute left-3 top-3 flex flex-col gap-2">
            {property.isAvailable ? (
              <Badge className="border-0 bg-white/90 text-emerald-600 shadow-sm backdrop-blur">
                <Check className="h-3 w-3" /> Available
              </Badge>
            ) : (
              <Badge className="border-0 bg-white/90 text-red-500 shadow-sm backdrop-blur">
                Unavailable
              </Badge>
            )}
          </div>

          <button
            onClick={(e) => {
              e.preventDefault();
              setWishlisted((w) => !w);
            }}
            className={cn(
              "absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur transition-all hover:scale-110",
              wishlisted ? "text-red-500" : "text-zinc-600"
            )}
            aria-label="Toggle wishlist"
          >
            <Heart className="h-4.5 w-4.5" fill={wishlisted ? "currentColor" : "none"} />
          </button>

          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-black/50 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur">
            <MapPin className="h-3 w-3" />
            {property.city}
          </div>
        </div>

        <div className="flex flex-1 flex-col p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="line-clamp-1 text-base font-bold text-foreground transition-colors group-hover:text-primary">
              {property.title}
            </h3>
            <p className="shrink-0 text-base font-extrabold text-primary">
              {formatCurrency(property.price)}
              <span className="text-xs font-medium text-muted-foreground">/mo</span>
            </p>
          </div>

          <p className="mt-0.5 line-clamp-1 text-sm text-muted-foreground">
            {property.address}
          </p>

          <div className="mt-3 flex items-center gap-3 text-xs font-medium text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <BedDouble className="h-4 w-4 text-primary/70" /> {property.bedrooms} bd
            </span>
            <span className="inline-flex items-center gap-1">
              <Bath className="h-4 w-4 text-primary/70" /> {property.bathrooms} ba
            </span>
            <span className="inline-flex items-center gap-1">
              <Ruler className="h-4 w-4 text-primary/70" /> {formatCompactCurrency(property.area * 0.35).replace("$", "")} m²
            </span>
            {avgRating !== null && (
              <span className="ml-auto inline-flex items-center gap-1 font-semibold text-foreground">
                <Star className="h-4 w-4 text-accent" fill="currentColor" />
                {avgRating.toFixed(1)}
              </span>
            )}
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
            <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
              <Avatar
                name={property.landlord?.name ?? "Owner"}
                className="h-6 w-6 text-[9px]"
              />
              <span className="line-clamp-1 font-medium text-foreground">
                {property.landlord?.name ?? "Owner"}
              </span>
            </span>
            <span className="rounded-lg bg-primary/10 px-2 py-1 text-xs font-semibold text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              View Details
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export function PropertyCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="skeleton-shimmer aspect-[4/3]" />
      <div className="space-y-3 p-4">
        <div className="skeleton-shimmer h-4 w-3/4 rounded-lg" />
        <div className="skeleton-shimmer h-3 w-1/2 rounded-lg" />
        <div className="flex gap-2">
          <div className="skeleton-shimmer h-3 w-14 rounded-lg" />
          <div className="skeleton-shimmer h-3 w-14 rounded-lg" />
          <div className="skeleton-shimmer h-3 w-14 rounded-lg" />
        </div>
        <div className="flex items-center justify-between border-t border-border pt-3">
          <div className="skeleton-shimmer h-6 w-6 rounded-full" />
          <div className="skeleton-shimmer h-6 w-20 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
