import { NextRequest, NextResponse } from "next/server";
import { isAuthed } from "./lib/auth";

export async function proxy(request: NextRequest) {
    if (!(await isAuthed(request.cookies))) {
        const newUrl = request.nextUrl.clone();
        newUrl.pathname = "/login";
        return NextResponse.redirect(newUrl);
    }
}

export const config = {
    matcher: "/app/:path*",
};
