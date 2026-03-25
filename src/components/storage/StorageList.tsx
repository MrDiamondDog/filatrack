"use client";

import { Suspense } from "react";
import StorageCard from "./StorageCard";
import { UsersResponse } from "@/types/pb";
import { pb } from "@/api/pb";
import { deleteFromArray, modifyArrayItem } from "@/lib/util/array";
import { StorageWithFilament } from "@/types/storage";

export default function StorageList({ storages, onListUpdate }:
    { storages: StorageWithFilament[],
    onListUpdate: (s: StorageWithFilament[]) => void }) {
    const user = pb.authStore.record as unknown as UsersResponse;

    if (!user)
        return null;

    return <div className="grid grid-cols-1 md:flex flex-row flex-wrap w-full h-fit gap-2">
        <Suspense>
            {storages.map(s => <StorageCard
                storage={s}
                key={s.id}
                onDelete={() => onListUpdate(deleteFromArray(storages, s, "id"))}
                onModify={s => onListUpdate(modifyArrayItem(storages, s, "id"))}
            />)}
        </Suspense>
    </div>;
}
