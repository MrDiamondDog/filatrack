"use client";

import { pb } from "@/api/pb";
import MotionContainer from "@/components/base/MotionContainer";
import FilamentList from "@/components/filament/FilamentList";
import { FilamentRecord, UsersResponse } from "@/types/pb";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export default function FilamentPage({
    searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    // Backwards compatibility with old qr codes
    searchParams.then(s => !!s.f && redirect(`/app/filament/${s.f}`));

    const user = pb.authStore.record as unknown as UsersResponse;

    if (!user)
        return null;

    const [filament, setFilament] = useState<FilamentRecord[]>([]);

    useEffect(() => {
        pb.collection("filament").getFullList({
            filter: `user.id = "${user.id}"`,
        })
            .then(setFilament);
    }, []);

    // TODO: backend
    return <MotionContainer>
        <FilamentList title="Your Filament" filament={filament} allowAdd />
    </MotionContainer>;
}
