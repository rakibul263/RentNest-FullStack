"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Bath, BedDouble, MapPin, Ruler, Star } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import type { Property } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

export function PropertyRow({ property }: { property: Property }) {
  const image = property.images?.[0];
  const avgRating = property.reviews?.length
    ? property.reviews.reduce((a, r) => a + r.rating, 0) / property.reviews.length
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35 }}
    >
      <Link
        href={`/properties/${property.id}`}
        className="group flex flex-col gap-4 overflow-hidden rounded-2xl border border-border bg-card p-3 card-shadow transition-all hover:-translate-y-0.5 hover:card-shadow-lg sm:flex-row"
      >
        <div className="relative h-48 w-full shrink-0 overflow-hidden rounded-xl sm:h-40 sm:w-56">
          {image ? (
            <Image
              src={image}
              alt={property.title}
              fill
              sizes="224px"
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
              No image
            </div>
          )}
          {property.isAvailable ? (
            <Badge className="absolute left-2.5 top-2.5 border-0 bg-white/90 text-emerald-600 shadow-sm backdrop-blur">
              Available
            </Badge>
          ) : (
            <Badge className="absolute left-2.5 top-2.5 border-0 bg-white/90 text-red-500 shadow-sm backdrop-blur">
              Unavailable
            </Badge>
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col py-1 pr-1">
          <div className="flex items-start justify-between gap-3">
            <h3 className="line-clamp-1 text-base font-bold text-foreground group-hover:text-primary">
              {property.title}
            </h3>
            <p className="shrink-0 text-lg font-extrabold text-primary">
              {formatCurrency(property.price)}
              <span className="text-xs font-medium text-muted-foreground">/mo</span>
            </p>
          </div>
          <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            {property.address}, {property.city}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs font-medium text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <BedDouble className="h-4 w-4 text-primary/70" /> {property.bedrooms} Bedrooms
            </span>
            <span className="inline-flex items-center gap-1">
              <Bath className="h-4 w-4 text-primary/70" /> {property.bathrooms} Bathrooms
            </span>
            <span className="inline-flex items-center gap-1">
              <Ruler className="h-4 w-4 text-primary/70" /> {property.area} m²
            </span>
            {avgRating !== null && (
              <span className="inline-flex items-center gap-1 font-semibold text-foreground">
                <Star className="h-4 w-4 text-accent" fill="currentColor" />
                {avgRating.toFixed(1)}
              </span>
            )}
          </div>
          {property.amenities?.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {property.amenities.slice(0, 4).map((a) => (
                <span
                  key={a}
                  className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
                >
                  {a}
                </span>
              ))}
              {property.amenities.length > 4 && (
                <span className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                  +{property.amenities.length - 4} more
                </span>
              )}
            </div>
          )}
          <div className="mt-auto flex items-center justify-between pt-3">
            <span className="text-xs font-medium text-muted-foreground">
              Hosted by{" "}
              <span className="font-semibold text-foreground">
                {property.landlord?.name ?? "Owner"}
              </span>
            </span>
            <span className="rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              View Details
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
