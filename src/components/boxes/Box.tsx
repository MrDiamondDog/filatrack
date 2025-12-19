import { Archive, EllipsisVertical, Shapes, Weight } from "lucide-react";
import Subtext from "../Subtext";
import { Box, Filament } from "@/db/types";
import { grams } from "@/lib/units";
import { endpoints } from "@/lib/constants";
import { Dropdown, DropdownContent, DropdownItem, DropdownTrigger } from "../Dropdown";
import { useState } from "react";
import CreateBoxModal from "./CreateBox";
import Button, { ButtonStyles } from "../Button";
import Divider from "../Divider";
import Modal, { ModalFooter } from "../Modal";
import { app } from "@/lib/db";
import { handleApiError } from "@/lib/errors";

export default function BoxEntry({ box, allFilament, onEdit, onDelete, editMode }:
    { box: Box, allFilament: Filament[], onEdit: (box: Box) => void, onDelete: () => void, editMode?: boolean }) {
    const [openModal, setOpenModal] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function onDeleteConfirm() {
        setError("");
        setLoading(true);

        const res = await app.boxes.deleteBox(box.id);

        if (res.error) {
            setError(handleApiError(res.error));
            setLoading(false);
            return;
        }

        setLoading(false);
        onDelete();
        setOpenModal("");
    }

    return (<>
        <a
            className={`bg-bg-light p-2 rounded-lg flex flex-col gap-1 cursor-pointer
                    transition-all border-2 border-transparent hover:border-primary`}
            href={!editMode && `${endpoints.filament}/${box.id}` || undefined}
        >
            <div className="flex items-center justify-between">
                <div className="flex gap-1 items-center">
                    <Archive />

                    <p>{box.name}</p>
                </div>

                {!editMode && <button
                    className="ml-2 p-1 rounded-full cursor-pointer transition-all bg-bg-light hover:bg-bg-lighter"
                >
                    <Dropdown>
                        <DropdownTrigger asChild>
                            <EllipsisVertical className="text-gray-500" />
                        </DropdownTrigger>
                        <DropdownContent>
                            <DropdownItem onClick={() => setOpenModal("edit")}>Edit</DropdownItem>
                            {/* <DropdownItem onClick={() => setOpenModal("qrcode")}>QR Code</DropdownItem> */}
                            <DropdownItem onClick={() => setOpenModal("delete")} danger>Delete</DropdownItem>
                        </DropdownContent>
                    </Dropdown>
                </button>}
            </div>
            <Subtext className="flex gap-1 items-center">
                <Shapes />
                {box.filamentIds.length} filament roll{box.filamentIds.length === 1 ? "" : "s"}
            </Subtext>
            <Subtext className="flex gap-1 items-center">
                <Weight />
                {grams(box.filamentIds.length ?
                    box.filamentIds.map(id => allFilament.find(f => f.id === id)?.currentMass ?? 0)
                        .reduce((curr, prev) => curr + prev) :
                    0)
                }
            </Subtext>

            <div className="flex gap-1 flex-wrap">
                {box.filamentIds.map(id => allFilament.find(f => f.id === id)).filter(Boolean)
                    .sort((a, b) => a!.index - b!.index)
                    .map(f => <div
                        key={f!.id}
                        className="w-[24px] h-[24px] rounded-sm drop-shadow-lg"
                        style={{ backgroundColor: f!.color }}
                    />)}
            </div>
        </a>

        <CreateBoxModal
            currentBox={box}
            onAdd={onEdit}
            open={openModal === "edit"}
            onClose={() => setOpenModal("")}
        />

        <Modal open={openModal === "delete"} onClose={() => setOpenModal("")} title="Delete Filament Box">
            <Subtext className="mb-2">Deletes this filament box.</Subtext>
            <Divider />
            <p className="w-full text-center">Are you sure you want to delete this filament box?</p>
            <p className="w-full text-center">This will not delete the filament inside.</p>
            <ModalFooter
                error={error}
            >
                <Button look={ButtonStyles.secondary} onClick={() => setOpenModal("")}>Cancel</Button>
                <Button look={ButtonStyles.danger} onClick={onDeleteConfirm} loading={loading} data-rybbit-event="delete-box">
                    Confirm
                </Button>
            </ModalFooter>
        </Modal>
    </>);
}
