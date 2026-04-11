"use client";

import { pb } from "@/api/pb";
import { UsersRecord } from "@/types/pb";
import { useEffect } from "react";
import * as Swetrix from "swetrix";

export default function Analytics() {
    const user = pb.authStore.record as UsersRecord | null;

    if (!user)
        return;

    useEffect(() => {
        if (!user.allowAnalytics)
            return;

        Swetrix.init("8FhyFx9cOt6l", {
            apiURL: "https://a.filatrack.app/backend/v1/log",
            devMode: true,
            respectDNT: true,
        });
        Swetrix.trackViews();
        Swetrix.trackErrors();
    }, []);

    return null;
}
