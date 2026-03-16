// src/middleware.ts

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { privateRoutes, RoutesLink } from "./Utilities/RouteLinks";

const authRoutes = ["/", "/signin", "/signup", "/forgot-password", "/verify-otp", "/reset-password"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("pinepeAccessToken")?.value;
  const rawUserRole = request.cookies.get("pinepeRole")?.value?.toLowerCase();
  const userRole =
    rawUserRole === "superadmin"
      ? "admin"
      : rawUserRole === "retailer"
      ? "user"
      : rawUserRole;
  const kycStatus = request.cookies.get("KYCStatus")?.value;
  const is2FADone = request.cookies.get("is2FADone")?.value;
  const allowRegistration = request.cookies.get("allow_registration")?.value;

  if (pathname === "/signup") {
    if (allowRegistration === "0") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  if (token && authRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // if (!token && !authRoutes.includes(pathname)) {
  //   const loginUrl = new URL("/", request.url);
  //   loginUrl.searchParams.set("from", pathname);
  //   return NextResponse.redirect(loginUrl);
  // }

  if (token && !authRoutes.includes(pathname)) {
    if (pathname === RoutesLink.userManagement && userRole !== "admin") {
      return NextResponse.redirect(new URL("/forbidden", request.url));
    }

   
    const routeConfig = privateRoutes.find((route) => {
      const regex = new RegExp(`^${route.path.replace(/:\w+/g, "[^/]+")}$`);
      return regex.test(pathname);
    });

    if (routeConfig) {
      if (!userRole || !routeConfig.roles.includes(userRole)) {
        return NextResponse.redirect(new URL("/forbidden", request.url));
      }
    } else {
      return NextResponse.redirect(new URL("/forbidden", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|assets|favicon.ico|forbidden).*)",
  ],
};
