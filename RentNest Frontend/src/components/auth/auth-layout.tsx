"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Building2, Home, ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { BrandLogo } from "@/components/brand-logo";

const benefits = [
  { icon: ShieldCheck, label: "Verified listings only" },
  { icon: Home, label: "Thousands of properties" },
  { icon: Building2, label: "Secure Stripe payments" },
];

export function AuthLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-secondary p-10 text-white lg:flex lg:flex-col">
        <div className="bg-grid absolute inset-0 opacity-20" />
        <div className="pointer-events-none absolute -right-20 top-1/4 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-16 bottom-10 h-72 w-72 rounded-full bg-black/10 blur-3xl" />

        <BrandLogo size="lg" className="relative text-white" />

        <div className="relative my-auto max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-balance text-4xl font-extrabold leading-tight">
              Your next home is waiting.
            </h1>
            <p className="mt-4 text-balance leading-relaxed text-white/80">
              Join thousands of tenants and landlords using RentNest to rent
              smarter — discover, request, approve and pay, all in one place.
            </p>
          </motion.div>

          <div className="mt-8 flex flex-wrap gap-2.5">
            {benefits.map((b) => (
              <span
                key={b.label}
                className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-semibold backdrop-blur"
              >
                <b.icon className="h-3.5 w-3.5" /> {b.label}
              </span>
            ))}
          </div>
        </div>

        <p className="relative text-xs text-white/50">
          © {new Date().getFullYear()} RentNest. Secure &amp; trusted.
        </p>
      </div>

      <div className="relative flex flex-col items-center justify-center px-4 py-10 sm:px-8">
        <div className="absolute right-4 top-4">
          <ThemeToggle />
        </div>

        <div className="mb-8 lg:hidden">
          <BrandLogo size="lg" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass w-full max-w-md rounded-3xl border border-border bg-card/80 p-6 card-shadow-lg sm:p-8"
        >
          <div className="mb-6">
            <h2 className="text-2xl font-extrabold tracking-tight text-foreground">
              {title}
            </h2>
            <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p>
          </div>
          {children}
          <p className="mt-6 text-center text-sm text-muted-foreground">
            <Link href="/" className="font-medium text-primary hover:underline">
              Back to home
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
