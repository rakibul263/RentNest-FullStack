"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  Lock,
  ShieldCheck,
  Zap,
  Building,
  Calendar,
  User,
  AlertCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import { rentalApi, paymentApi } from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/ui/empty-state";
import { daysBetween, formatCurrency, formatDate } from "@/lib/utils";

export default function PayPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return <PayContent requestId={id} />;
}

function PayContent({ requestId }: { requestId: string }) {
  const router = useRouter();
  const { user } = useAuth();

  const query = useQuery({
    queryKey: ["rental", requestId],
    queryFn: () => rentalApi.byId(requestId),
  });

  const request = query.data?.data;

  if (query.isLoading) return <PaySkeleton />;
  if (query.error || !request) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <ErrorState
          title="Request Not Found"
          description={query.error?.message || "This rental request could not be found."}
          onRetry={() => query.refetch()}
        />
      </div>
    );
  }

  if (request.tenantId !== user?.id) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <ErrorState
          title="Unauthorized Access"
          description="You can only complete payments for your own rental requests."
        />
      </div>
    );
  }

  if (request.status !== "approved") {
    const isActive = request.status === "active";
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <ErrorState
          title={isActive ? "Payment Completed" : "Approval Pending"}
          description={
            isActive
              ? "This rental payment has already been completed. Your stay is active!"
              : "You will be able to complete checkout once the landlord approves your request."
          }
          onRetry={() => router.push("/dashboard/tenant")}
          actionLabel="Go to Dashboard"
        />
      </div>
    );
  }

  const property = request.property!;
  const amount = property.price;
  const nights = daysBetween(request.startDate, request.endDate);

  return (
    <div className="min-h-screen bg-slate-950/5 pb-20 pt-8 dark:bg-background">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Navigation & Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <button
            onClick={() => router.push("/dashboard/tenant")}
            className="inline-flex items-center gap-2 rounded-xl border border-border/80 bg-card px-3.5 py-2 text-xs font-semibold text-muted-foreground shadow-sm transition-all hover:bg-accent hover:text-foreground active:scale-95"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </button>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <Lock className="h-3.5 w-3.5" /> 256-Bit SSL Encrypted
            </span>
            <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              Stripe Secured
            </span>
          </div>
        </div>

        {/* Title */}
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            Stripe Secure Checkout
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Complete your reservation payment for <span className="font-semibold text-foreground">{property.title}</span>
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          {/* Card Form & Interactive Preview Column */}
          <div className="space-y-6">
            <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 card-shadow-lg">
              <StripeCardForm amount={amount} requestId={requestId} defaultUserName={user?.name ?? "Tanvir Ahmed"} />
            </div>

            {/* Escrow Guarantee Box */}
            <div className="rounded-2xl border border-border/70 bg-card/60 p-4 backdrop-blur">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-foreground">RentNest Escrow Protection</h4>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Your funds are held safely until your check-in date. Full refund guaranteed if any booking issue arises.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Order Summary */}
          <div className="space-y-6">
            <div className="rounded-3xl border border-border/80 bg-card p-6 card-shadow-lg lg:sticky lg:top-8">
              <div className="flex items-center justify-between border-b border-border/60 pb-4">
                <h3 className="text-base font-bold text-foreground">Reservation Summary</h3>
                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-bold text-primary">
                  {nights} Nights
                </span>
              </div>

              {/* Property Image & Title */}
              <div className="mt-4 flex gap-3.5">
                <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-2xl bg-muted shadow-sm">
                  {property.images?.[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={property.images[0]} alt={property.title} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                      No Photo
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="line-clamp-2 text-sm font-bold text-foreground">{property.title}</h4>
                  <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                    <Building className="h-3 w-3 shrink-0" /> {property.city}
                  </p>
                </div>
              </div>

              {/* Rental Dates */}
              <div className="mt-4 rounded-2xl bg-muted/40 p-3 text-xs">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5 text-primary" />
                  <span>Check-in / Check-out:</span>
                </div>
                <p className="mt-1 font-bold text-foreground">
                  {formatDate(request.startDate)} → {formatDate(request.endDate)}
                </p>
              </div>

              {/* Price Breakdown */}
              <div className="mt-5 space-y-2.5 border-t border-border/60 pt-4 text-xs sm:text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Monthly Rent</span>
                  <span className="font-semibold text-foreground">{formatCurrency(amount)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Security Deposit</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">Waived (FREE)</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Stripe Processing Fee</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">$0.00</span>
                </div>

                <div className="flex justify-between border-t border-border/60 pt-3 text-base font-extrabold text-foreground">
                  <span>Total Due Today</span>
                  <span className="text-primary">{formatCurrency(amount)}</span>
                </div>
              </div>

              {/* Landlord info */}
              {request.landlord && (
                <div className="mt-5 flex items-center gap-3 border-t border-border/60 pt-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    <User className="h-4 w-4" />
                  </div>
                  <div className="text-xs">
                    <p className="text-muted-foreground">Landlord</p>
                    <p className="font-bold text-foreground">{request.landlord.name}</p>
                  </div>
                  <CheckCircle2 className="ml-auto h-4 w-4 text-emerald-500" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StripeCardForm({
  amount,
  requestId,
  defaultUserName,
}: {
  amount: number;
  requestId: string;
  defaultUserName: string;
}) {
  const router = useRouter();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Controlled typable inputs
  const [cardHolder, setCardHolder] = useState(defaultUserName);
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [zipCode, setZipCode] = useState("");

  // Auto-formatting card number
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "");
    if (val.length > 16) val = val.slice(0, 16);
    const formatted = val.replace(/(.{4})/g, "$1 ").trim();
    setCardNumber(formatted);
  };

  // Auto-formatting expiry date (MM/YY)
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "");
    if (val.length > 4) val = val.slice(0, 4);
    if (val.length >= 3) {
      setExpiry(`${val.slice(0, 2)} / ${val.slice(2)}`);
    } else {
      setExpiry(val);
    }
  };

  // CVC change
  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 4);
    setCvc(val);
  };

  // Quick fill test card credentials
  const fillTestCard = () => {
    setCardHolder(defaultUserName || "Tanvir Ahmed");
    setCardNumber("4242 4242 4242 4242");
    setExpiry("12 / 28");
    setCvc("123");
    setZipCode("1212");
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic validation
    if (!cardNumber.replace(/\s/g, "")) {
      setError("Please enter a valid card number.");
      return;
    }
    if (!expiry) {
      setError("Please enter card expiry date.");
      return;
    }
    if (!cvc) {
      setError("Please enter CVC code.");
      return;
    }

    setProcessing(true);

    try {
      // 1. Create Payment Intent
      const intent = await paymentApi.createIntent(requestId);

      // 2. Confirm Payment Intent on backend/Stripe
      await paymentApi.confirm(intent.data!.paymentId, intent.data!.transactionId);

      // 3. Redirect to Success Page
      router.push(`/payment/success?paymentId=${intent.data!.paymentId}&amount=${amount}`);
    } catch (err) {
      setError((err as Error).message || "Payment processing failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  // Detect card brand icon
  const getCardBrand = () => {
    const num = cardNumber.replace(/\s/g, "");
    if (num.startsWith("4")) return "VISA";
    if (num.startsWith("5") || num.startsWith("2")) return "MASTERCARD";
    if (num.startsWith("3")) return "AMEX";
    return "CARD";
  };

  return (
    <div className="space-y-6">
      {/* Header & Quick Fill Action */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-5">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary text-white shadow-md shadow-primary/25">
            <CreditCard className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-base font-bold text-foreground">Credit or Debit Card</h2>
            <p className="text-xs text-muted-foreground">Stripe Payment Gateway</p>
          </div>
        </div>

        <button
          type="button"
          onClick={fillTestCard}
          className="inline-flex items-center gap-1.5 rounded-xl border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary transition-all hover:bg-primary hover:text-white active:scale-95"
        >
          <Zap className="h-3.5 w-3.5" /> Quick Fill Test Card
        </button>
      </div>

      {/* Interactive Virtual Credit Card Visual */}
      <motion.div
        initial={{ scale: 0.98, opacity: 0.9 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-6 text-white shadow-xl shadow-slate-950/20 dark:from-slate-900 dark:to-slate-950"
      >
        <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-primary/20 blur-2xl" />
        <div className="relative flex items-center justify-between">
          <span className="text-xs font-extrabold tracking-widest text-slate-400">RENTNEST CARD</span>
          <span className="rounded-md bg-white/10 px-2 py-0.5 text-[10px] font-black tracking-wider text-emerald-400 backdrop-blur">
            {getCardBrand()}
          </span>
        </div>

        <div className="relative my-5 font-mono text-lg font-bold tracking-widest text-slate-100 sm:text-xl">
          {cardNumber || "4242 •••• •••• 4242"}
        </div>

        <div className="relative flex items-end justify-between text-xs">
          <div>
            <span className="block text-[10px] text-slate-400 uppercase">Cardholder</span>
            <span className="font-bold tracking-wide text-slate-200">{cardHolder || "Tanvir Ahmed"}</span>
          </div>
          <div>
            <span className="block text-[10px] text-slate-400 uppercase">Expires</span>
            <span className="font-bold tracking-wide text-slate-200">{expiry || "12 / 28"}</span>
          </div>
        </div>
      </motion.div>

      {/* Typable Input Form */}
      <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
        {/* Cardholder Name */}
        <div>
          <label className="mb-1.5 block text-xs font-bold text-foreground">
            Cardholder Name
          </label>
          <input
            type="text"
            value={cardHolder}
            onChange={(e) => setCardHolder(e.target.value)}
            placeholder="e.g. Tanvir Ahmed"
            required
            className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm font-medium text-foreground transition-all focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
          />
        </div>

        {/* Card Number */}
        <div>
          <label className="mb-1.5 block text-xs font-bold text-foreground">
            Card Number
          </label>
          <div className="relative">
            <input
              type="text"
              value={cardNumber}
              onChange={handleCardNumberChange}
              placeholder="4242 4242 4242 4242"
              required
              className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm font-mono font-medium text-foreground transition-all focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
            />
            <CreditCard className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>

        {/* Expiry, CVC & Zip Code */}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="mb-1.5 block text-xs font-bold text-foreground">
              Expiry Date
            </label>
            <input
              type="text"
              value={expiry}
              onChange={handleExpiryChange}
              placeholder="MM / YY"
              required
              className="w-full rounded-2xl border border-input bg-background px-3.5 py-3 text-sm font-mono font-medium text-foreground transition-all focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold text-foreground">
              CVC Code
            </label>
            <input
              type="text"
              value={cvc}
              onChange={handleCvcChange}
              placeholder="123"
              required
              className="w-full rounded-2xl border border-input bg-background px-3.5 py-3 text-sm font-mono font-medium text-foreground transition-all focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold text-foreground">
              ZIP Code
            </label>
            <input
              type="text"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              placeholder="1212"
              className="w-full rounded-2xl border border-input bg-background px-3.5 py-3 text-sm font-mono font-medium text-foreground transition-all focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
            />
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-2xl border border-danger/30 bg-danger/10 px-4 py-3 text-xs font-medium text-danger" role="alert">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <Button
          type="submit"
          size="lg"
          className="w-full rounded-2xl py-6 text-base font-extrabold shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/35 active:scale-[0.99]"
          disabled={processing}
          loading={processing}
        >
          {processing ? (
            "Processing Stripe Payment..."
          ) : (
            <>
              <Lock className="h-4 w-4" /> Pay {formatCurrency(amount)} via Stripe
            </>
          )}
        </Button>
      </form>
    </div>
  );
}

function PaySkeleton() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <Skeleton className="h-6 w-44 rounded-xl" />
      <Skeleton className="mt-6 h-10 w-72 rounded-xl" />
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-4 rounded-3xl border border-border bg-card p-8">
          <Skeleton className="h-40 w-full rounded-2xl" />
          <Skeleton className="h-12 w-full rounded-2xl" />
          <Skeleton className="h-12 w-full rounded-2xl" />
        </div>
        <div className="space-y-4 rounded-3xl border border-border bg-card p-6">
          <Skeleton className="h-6 w-32 rounded-xl" />
          <Skeleton className="h-44 w-full rounded-2xl" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    </div>
  );
}
