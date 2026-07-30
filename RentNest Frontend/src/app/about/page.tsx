"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Building2, CreditCard, ShieldCheck, Users, Sparkles, HeartHandshake } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { AnimatedCounter } from "@/components/ui/animated-counter";

const values = [
  {
    icon: ShieldCheck,
    title: "Trust & Safety",
    description: "Every listing is verified and payments are protected end-to-end with Stripe.",
  },
  {
    icon: HeartHandshake,
    title: "Fair for Everyone",
    description: "Transparent approvals, clear policies, and no hidden fees for tenants or landlords.",
  },
  {
    icon: Sparkles,
    title: "Modern & Fast",
    description: "A blazing-fast interface that makes renting feel effortless and delightful.",
  },
];

const journey = [
  { title: "2019", text: "RentNest founded to fix fragmented rental marketplaces." },
  { title: "2021", text: "Crossed 500 verified landlords and 10,000 happy tenants." },
  { title: "2024", text: "Launched secure Stripe-powered payments on the platform." },
  { title: "2026", text: "1,200+ properties listed with a 95% approval rate." },
];

export default function AboutPage() {
  return (
    <div className="pt-24">
      <section className="bg-grid relative overflow-hidden">
        <div className="pointer-events-none absolute -right-24 top-10 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative mx-auto max-w-4xl px-4 py-16 text-center sm:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary">
              <Building2 className="h-3.5 w-3.5" /> About RentNest
            </span>
            <h1 className="text-balance mt-5 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
              Renting, reimagined for{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                everyone
              </span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-balance text-lg text-muted-foreground">
              RentNest is a modern rental marketplace that connects verified
              landlords with trusted tenants. We make finding, requesting and
              paying for a home simple, secure and stress-free.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mx-auto mt-8 flex flex-wrap items-center justify-center gap-8"
          >
            {[
              { icon: Users, value: 1200, suffix: "+", label: "Properties" },
              { icon: Users, value: 800, suffix: "+", label: "Tenants" },
              { icon: CreditCard, value: 95, suffix: "%", label: "Approval Rate" },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-3">
                <s.icon className="h-8 w-8 text-primary" />
                <div className="text-left">
                  <p className="text-2xl font-extrabold text-foreground">
                    <AnimatedCounter value={s.value} suffix={s.suffix} />
                  </p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Our Values"
          title="What we stand for"
          subtitle="The principles that guide every feature we build."
        />
        <div className="grid gap-6 md:grid-cols-3">
          {values.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="rounded-3xl border border-border bg-card p-7 card-shadow transition-all hover:-translate-y-1 hover:card-shadow-lg"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary text-white shadow-lg shadow-primary/25">
                <v.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-5 text-lg font-bold text-foreground">{v.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{v.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Our Journey"
          title="Milestones along the way"
        />
        <div className="relative">
          <div className="absolute left-4 top-0 h-full w-px bg-border sm:left-1/2" />
          <div className="space-y-8">
            {journey.map((j, i) => (
              <motion.div
                key={j.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className={`relative flex items-start gap-6 sm:w-1/2 ${
                  i % 2 === 0 ? "sm:pr-12" : "sm:ml-auto sm:pl-12"
                }`}
              >
                <span
                  className={`absolute left-4 top-1 h-2 w-2 -translate-x-1/2 rounded-full bg-primary ring-4 ring-primary/20 ${
                    i % 2 === 0 ? "sm:left-auto sm:-right-1 sm:translate-x-1/2" : "sm:left-0"
                  }`}
                />
                <div className={`ml-10 rounded-2xl border border-border bg-card p-5 card-shadow sm:ml-0`}>
                  <p className="text-sm font-extrabold text-primary">{j.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{j.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-primary to-secondary p-10 text-center text-white sm:p-14">
          <div className="bg-grid absolute inset-0 opacity-20" />
          <div className="relative">
            <h2 className="text-balance text-3xl font-extrabold sm:text-4xl">
              Ready to find your next home?
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-white/85">
              Join RentNest today and experience renting the way it should be.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/properties">
                <Button size="lg" className="w-full bg-white text-primary hover:bg-white/90 sm:w-auto">
                  Browse Properties
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button
                  size="lg"
                  className="w-full border border-white/30 bg-transparent text-white hover:bg-white/10 sm:w-auto"
                >
                  Create Free Account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
