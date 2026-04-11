"use client";

import { pb } from "@/api/pb";
import MotionContainer from "@/components/base/MotionContainer";
import Subtext from "@/components/base/Subtext";
import FilamentList from "@/components/filament/FilamentList";
import { toastError } from "@/lib/util/error";
import { FilamentRecord } from "@/types/pb";
import { StorageWithFilament } from "@/types/storage";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function StoragePage({ params }: { params: Promise<{ id: string }> }) {
    const user = pb.authStore.record;

    if (!user)
        return null;

    const [storages, setStorages] = useState<StorageWithFilament[]>([]);
    const [storage, setStorage] = useState<StorageWithFilament>();
    const [filament, setFilament] = useState<FilamentRecord[]>([]);

    useEffect(() => {
        params.then(({ id }) => pb.collection("storage").getFullList<StorageWithFilament>({
            filter: `user.id = "${user.id}"`,
            expand: "filament",
        })
            .then(list => {
                setStorages(list);

                const foundStorage = list.find(s => s.id === id);
                setStorage(foundStorage);
                setFilament(foundStorage?.expand.filament ?? []);
            })
            .catch(e => toastError("Could not fetch storage", e)));
    }, []);

    return <MotionContainer>
        <Link href="/app" className="flex gap-1 items-center"><ArrowLeft /> Back</Link>
        {storage && <FilamentList filament={filament} title={storage.name} storagesList={storages}
            onListModified={setFilament} onStoragesModified={setStorages} />}
        {!!storage?.capacity && <Subtext>Max. {storage.capacity} rolls</Subtext>}
    </MotionContainer>;
}
