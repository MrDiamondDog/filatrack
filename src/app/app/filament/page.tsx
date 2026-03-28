"use client";

import { pb } from "@/api/pb";
import MotionContainer from "@/components/base/MotionContainer";
import FilamentList from "@/components/filament/FilamentList";
import { toastError } from "@/lib/util/error";
import { FilamentPresetsRecord, FilamentRecord, UsersResponse } from "@/types/pb";
import { StorageWithFilament } from "@/types/storage";
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
    const [storages, setStorages] = useState<StorageWithFilament[]>([]);
    const [presets, setPresets] = useState<FilamentPresetsRecord[]>([]);

    useEffect(() => {
        pb.collection("filament").getFullList({
            filter: `user.id = "${user.id}"`,
        })
            .then(setFilament)
            .catch(e => toastError("Could not fetch filament", e));

        pb.collection("storage").getFullList<StorageWithFilament>({
            filter: `user.id = "${user.id}"`,
            expand: "filament",
        })
            .then(setStorages)
            .catch(e => toastError("Could not fetch storages", e));

        pb.collection("filamentPresets").getFullList({
            filter: `user.id = "${user.id}"`,
        })
            .then(setPresets)
            .catch(e => toastError("Could not fetch filament", e));
    }, []);

    return <MotionContainer>
        <FilamentList title="Your Filament" filament={filament} storagesList={storages} presets={presets} allowAdd
            onListModified={setFilament} onStoragesModified={setStorages} allowEdit allowSort />
        {!filament.length && <p className="w-full text-center">
            You don't have any filament yet. Press the + button in the top right to get started!
        </p>}
    </MotionContainer>;
}
