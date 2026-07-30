"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { MobileNav } from "@/components/layout/mobile-nav";

const HIDE_CHROME = (p: string) =>
  p.startsWith("/auth") ||
  p.startsWith("/dashboard") ||
  p.startsWith("/payment");

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hidden = HIDE_CHROME(pathname);

  if (hidden) return <>{children}</>;

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <MobileNav />
    </div>
  );
}
