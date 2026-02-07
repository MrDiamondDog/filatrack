"use client";

import { Suspense, useEffect, useState } from "react";
import StorageCard from "./StorageCard";
import { StorageRecord, UsersResponse } from "@/types/pb";
import { pb } from "@/api/pb";

export default function StorageList() {
    const user = pb.authStore.record as unknown as UsersResponse;

    if (!user)
        return null;

    const [storage, setStorage] = useState<StorageRecord[]>([]);

    useEffect(() => {
        pb.collection("storage").getFullList({
            filter: `user.id = "${user.id}"`,
        })
            .then(setStorage);
    }, []);

    return <div className="grid grid-cols-1 md:flex flex-row flex-wrap w-full h-fit gap-2">
        <Suspense>
            {storage.map(s => <StorageCard storage={s} key={s.id} />)}
        </Suspense>
    </div>;
}
