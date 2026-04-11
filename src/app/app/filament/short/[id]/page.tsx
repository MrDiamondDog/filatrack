"use client";

import { pb } from "@/api/pb";
import { UsersRecord } from "@/types/pb";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

// Backwards compatible redirect page for old QR codes that used a special "shortId".
export default function CompatibleFilamentPage({ params }: { params: Promise<{ id: string }> }) {
    const user = pb.authStore.record as unknown as UsersRecord;

    if (!user)
        return null;

    const router = useRouter();

    useEffect(() => {
        params.then(p => {
            pb.collection("filament").getFirstListItem(`user.id = "${user.id}" && shortId = "${p.id}"`)
                .then(res => router.push(`/app/filament/${res.id}`))
                .catch(e => toast.error("Could not find scanned filament. Please make a new QR code."));
        });
    }, []);

    return <></>;
}
