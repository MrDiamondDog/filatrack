"use client";

import { pb } from "@/api/pb";
import { getPublicEnv } from "@/public-env";
import { UsersRecord } from "@/types/pb";
import { useEffect } from "react";
import * as Swetrix from "swetrix";

export default function Analytics() {
    const user = pb.authStore.record as UsersRecord | null;

    if (!user)
        return;

    useEffect(() => {
        const [id, url] = [getPublicEnv().SWETRIX_ID, getPublicEnv().SWETRIX_URL];

        if (!user.allowAnalytics || !id || !url)
            return;

        Swetrix.init(id, {
            apiURL: url,
            devMode: true,
            respectDNT: true,
        });
        Swetrix.trackViews();
        Swetrix.trackErrors();
    }, []);

    return null;
}
