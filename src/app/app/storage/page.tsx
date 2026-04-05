"use client";

import { pb } from "@/api/pb";
import Button from "@/components/base/Button";
import Divider from "@/components/base/Divider";
import MotionContainer from "@/components/base/MotionContainer";
import Spinner from "@/components/base/Spinner";
import CreateStorageModal from "@/components/modals/CreateStorageModal";
import StorageList from "@/components/storage/StorageList";
import { toastError } from "@/lib/util/error";
import { StorageWithFilament } from "@/types/storage";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";

export default function StoragePage() {
    const user = pb.authStore.record;

    if (!user)
        return null;

    const [openModal, setOpenModal] = useState("");
    const [storages, setStorages] = useState<StorageWithFilament[]>();

    useEffect(() => {
        pb.collection("storage").getFullList<StorageWithFilament>({
            filter: `user.id = "${user.id}"`,
            expand: "filament",
        })
            .then(setStorages)
            .catch(e => toastError("Could not fetch storages", e));
    }, []);

    return <MotionContainer>
        {storages ? <>
            <div className="flex items-center justify-between">
                <h2>Storage</h2>
                <Button className="h-full flex items-center justify-center gap-1" onClick={() => setOpenModal("storage")}>
                    <Plus size={32} /> New
                </Button>
            </div>

            <Divider />

            <StorageList storages={storages} onListUpdate={setStorages} />

            {!storages.length && <p className="w-full text-center">
                You don't have any storages yet. Press the + button in the top right to get started!
            </p>}

            <CreateStorageModal open={openModal === "storage"} onClose={() => setOpenModal("")}
                onCreate={s => setStorages([...storages, s])} />
        </> : <Spinner />}
    </MotionContainer>;
}
