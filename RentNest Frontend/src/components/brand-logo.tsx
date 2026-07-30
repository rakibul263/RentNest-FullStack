import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  className?: string;
  iconOnly?: boolean;
  size?: "sm" | "md" | "lg";
}

export function BrandLogo({ className, iconOnly = false, size = "md" }: BrandLogoProps) {
  const dimension = size === "sm" ? 32 : size === "lg" ? 44 : 38;
  const textSize = size === "sm" ? "text-lg" : size === "lg" ? "text-2xl" : "text-xl";

  return (
    <Link
      href="/"
      className={cn("inline-flex items-center gap-2.5 group transition-transform active:scale-95", className)}
      aria-label="RentNest home"
    >
      <div className="relative flex items-center justify-center overflow-hidden rounded-xl border border-primary/20 bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-1 shadow-md shadow-primary/20 transition-all duration-300 group-hover:scale-105 group-hover:border-primary/40 group-hover:shadow-lg group-hover:shadow-primary/30">
        <Image
          src="/icon.png"
          alt="RentNest Logo"
          width={dimension}
          height={dimension}
          className="rounded-lg object-contain"
          priority
        />
      </div>
      {!iconOnly && (
        <span className={cn("font-extrabold tracking-tight text-foreground", textSize)}>
          Rent<span className="text-primary">Nest</span>
        </span>
      )}
    </Link>
  );
}
