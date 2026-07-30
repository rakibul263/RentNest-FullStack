"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function SuccessContent() {
  const searchParams = useSearchParams();
  const paymentId = searchParams.get("paymentId");
  const amount = searchParams.get("amount");
  return <SuccessPage paymentId={paymentId} amount={amount ? Number(amount) : null} />;
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <SuccessContent />
    </Suspense>
  );
}

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CreditCard, LayoutDashboard, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

function SuccessPage({
  paymentId,
  amount,
}: {
  paymentId: string | null;
  amount: number | null;
}) {
  const router = useRouter();
  const [pieces, setPieces] = useState<{ id: number; x: number; y: number; r: number; c: string }[]>([]);
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    const colors = ["#2563EB", "#14B8A6", "#F59E0B", "#22C55E", "#EF4444", "#8B5CF6"];
    setPieces(
      Array.from({ length: 120 }).map((_, i) => ({
        id: i,
        x: Math.random() * 1400 - 700,
        y: Math.random() * -900 - 100,
        r: Math.random() * 360,
        c: colors[i % colors.length],
      }))
    );
  }, []);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-grid px-4 py-16">
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 1 }}
          animate={{ x: p.x, y: p.y, rotate: p.r, opacity: 0, scale: 0.4 }}
          transition={{ duration: 2.2, ease: "easeOut" }}
          className="pointer-events-none absolute left-1/2 top-1/2 h-2.5 w-2.5 rounded-sm"
          style={{ background: p.c }}
        />
      ))}

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="relative w-full max-w-md rounded-3xl border border-border bg-card p-8 text-center card-shadow-lg"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.2 }}
          className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-success/15"
        >
          <motion.span
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="relative flex h-14 w-14 items-center justify-center rounded-full bg-success text-white shadow-lg shadow-success/30"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7">
              <motion.path
                d="M5 13l4 4L19 7"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              />
            </svg>
          </motion.span>
        </motion.div>

        <h1 className="mt-6 text-2xl font-extrabold tracking-tight text-foreground">
          Payment Successful!
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Your rental is now active. Welcome home! 🎉
        </p>

        {amount !== null && (
          <div className="mt-6 rounded-2xl bg-muted/60 p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Amount paid
            </p>
            <p className="mt-1 text-3xl font-extrabold text-primary">
              {formatCurrency(amount)}
            </p>
          </div>
        )}

        <div className="mt-4 space-y-2 text-left text-xs text-muted-foreground">
          {paymentId && (
            <div className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-2.5">
              <span className="inline-flex items-center gap-1.5">
                <CreditCard className="h-3.5 w-3.5" /> Transaction
              </span>
              <span className="max-w-40 truncate font-mono font-medium text-foreground">
                {paymentId}
              </span>
            </div>
          )}
          <div className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-2.5">
            <span>Status</span>
            <span className="font-semibold text-success">Completed</span>
          </div>
        </div>

        <div className="mt-7 flex flex-col gap-2.5">
          <Link href="/dashboard/tenant">
            <Button size="lg" className="w-full">
              <LayoutDashboard className="h-4 w-4" /> Go to Dashboard
            </Button>
          </Link>
          <div className="flex gap-2.5">
            <Button variant="outline" className="flex-1" onClick={() => window.print()}>
              <Printer className="h-4 w-4" /> Receipt
            </Button>
            <Button variant="outline" className="flex-1" onClick={() => router.push("/properties")}>
              Browse more
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
