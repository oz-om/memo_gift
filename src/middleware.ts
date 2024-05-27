import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    if (pathname.startsWith("/profile")) {
      if (!token) {
        return NextResponse.redirect(new URL("/sign-in", req.url));
      }
    }

    if (pathname.startsWith("/dashboard")) {
      if (!token || token.role !== "admin") {
        return NextResponse.redirect(new URL("/not-found", req.url));
      }
    }

    if (pathname === "/sign-in" || pathname === "/sign-up") {
      if (token) {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: () => true,
    },
  },
);

export const config = {
  matcher: ["/profile/:path*", "/dashboard/:path*", "/sign-in", "/sign-up"],
};
