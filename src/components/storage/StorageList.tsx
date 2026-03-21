"use client";

import { Suspense } from "react";
import StorageCard from "./StorageCard";
import { FilamentRecord, StorageResponse, UsersResponse } from "@/types/pb";
import { pb } from "@/api/pb";

export default function StorageList({ storages }: { storages: StorageResponse<{ filament: FilamentRecord[]; }>[] }) {
    const user = pb.authStore.record as unknown as UsersResponse;

    if (!user)
        return null;

    return <div className="grid grid-cols-1 md:flex flex-row flex-wrap w-full h-fit gap-2">
        <Suspense>
            {storages.map(s => <StorageCard storage={s} key={s.id} />)}
        </Suspense>
    </div>;
}
