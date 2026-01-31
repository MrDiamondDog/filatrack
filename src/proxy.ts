import { NextRequest, NextResponse } from "next/server";
import { isTokenExpired } from "pocketbase";

export function proxy(request: NextRequest) {
    if (request.nextUrl.pathname.startsWith("/app")) {
        const authCookie = request.cookies.get("pb_auth");
        const token = authCookie?.value ? JSON.parse(authCookie.value).token : null;

        if (!token || isTokenExpired(token)) {
            const url = request.nextUrl.clone();
            url.pathname = "/login";
            return NextResponse.redirect(url.toString());
        }
    }
}

export const config = {
    matcher: "/app",
};
