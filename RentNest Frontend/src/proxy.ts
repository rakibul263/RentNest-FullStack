import { NextRequest, NextResponse } from "next/server";

const decodeJwtPayload = (token: string): { id?: string; role?: string } | null => {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = JSON.parse(
      Buffer.from(parts[1], "base64url").toString("utf-8")
    );
    return payload as { id?: string; role?: string };
  } catch {
    return null;
  }
};

const ROLE_ROUTE_MAP: Record<string, string> = {
  tenant: "/dashboard/tenant",
  landlord: "/dashboard/landlord",
  admin: "/dashboard/admin",
};

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("rn_token")?.value;
  const payload = token ? decodeJwtPayload(token) : null;
  const role = payload?.role;

  const isDashboard = pathname.startsWith("/dashboard");
  const isTenantArea =
    pathname.startsWith("/dashboard/tenant") ||
    pathname.startsWith("/payment");
  const isLandlordArea = pathname.startsWith("/dashboard/landlord");
  const isAdminArea = pathname.startsWith("/dashboard/admin");
  const isAuthPage = pathname.startsWith("/auth");

  // Authenticated user visiting auth pages → send to their dashboard
  if (isAuthPage && role) {
    const dest = ROLE_ROUTE_MAP[role];
    if (dest) {
      const url = req.nextUrl.clone();
      url.pathname = dest;
      return NextResponse.redirect(url);
    }
  }

  // Protected areas require a token
  if (isDashboard && !role) {
    const url = req.nextUrl.clone();
    url.pathname = "/auth/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  // Role-based guards
  if (isTenantArea && role && role !== "tenant" && role !== "admin") {
    return redirectTo(req, ROLE_ROUTE_MAP[role] ?? "/");
  }
  if (isAdminArea && role && role !== "admin") {
    return redirectTo(req, "/dashboard/landlord");
  }
  if (isLandlordArea && role && role !== "landlord" && role !== "admin") {
    return redirectTo(req, "/dashboard/tenant");
  }

  return NextResponse.next();
}

function redirectTo(req: NextRequest, pathname: string) {
  const url = req.nextUrl.clone();
  url.pathname = pathname;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth/:path*", "/payment/:path*"],
};
