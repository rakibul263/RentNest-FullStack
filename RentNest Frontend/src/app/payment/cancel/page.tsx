"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CreditCard, Home, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PaymentCancelPage() {
  return (
    <div className="bg-grid relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-16">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="relative w-full max-w-md rounded-3xl border border-border bg-card p-8 text-center card-shadow-lg"
      >
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: [0, -12, 12, -6, 0] }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-danger/15"
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-danger text-white shadow-lg shadow-danger/30">
            <CreditCard className="h-7 w-7" />
          </span>
        </motion.div>

        <h1 className="mt-6 text-2xl font-extrabold tracking-tight text-foreground">
          Payment Cancelled
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          No charges were made. You can retry the payment anytime — your rental
          request is still waiting for you.
        </p>

        <div className="mt-7 flex flex-col gap-2.5">
          <Button
            size="lg"
            onClick={() => history.back()}
            className="w-full gap-2"
          >
            <RotateCcw className="h-4 w-4" /> Retry Payment
          </Button>
          <Link href="/dashboard/tenant">
            <Button variant="outline" size="lg" className="w-full gap-2">
              <Home className="h-4 w-4" /> Back to Dashboard
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
