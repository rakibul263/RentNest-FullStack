"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Building2, MapPin, Search, Wallet } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { PROPERTY_TYPES } from "@/lib/utils";

const stats = [
  { value: 1200, suffix: "+", label: "Properties Listed" },
  { value: 800, suffix: "+", label: "Happy Tenants" },
  { value: 95, suffix: "%", label: "Approval Rate" },
];

export function Hero() {
  const router = useRouter();
  const [location, setLocation] = React.useState("");
  const [type, setType] = React.useState("");
  const [budget, setBudget] = React.useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (location) params.set("location", location);
    if (type) params.set("category", type);
    if (budget) params.set("maxPrice", budget);
    router.push(`/properties?${params.toString()}`);
  };

  return (
    <section className="bg-grid relative overflow-hidden pt-16">
      <div className="pointer-events-none absolute -left-32 top-24 h-96 w-96 rounded-full bg-primary/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-secondary/15 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 pb-16 pt-10 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-8 lg:px-8 lg:pt-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            Rental Marketplace
          </span>

          <h1 className="text-balance mt-5 text-4xl font-extrabold leading-[1.1] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Find Your Dream{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Rental Home
            </span>
          </h1>

          <p className="mt-5 max-w-lg text-balance text-base text-muted-foreground sm:text-lg">
            Discover thousands of verified apartments, villas and studios.
            Submit rental requests, get approved, and move in — all in one
            place.
          </p>

          <form
            onSubmit={submit}
            className="mt-8 rounded-3xl border border-border bg-card p-3 card-shadow-lg"
          >
            <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="relative">
                  <MapPin className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Location, city…"
                    className="pl-10"
                    aria-label="Location"
                  />
                </div>
                <Select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  aria-label="Property type"
                >
                  <option value="">Property Type</option>
                  {PROPERTY_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </Select>
                <div className="relative">
                  <Wallet className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={budget}
                    onChange={(e) => setBudget(e.target.value.replace(/\D/g, ""))}
                    placeholder="Max budget ($)"
                    className="pl-10"
                    inputMode="numeric"
                    aria-label="Max budget"
                  />
                </div>
              </div>
              <Button type="submit" size="lg" className="gap-2">
                <Search className="h-4.5 w-4.5" />
                Search
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </form>

          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
            {stats.map((s, i) => (
              <div key={s.label} className="flex items-center gap-3">
                <p className="text-2xl font-extrabold text-foreground sm:text-3xl">
                  <AnimatedCounter value={s.value} suffix={s.suffix} />
                </p>
                <p className="max-w-16 text-xs font-medium leading-tight text-muted-foreground">
                  {s.label}
                </p>
                {i < stats.length - 1 && (
                  <span className="hidden h-8 w-px bg-border sm:block" />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="relative hidden lg:block"
        >
          <div className="relative overflow-hidden rounded-[2rem] card-shadow-lg">
            <Image
              src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80"
              alt="Modern rental apartment"
              width={900}
              height={1100}
              priority
              className="h-[560px] w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          </div>

          <motion.div
            className="glass absolute -left-10 top-10 rounded-2xl border border-white/20 p-4 text-white shadow-xl"
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
                <Building2 className="h-5 w-5" />
              </span>
              <div>
                <p className="text-lg font-extrabold">1,200+</p>
                <p className="text-xs opacity-90">Properties</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="glass absolute -right-6 top-1/3 rounded-2xl border border-white/20 p-4 text-white shadow-xl"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          >
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
                <Search className="h-5 w-5" />
              </span>
              <div>
                <p className="text-lg font-extrabold">800+</p>
                <p className="text-xs opacity-90">Happy Tenants</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="glass absolute -bottom-6 left-10 rounded-2xl border border-white/20 p-4 text-white shadow-xl"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          >
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
                <Building2 className="h-5 w-5" />
              </span>
              <div>
                <p className="text-lg font-extrabold">95%</p>
                <p className="text-xs opacity-90">Approval Rate</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
