import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_PREFIXES = [
  "/dashboard",
  "/admin-dashboard",
  "/bookmarks",
  "/revision",
  "/ranking",
  "/test",
  "/result",
  "/payments",
  "/profile",
  "/exam-history",
  "/practice",
];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  if (!isProtected) {
    return NextResponse.next();
  }

  const hasSession = request.cookies.get("gh_auth")?.value === "1";
  if (!hasSession) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin-dashboard",
    "/admin-dashboard/:path*",
    "/bookmarks/:path*",
    "/revision/:path*",
    "/ranking/:path*",
    "/test/:path*",
    "/tests/:path*",
    "/result/:path*",
    "/payments/:path*",
    "/profile/:path*",
    "/exam-history/:path*",
    "/practice/:path*",
  ],
};
