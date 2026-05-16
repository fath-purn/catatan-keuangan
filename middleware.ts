import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Nama cookie session di Auth.js v5
  const sessionToken =
    request.cookies.get("authjs.session-token")?.value ||
    request.cookies.get("__Secure-authjs.session-token")?.value;

  const isLoggedin = !!sessionToken;

  // Logika Redirect: Jika akses / tanpa login
  if (pathname.startsWith("/") && !isLoggedin) {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  // Logika Redirect: Jika sudah login tapi coba buka /signin atau /register
  if (
    (pathname.startsWith("/auth/signin") ||
      pathname.startsWith("/auth/register")) &&
    isLoggedin
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
