"use server";

import { pb } from "@/api/pb";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { RecordAuthResponse, RecordModel } from "pocketbase";

export async function login(authRes: RecordAuthResponse<RecordModel>) {
    const cookie = await cookies();
    cookie.set("pb_auth", JSON.stringify({ token: authRes.token }));

    redirect("/app");
}

export async function logout() {
    const cookie = await cookies();
    cookie.delete("pb_auth");
    pb.authStore.clear();

    redirect("/");
}
