"use client";

import { pb } from "@/api/pb";
import { privacyPolicyLastUpdate } from "@/app/about/privacy-policy/page";
import { UsersRecord } from "@/types/pb";
import { useEffect } from "react";
import { toast } from "sonner";

export default function PrivacyPolicyChecker() {
    const user = pb.authStore.record as UsersRecord | null;

    if (!user)
        return null;

    useEffect(() => {
        setTimeout(() => {
            if (!user.lastSeenPrivacyPolicy || new Date(user.lastSeenPrivacyPolicy).getTime() < privacyPolicyLastUpdate.getTime()) {
                pb.collection("users").update<UsersRecord>(user.id, { lastSeenPrivacyPolicy: privacyPolicyLastUpdate });

                toast.info("Privacy Policy Update", {
                    description: <>
                        <p>We've updated our <a href="/about/privacy-policy">privacy policy</a>.</p>
                    </>,
                });
            }
        }, 2 * 1000);
    }, []);

    return null;
}
