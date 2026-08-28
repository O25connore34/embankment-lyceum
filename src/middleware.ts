import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/files") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }
  if (
    pathname === "/ru" ||
    pathname === "/en" ||
    pathname.startsWith("/ru/") ||
    pathname.startsWith("/en/")
  ) {
    return NextResponse.next();
  }
  const url = request.nextUrl.clone();
  url.pathname = `/ru${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.svg|images|files).*)"],
};
