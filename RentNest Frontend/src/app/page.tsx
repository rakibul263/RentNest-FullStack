"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { CreditCard, FileText, Search, ShieldCheck, Sparkles, TrendingUp } from "lucide-react";
import { Hero } from "@/components/home/hero";
import { CategoryCards, CategoryCardsSkeleton } from "@/components/home/category-cards";
import { PropertyCard, PropertyCardSkeleton } from "@/components/property-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { categoryApi, propertyApi } from "@/lib/api";
import { ErrorState } from "@/components/ui/empty-state";

const steps = [
  {
    icon: Search,
    title: "Search & Discover",
    description: "Browse verified listings with powerful filters for location, budget and amenities.",
  },
  {
    icon: FileText,
    title: "Request to Rent",
    description: "Submit a rental request with your move-in dates. Landlords respond in hours.",
  },
  {
    icon: CreditCard,
    title: "Pay Securely",
    description: "Once approved, complete your payment safely via Stripe checkout.",
  },
];

export default function HomePage() {
  const categories = useQuery({
    queryKey: ["categories"],
    queryFn: categoryApi.list,
  });

  const properties = useQuery({
    queryKey: ["properties", "featured"],
    queryFn: () => propertyApi.list({ limit: 9 }),
  });

  const featured = properties.data?.data ?? [];
  const counts: Record<string, number> = {};
  featured.forEach((p) => {
    const name = p.category?.name ?? "Other";
    counts[name] = (counts[name] ?? 0) + 1;
  });

  return (
    <>
      <Hero />

      <div className="relative">
        {categories.isLoading ? (
          <CategoryCardsSkeleton />
        ) : categories.error ? (
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <ErrorState
              icon={TrendingUp}
              title="Couldn't load categories"
              onRetry={() => categories.refetch()}
            />
          </div>
        ) : (
          <CategoryCards
            categories={categories.data?.data ?? []}
            counts={counts}
          />
        )}

        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Handpicked for you"
            title="Featured Properties"
            subtitle="A curated selection of the most sought-after rentals across the city."
          />

          {properties.isLoading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 9 }).map((_, i) => (
                <PropertyCardSkeleton key={i} />
              ))}
            </div>
          ) : properties.error ? (
            <ErrorState
              icon={TrendingUp}
              title="Couldn't load properties"
              description="Check your connection and try again."
              onRetry={() => properties.refetch()}
            />
          ) : featured.length === 0 ? (
            <div className="text-center">
              <p className="text-muted-foreground">
                No properties available right now. Check back soon.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((p, i) => (
                <PropertyCard key={p.id} property={p} index={i} />
              ))}
            </div>
          )}

          <div className="mt-10 text-center">
            <Link href="/properties">
              <Button size="lg" variant="outline">
                View all properties
              </Button>
            </Link>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="How it works"
            title="Move in, stress-free"
            subtitle="Three simple steps between you and your next home."
          />
          <div className="grid gap-6 md:grid-cols-3">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group relative overflow-hidden rounded-3xl border border-border bg-card p-7 card-shadow transition-all hover:card-shadow-lg"
              >
                <span className="absolute right-5 top-4 text-6xl font-extrabold text-muted opacity-20">
                  0{i + 1}
                </span>
                <span className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary text-white shadow-lg shadow-primary/25">
                  <step.icon className="h-6 w-6" />
                </span>
                <h3 className="relative mt-5 text-lg font-bold text-foreground">
                  {step.title}
                </h3>
                <p className="relative mt-2 text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-primary via-primary/90 to-secondary p-8 text-white sm:p-14">
            <div className="bg-grid absolute inset-0 opacity-20" />
            <div className="relative grid items-center gap-8 lg:grid-cols-2">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold backdrop-blur">
                  <Sparkles className="h-3.5 w-3.5" /> For Landlords
                </span>
                <h2 className="text-balance mt-4 text-3xl font-extrabold leading-tight sm:text-4xl">
                  List your property &amp; start earning today
                </h2>
                <p className="mt-3 max-w-lg text-white/85">
                  Reach thousands of verified tenants, manage requests in one
                  dashboard, and get paid securely through Stripe.
                </p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <Link href="/auth/register">
                    <Button size="lg" className="bg-white text-primary hover:bg-white/90">
                      Become a Landlord
                    </Button>
                  </Link>
                  <Link href="/properties">
                    <Button
                      size="lg"
                      className="border border-white/30 bg-transparent text-white hover:bg-white/10"
                    >
                      Explore Listings
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { icon: ShieldCheck, title: "Verified Tenants", desc: "Identity-checked applicants" },
                  { icon: TrendingUp, title: "Smart Insights", desc: "Track views & approvals" },
                  { icon: CreditCard, title: "Secure Payments", desc: "Stripe-powered checkout" },
                  { icon: Sparkles, title: "Zero Hassle", desc: "Automated request flow" },
                ].map((f) => (
                  <div
                    key={f.title}
                    className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur"
                  >
                    <f.icon className="h-5 w-5" />
                    <p className="mt-3 text-sm font-bold">{f.title}</p>
                    <p className="mt-0.5 text-xs text-white/75">{f.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
