"use client";

import { Plus, Spool, Archive } from "lucide-react";
import { Dropdown, DropdownTrigger, DropdownContent, DropdownItem } from "../base/Dropdown";
import Button from "../base/Button";
import { useState } from "react";
import CreateFilamentModal from "../modals/CreateFilamentModal";
import CreateStorageModal from "../modals/CreateStorageModal";
import { FilamentRecord, StorageResponse } from "@/types/pb";

export default function CreateButton({ onFilamentCreate, onStorageCreate }:
    { onFilamentCreate?: (f: FilamentRecord) => void, onStorageCreate?: (s: StorageResponse) => void
}) {
    const [openModal, setOpenModal] = useState("");

    return <>
        <Dropdown>
            <DropdownTrigger asChild>
                <Button className="h-full flex items-center justify-center gap-1"><Plus size={32} /> New</Button>
            </DropdownTrigger>
            <DropdownContent>
                <DropdownItem onClick={() => setOpenModal("filament")} className="flex gap-1 items-center">
                    <Spool /> Filament
                </DropdownItem>
                <DropdownItem onClick={() => setOpenModal("storage")} className="flex gap-1 items-center">
                    <Archive /> Storage
                </DropdownItem>
            </DropdownContent>
        </Dropdown>

        <CreateFilamentModal open={openModal === "filament"} onClose={() => setOpenModal("")} onCreate={f => onFilamentCreate?.(f)} />
        <CreateStorageModal open={openModal === "storage"} onClose={() => setOpenModal("")} onCreate={s => onStorageCreate?.(s)}  />
    </>;
}
