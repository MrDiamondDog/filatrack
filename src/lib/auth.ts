"use server";

import { pb } from "@/api/pb";
import { UsersResponse } from "@/types/pb";
import { RequestCookies } from "next/dist/compiled/@edge-runtime/cookies";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { isTokenExpired, RecordAuthResponse } from "pocketbase";

export async function login(authRes: RecordAuthResponse<UsersResponse>) {
    const cookie = await cookies();
    cookie.set("pb_auth", JSON.stringify({ token: authRes.token }), { expires: Date.now() + 1000 * 60 * 60 * 24 * 7 });

    redirect("/app");
}

export async function logout() {
    const cookie = await cookies();
    cookie.delete("pb_auth");
    pb.authStore.clear();

    redirect("/");
}

export async function isAuthed(cookies: RequestCookies | ReadonlyRequestCookies) {
    const authCookie = cookies.get("pb_auth");
    const token = authCookie?.value ? JSON.parse(authCookie.value).token : null;

    return token && !isTokenExpired(token);
}
