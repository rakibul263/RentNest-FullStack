"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Home, LayoutDashboard, Search, User } from "lucide-react";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const pathname = usePathname();
  const isAuth = pathname.startsWith("/auth");
  const isDashboard = pathname.startsWith("/dashboard");

  const items = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/properties", icon: Search, label: "Search" },
    {
      href: isDashboard
        ? pathname
        : "/dashboard/tenant",
      icon: LayoutDashboard,
      label: "Dashboard",
      match: (p: string) => p.startsWith("/dashboard"),
    },
    { href: "/properties", icon: Heart, label: "Saved" },
    {
      href: isAuth ? pathname : "/auth/login",
      icon: User,
      label: "Profile",
      match: (p: string) => p.startsWith("/auth"),
    },
  ];

  if (isDashboard) return null;

  return (
    <nav
      className="glass fixed inset-x-0 bottom-0 z-40 border-t border-border/70 pb-[env(safe-area-inset-bottom)] md:hidden"
      aria-label="Mobile navigation"
    >
      <div className="mx-auto flex max-w-md items-center justify-around px-2 py-1.5">
        {items.map(({ href, icon: Icon, label, match }) => {
          const active = match ? match(pathname) : pathname === href;
          return (
            <Link
              key={label}
              href={href}
              className={cn(
                "flex flex-col items-center gap-0.5 rounded-xl px-4 py-1.5 text-[10px] font-semibold transition-colors",
                active ? "text-primary" : "text-muted-foreground"
              )}
            >
              <Icon className={cn("h-5 w-5", active && "drop-shadow")} />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
