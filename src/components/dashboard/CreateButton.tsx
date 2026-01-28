"use client";

import { Plus, Spool, Archive } from "lucide-react";
import { Dropdown, DropdownTrigger, DropdownContent, DropdownItem } from "../base/Dropdown";
import Button from "../base/Button";
import { useState } from "react";
import CreateFilamentModal from "../modals/CreateFilamentModal";
import CreateStorageModal from "../modals/CreateStorageModal";

export default function CreateButton() {
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

        <CreateFilamentModal open={openModal === "filament"} onClose={() => setOpenModal("")} />
        <CreateStorageModal open={openModal === "storage"} onClose={() => setOpenModal("")} />
    </>;
}
