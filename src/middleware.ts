import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export default function middleware(request: NextRequest) {
  const cookie = request.cookies.get("next-auth.session-token");
  const token = request;
  if (!cookie) {
    if (!request.nextUrl.pathname.split("/").includes("user")) {
      return NextResponse.redirect(new URL("/user/signIn", request.url));
    }
  } else {
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/((?!_next/static|favicon.ico|user/signIn|signin).*)"],
};
