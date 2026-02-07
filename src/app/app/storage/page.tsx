"use client";

import Button from "@/components/base/Button";
import Divider from "@/components/base/Divider";
import MotionContainer from "@/components/base/MotionContainer";
import CreateStorageModal from "@/components/modals/CreateStorageModal";
import StorageList from "@/components/storage/StorageList";
import { Plus } from "lucide-react";
import { useState } from "react";

export default function StoragePage() {
    const [openModal, setOpenModal] = useState("");

    // TODO: backend
    return <MotionContainer>
        <div className="flex items-center justify-between">
            <h2>Storage</h2>
            <Button className="h-full flex items-center justify-center gap-1" onClick={() => setOpenModal("storage")}>
                <Plus size={32} /> New
            </Button>
        </div>

        <Divider />

        <StorageList />

        <CreateStorageModal open={openModal === "storage"} onClose={() => setOpenModal("")} />
    </MotionContainer>;
}
