"use client";

import { Plus, Spool, Archive } from "lucide-react";
import { Dropdown, DropdownTrigger, DropdownContent, DropdownItem } from "../base/Dropdown";
import Button from "../base/Button";
import { useState } from "react";
import CreateFilamentModal from "../modals/CreateFilamentModal";
import CreateStorageModal from "../modals/CreateStorageModal";
import { FilamentPresetsRecord, FilamentRecord } from "@/types/pb";
import { StorageWithFilament } from "@/types/storage";
import { useDevice } from "@/lib/util/hooks";

type Props = {
    onFilamentCreate?: (f: FilamentRecord) => void;
    onStoragesModify?: (s: StorageWithFilament[]) => void;
    storages: StorageWithFilament[];
    presets: FilamentPresetsRecord[];
};

export default function CreateButton({ onFilamentCreate, onStoragesModify, storages, presets }: Props) {
    const [isMobile, _] = useDevice();
    const [openModal, setOpenModal] = useState("");

    return <>
        <Dropdown>
            <DropdownTrigger asChild>
                <Button className="h-full flex items-center justify-center gap-1"><Plus size={32} /> {!isMobile && "New"}</Button>
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

        <CreateFilamentModal open={openModal === "filament"} onClose={() => setOpenModal("")} onCreate={(f, s) => {
            onFilamentCreate?.(f);
            onStoragesModify?.(s);
        }} storages={storages} />
        <CreateStorageModal open={openModal === "storage"} onClose={() => setOpenModal("")}
            onCreate={s => onStoragesModify?.([...storages, s])}  />
    </>;
}
