"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Building2, Eye, EyeOff, Lock, Mail, Phone, User, Users } from "lucide-react";
import * as React from "react";
import { AuthLayout } from "@/components/auth/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";

const schema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email"),
    phone: z
      .string()
      .optional()
      .refine(
        (v) => !v || /^(?:\+?8801[3-9]\d{8}|01[3-9]\d{8})$/.test(v.replace(/[\s-]/g, "")),
        "Enter a valid Bangladeshi phone number (e.g. 01XXXXXXXXX)"
      ),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirm: z.string(),
    role: z.enum(["tenant", "landlord"], { message: "Select a role" }),
  })
  .refine((d) => d.password === d.confirm, {
    message: "Passwords do not match",
    path: ["confirm"],
  });

type FormValues = z.infer<typeof schema>;

const DASHBOARD: Record<string, string> = {
  tenant: "/dashboard/tenant",
  landlord: "/dashboard/landlord",
};

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerUser } = useAuth();
  const [showPassword, setShowPassword] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { role: "tenant" },
  });

  const role = useWatch({ control, name: "role" });

  const onSubmit = async (values: FormValues) => {
    setError(null);
    setLoading(true);
    try {
      const user = await registerUser({
        name: values.name,
        email: values.email,
        password: values.password,
        role: values.role,
        phone: values.phone || undefined,
      });
      router.refresh();
      router.push(DASHBOARD[user.role] ?? "/");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join RentNest as a tenant or landlord in under a minute."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-foreground">
            I&apos;m a…
          </label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: "tenant" as const, label: "Tenant", desc: "Looking for a home", icon: Users },
              { value: "landlord" as const, label: "Landlord", desc: "Renting out property", icon: Building2 },
            ].map((r) => (
              <button
                key={r.value}
                type="button"
                onClick={() => setValue("role", r.value)}
                className={cn(
                  "relative rounded-2xl border-2 p-4 text-left transition-all",
                  role === r.value
                    ? "border-primary bg-primary/5 shadow-sm shadow-primary/10"
                    : "border-border bg-card hover:border-primary/40"
                )}
              >
                {role === r.value && (
                  <motion.span
                    layoutId="role-indicator"
                    className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white"
                  >
                    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M5 13l4 4L19 7"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </motion.span>
                )}
                <r.icon
                  className={cn(
                    "h-6 w-6",
                    role === r.value ? "text-primary" : "text-muted-foreground"
                  )}
                />
                <p className="mt-2 text-sm font-bold text-foreground">{r.label}</p>
                <p className="text-xs text-muted-foreground">{r.desc}</p>
              </button>
            ))}
          </div>
          {errors.role && (
            <p className="mt-1 text-xs text-danger">{errors.role.message}</p>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-foreground">
            Full name
          </label>
          <div className="relative">
            <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Your full name"
              className="pl-10"
              autoComplete="name"
              {...register("name")}
            />
          </div>
          {errors.name && (
            <p className="mt-1 text-xs text-danger">{errors.name.message}</p>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-foreground">
              Email
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="email"
                placeholder="your@email.com"
                className="pl-10"
                autoComplete="email"
                {...register("email")}
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-xs text-danger">{errors.email.message}</p>
            )}
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-foreground">
              Phone <span className="text-muted-foreground">(optional)</span>
            </label>
            <div className="relative">
              <Phone className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="tel"
                placeholder="01XXXXXXXXX"
                className="pl-10"
                autoComplete="tel"
                {...register("phone")}
              />
            </div>
            {errors.phone && (
              <p className="mt-1 text-xs text-danger">{errors.phone.message}</p>
            )}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-foreground">
              Password
            </label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Min. 6 characters"
                className="pl-10 pr-10"
                autoComplete="new-password"
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-danger">{errors.password.message}</p>
            )}
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-foreground">
              Confirm password
            </label>
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Repeat password"
              autoComplete="new-password"
              {...register("confirm")}
            />
            {errors.confirm && (
              <p className="mt-1 text-xs text-danger">{errors.confirm.message}</p>
            )}
          </div>
        </div>

        {error && (
          <div
            className="rounded-xl bg-danger/10 px-4 py-3 text-sm font-medium text-danger"
            role="alert"
          >
            {error}
          </div>
        )}

        <Button type="submit" size="lg" className="w-full" loading={loading}>
          {loading ? "Creating account…" : "Create account"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/auth/login" className="font-semibold text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
