import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("crm_token")?.value || req.headers.get("authorization");

  const isProtected = req.nextUrl.pathname.startsWith("/dashboard") ||
                      req.nextUrl.pathname.startsWith("/leads") ||
                      req.nextUrl.pathname.startsWith("/commission");

  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/leads/:path*", "/commission"]
};
