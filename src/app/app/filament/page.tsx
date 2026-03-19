"use client";

import { pb } from "@/api/pb";
import MotionContainer from "@/components/base/MotionContainer";
import FilamentList from "@/components/filament/FilamentList";
import { toastError } from "@/lib/util/error";
import { FilamentRecord, StorageRecord, UsersResponse } from "@/types/pb";
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
    const [storages, setStorages] = useState<StorageRecord[]>([]);

    useEffect(() => {
        pb.collection("filament").getFullList({
            filter: `user.id = "${user.id}"`,
        })
            .then(setFilament)
            .catch(e => toastError("Could not fetch filament", e));

        pb.collection("storage").getFullList({
            filter: `user.id = "${user.id}"`,
        })
            .then(setStorages)
            .catch(e => toastError("Could not fetch storages", e));
    }, []);

    return <MotionContainer>
        <FilamentList title="Your Filament" filament={filament} storagesList={storages} allowAdd onListModified={setFilament} />
    </MotionContainer>;
}
