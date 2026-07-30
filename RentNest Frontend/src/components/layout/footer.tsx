"use client";

import Link from "next/link";
import { Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";

const columns = [
  {
    title: "Platform",
    links: [
      { label: "Browse Properties", href: "/properties" },
      { label: "Become a Landlord", href: "/auth/register" },
      { label: "About Us", href: "/about" },
    ],
  },
  {
    title: "For Tenants",
    links: [
      { label: "Find a Home", href: "/properties" },
      { label: "How it Works", href: "/about" },
      { label: "Login", href: "/auth/login" },
    ],
  },
  {
    title: "For Landlords",
    links: [
      { label: "List a Property", href: "/auth/register" },
      { label: "Dashboard", href: "/dashboard/landlord" },
      { label: "Manage Requests", href: "/dashboard/landlord/requests" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-card/50">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <BrandLogo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Find &amp; list rental properties with ease. A modern marketplace
              connecting trusted landlords with verified tenants.
            </p>
            <div className="mt-5 flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-3 text-xs text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-success" />
              Secure payments powered by Stripe
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-bold text-foreground">{col.title}</h4>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} RentNest. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Mail className="h-3.5 w-3.5" /> support@rentnest.com
            </span>
            <span className="hidden items-center gap-1 sm:inline-flex">
              <Phone className="h-3.5 w-3.5" /> 01521711716
            </span>
            <span className="hidden items-center gap-1 sm:inline-flex">
              <MapPin className="h-3.5 w-3.5" /> Mirpur-13, Dhaka
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
