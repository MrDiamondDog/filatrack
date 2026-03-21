"use client";

import { pb } from "@/api/pb";
import Button from "@/components/base/Button";
import Divider from "@/components/base/Divider";
import MotionContainer from "@/components/base/MotionContainer";
import CreateStorageModal from "@/components/modals/CreateStorageModal";
import StorageList from "@/components/storage/StorageList";
import { toastError } from "@/lib/util/error";
import { FilamentRecord, StorageResponse } from "@/types/pb";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";

export default function StoragePage() {
    const user = pb.authStore.record;

    if (!user)
        return null;

    const [openModal, setOpenModal] = useState("");
    const [storages, setStorages] = useState<StorageResponse<{ filament: FilamentRecord[]; }>[]>([]);

    useEffect(() => {
        pb.collection("storage").getFullList<StorageResponse<{ filament: FilamentRecord[]; }>>({
            filter: `user.id = "${user.id}"`,
        })
            .then(setStorages)
            .catch(e => toastError("Could not fetch storages", e));
    }, []);

    return <MotionContainer>
        <div className="flex items-center justify-between">
            <h2>Storage</h2>
            <Button className="h-full flex items-center justify-center gap-1" onClick={() => setOpenModal("storage")}>
                <Plus size={32} /> New
            </Button>
        </div>

        <Divider />

        <StorageList storages={storages} />

        <CreateStorageModal open={openModal === "storage"} onClose={() => setOpenModal("")}
        // @ts-ignore They are compatible, I swear
            onCreate={s => setStorages([...storages, s])} />
    </MotionContainer>;
}
