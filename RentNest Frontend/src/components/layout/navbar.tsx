"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  LogOut,
  Menu,
  PlusCircle,
  Search,
  User as UserIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/hooks/use-auth";
import { cn, ROLE_META } from "@/lib/utils";
import { Avatar, Dropdown, MenuButton, MenuLabel, MenuSeparator } from "@/components/ui/avatar";
import { BrandLogo } from "@/components/brand-logo";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Properties", href: "/properties" },
  { label: "About", href: "/about" },
];

const dashboardHref = (role: string) =>
  role === "tenant"
    ? "/dashboard/tenant"
    : role === "landlord"
      ? "/dashboard/landlord"
      : "/dashboard/admin";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, isAuthenticated } = useAuth();
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const isHome = pathname === "/";
  const transparent = isHome && !scrolled && !mobileOpen;

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  React.useEffect(() => setMobileOpen(false), [pathname]);

  const dashboardLink = user ? dashboardHref(user.role) : "/auth/login";

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-all duration-300",
        transparent
          ? "bg-transparent"
          : "glass border-b border-border/70 shadow-sm"
      )}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <BrandLogo />

        <div className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "relative rounded-xl px-4 py-2 text-sm font-medium transition-colors hover:bg-muted/70 hover:text-foreground",
                pathname === link.href
                  ? "text-foreground"
                  : "text-muted-foreground"
              )}
            >
              {pathname === link.href && (
                <motion.span
                  layoutId="nav-active"
                  className="absolute inset-0 rounded-xl bg-muted"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative">{link.label}</span>
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/properties"
            className="hidden items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:inline-flex lg:hidden xl:inline-flex"
          >
            <Search className="h-4 w-4" />
            Search
          </Link>

          {isAuthenticated && user?.role === "tenant" && (
            <Link
              href="/properties"
              className="hidden items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:inline-flex"
            >
              <PlusCircle className="h-4 w-4" />
              Rent
            </Link>
          )}

          {isAuthenticated && user?.role !== "admin" && (
            <Link href="/auth/register" className="hidden sm:inline-flex">
              <Button variant="outline" size="sm" className="border-primary/30 text-primary hover:border-primary">
                Become a Landlord
              </Button>
            </Link>
          )}

          <ThemeToggle />

          {!isAuthenticated ? (
            <div className="hidden items-center gap-2 md:flex">
              <Link href="/auth/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button size="sm">Register</Button>
              </Link>
            </div>
          ) : user ? (
            <Dropdown
              trigger={
                <span className="flex items-center gap-2 rounded-xl border border-border bg-card/60 p-1 pr-1 transition-colors hover:bg-muted sm:pr-3">
                  <Avatar name={user.name} className="h-8 w-8 text-xs" />
                  <span className="hidden text-sm font-semibold text-foreground sm:block">
                    {user.name.split(" ")[0]}
                  </span>
                </span>
              }
            >
              {(close) => (
                <div>
                  <div className="px-3 py-2">
                    <p className="truncate text-sm font-bold text-foreground">{user.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <MenuSeparator />
                  <MenuLabel>Dashboard</MenuLabel>
                  <MenuButton onClick={() => { close(); router.push(dashboardHref(user.role)); }}>
                    <LayoutDashboard className="h-4 w-4" />
                    {ROLE_META[user.role].label} Dashboard
                  </MenuButton>
                  <MenuButton onClick={() => { close(); router.push("/properties"); }}>
                    <Search className="h-4 w-4" />
                    Browse Properties
                  </MenuButton>
                  <MenuButton onClick={() => { close(); router.push("/auth/login"); }}>
                    <UserIcon className="h-4 w-4" />
                    Profile
                  </MenuButton>
                  <MenuSeparator />
                  <MenuButton danger onClick={() => { close(); logout(); }}>
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </MenuButton>
                </div>
              )}
            </Dropdown>
          ) : null}

          <button
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card/60 text-foreground md:hidden"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass border-t border-border/70 px-4 pb-4 pt-2 md:hidden"
        >
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-xl px-4 py-2.5 text-sm font-medium",
                  pathname === link.href
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
            {isAuthenticated ? (
              <>
                <Link
                  href={dashboardLink}
                  className="rounded-xl px-4 py-2.5 text-sm font-medium text-muted-foreground"
                >
                  Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="rounded-xl px-4 py-2.5 text-left text-sm font-medium text-danger"
                >
                  Sign out
                </button>
              </>
            ) : (
              <div className="mt-2 flex gap-2">
                <Link href="/auth/login" className="flex-1">
                  <Button variant="outline" className="w-full">
                    Login
                  </Button>
                </Link>
                <Link href="/auth/register" className="flex-1">
                  <Button className="w-full">Register</Button>
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </header>
  );
}
