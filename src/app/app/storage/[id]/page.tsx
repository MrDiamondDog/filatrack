"use client";

import { pb } from "@/api/pb";
import MotionContainer from "@/components/base/MotionContainer";
import FilamentList from "@/components/filament/FilamentList";
import { toastError } from "@/lib/util/error";
import { FilamentRecord, StorageResponse } from "@/types/pb";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function StoragePage({ params }: { params: Promise<{ id: string }> }) {
    const user = pb.authStore.record;

    if (!user)
        return null;

    const [storage, setStorage] = useState<StorageResponse<{ filament?: FilamentRecord[] }>>();

    useEffect(() => {
        params.then(({ id }) => pb.collection("storage").getOne<StorageResponse<{ filament?: FilamentRecord[] }>>(
            id,
            { expand: "filament" }
        )
            .then(setStorage)
            .catch(e => toastError("Could not fetch storage", e)));
    }, []);

    return <MotionContainer>
        <Link href="/app" className="flex gap-1 items-center"><ArrowLeft /> Back</Link>
        {storage && <FilamentList filament={storage.expand.filament ?? []} title={storage.name} storagesList={[]} />}
    </MotionContainer>;
}
