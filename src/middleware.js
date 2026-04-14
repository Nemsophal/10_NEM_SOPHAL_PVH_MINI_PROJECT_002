import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

const protectedRoutes = [
  "/products",
  "/manage-products",
  "/cart",
  "/orders",
];

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/products",
    "/products/:path*",
    "/manage-products",
    "/manage-products/:path*",
    "/cart",
    "/cart/:path*",
    "/orders",
    "/orders/:path*",
  ],
};

