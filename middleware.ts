import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Nama cookie session di Auth.js v5
  const sessionToken =
    request.cookies.get("authjs.session-token")?.value ||
    request.cookies.get("__Secure-authjs.session-token")?.value;

  const isLoggedin = !!sessionToken;

  const isAuthRoute = pathname.startsWith("/auth");

  // Logika Redirect: Jika akses halaman terproteksi tanpa login
  if (!isLoggedin && !isAuthRoute) {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  // Logika Redirect: Jika sudah login tapi coba buka halaman auth
  if (isLoggedin && isAuthRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
