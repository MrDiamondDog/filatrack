"use client";

import { Box as BoxIcon, Clock, EllipsisVertical, Weight } from "lucide-react";
import FilamentIcon from "../icons/Filament";
import Subtext from "../Subtext";
import Button, { ButtonStyles } from "../Button";
import { useEffect, useState } from "react";
import Modal, { ModalFooter } from "../Modal";
import Divider from "../Divider";
import { Dropdown, DropdownContent, DropdownItem, DropdownTrigger } from "../Dropdown";
import LogFilamentModal from "./LogFilament";
import { toDateString } from "@/lib/date";
import { Box, Filament, UserSettings } from "@/db/types";
import { grams } from "@/lib/units";
import AddFilamentModal from "./AddFilament";
import { app } from "@/lib/db";
import QRCodeModal from "./QRCodeModal";
import FilamentDetailsModal from "./FilamentDetails";
import { useSearchParams } from "next/navigation";
import Input from "../Input";
import { handleApiError } from "@/lib/errors";
import MoveFilamentModal from "./MoveFilament";

type Props = {
    filament: Filament;

    isPreview?: boolean;
    noLog?: boolean;
    light?: boolean;

    userSettings?: UserSettings;

    allBoxes?: Box[];

    editMode?: boolean;
    selected?: boolean;
    onSelectedChange?: (selected: boolean) => void;

    onDelete?: () => void;
    onEdit?: (filament: Filament) => void;
    onAdd?: (newFilament: Filament) => void;
}

export default function FilamentEntry({
    filament,
    isPreview, noLog, light,
    userSettings,
    allBoxes,
    editMode, selected, onSelectedChange,
    onDelete, onEdit, onAdd,
}: Props) {
    const searchParams = useSearchParams();

    const [openModal, setOpenModal] = useState(filament.shortId !== null &&
        searchParams.get("f") === filament.shortId ? "details" : "");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (openModal === "") {
            setLoading(false);
            setError("");
        }
    }, [openModal]);

    async function onDeleteConfirm() {
        setLoading(true);

        const res = await app.filament.deleteFilament(filament.id);
        if (res.error) {
            setError(handleApiError(res.error));
            setLoading(false);
            return;
        }

        setLoading(false);
        setOpenModal("");
        onDelete?.();
    }

    return (<>
        <div
            className={`bg-bg-light rounded-lg p-2 flex flex-col gap-1 items-center drop-shadow-lg
            relative border-2 border-transparent transition-all md:max-w-[175px] md:min-w-[175px]
            ${(light) ? "bg-bg-lighter" : "hover:border-primary cursor-pointer "}`}
            onClick={() => {
                if (!isPreview)
                    setOpenModal("details");
            }}
            onMouseDown={() => {
                if (editMode)
                    onSelectedChange?.(!selected);
            }}
        >
            {editMode && <Input
                type="checkbox"
                className="absolute top-1 left-1 w-4 h-4 pointer-events-none"
                checked={selected}
                readOnly
            />}

            <div className="flex flex-col justify-center items-center w-full">
                <FilamentIcon
                    size={75}
                    filament={filament}
                />

                <p className="text-lg text-center truncate max-w-[100%]">{filament.name}</p>
                {filament.brand && <Subtext>{filament.brand}</Subtext>}
            </div>

            <div className="flex flex-col items-center w-full md:justify-center">
                <Subtext className="text-xs flex flex-row gap-1 items-center">
                    <Weight size={16} /> {grams(filament.currentMass)} / {grams(filament.startingMass)}
                </Subtext>
                <Subtext className="text-xs flex flex-row gap-1 items-center">
                    <BoxIcon size={16} /> {filament.material}
                </Subtext>
                <Subtext className="text-xs flex flex-row gap-1 items-center">
                    <Clock size={16} />
                    {filament.lastUsed.getTime() === 0 ? "Never" : toDateString(filament.lastUsed)}
                </Subtext>
            </div>
            {(!isPreview) && <div className="flex flex-row gap-1 w-full mt-auto">
                {!noLog && <Button
                    className="w-full mt-1"
                    onClick={e => {
                        e.stopPropagation();
                        setOpenModal("log");
                    }}
                    disabled={filament.currentMass <= 0}
                >
                    Log
                </Button>}
            </div>}

            {!isPreview && <button
                className="absolute top-1 right-1 p-1 rounded-full cursor-pointer transition-all bg-bg-light hover:bg-bg-lighter"
            >
                <Dropdown>
                    <DropdownTrigger asChild>
                        <EllipsisVertical className="text-gray-500" />
                    </DropdownTrigger>
                    <DropdownContent>
                        <DropdownItem onClick={() => setOpenModal("edit")}>Edit</DropdownItem>
                        {allBoxes && <DropdownItem onClick={() => setOpenModal("move")}>Move</DropdownItem>}
                        <DropdownItem onClick={() => {
                            app.filament.createFilament({ ...filament })
                                .then(res => (
                                    res.error ? handleApiError(res.error, "toast") :
                                        onAdd?.(res.data)
                                ));
                        }}>
                            Duplicate
                        </DropdownItem>
                        <DropdownItem onClick={() => setOpenModal("qrcode")}>QR Code</DropdownItem>
                        <DropdownItem onClick={() => setOpenModal("delete")} danger>Delete</DropdownItem>
                    </DropdownContent>
                </Dropdown>
            </button>}
        </div>

        {!isPreview && <>
            <FilamentDetailsModal
                open={openModal === "details"}
                onClose={() => openModal !== "log" && setOpenModal("")}
                filament={filament}
                openLogModal={() => setOpenModal("log")}
            />

            <LogFilamentModal
                open={openModal === "log"}
                onClose={() => setOpenModal("")}
                filament={filament}
                onFinish={f => onEdit?.(f)}
                userSettings={userSettings}
            />

            {userSettings && <AddFilamentModal
                open={openModal === "edit"}
                onClose={() => setOpenModal("")}
                currentFilament={filament}
                onAdd={f => onEdit?.(Array.isArray(f) ? f[0] : f)}
                userSettings={userSettings}
            />}

            <QRCodeModal
                open={openModal === "qrcode"}
                onClose={() => setOpenModal("")}
                filament={filament}
            />

            {allBoxes && <MoveFilamentModal
                open={openModal === "move"}
                onClose={() => setOpenModal("")}
                filament={[filament]}
                allBoxes={allBoxes}
                onMove={() => onDelete?.()}
            />}

            <Modal open={openModal === "delete"} onClose={() => setOpenModal("")} title="Delete Filament">
                <Subtext>Removes this filament from your library.</Subtext>
                <Divider />

                <p className="w-full text-center">Are you sure you want to delete this filament?</p>

                <div className="w-full flex justify-center items-center">
                    <FilamentEntry isPreview filament={filament} />
                </div>

                <p className="w-full text-center">This will also delete all of the logs made with this filament.</p>
                <p className="w-full text-center">Any QR codes you've made with this filament will also stop working.</p>

                <ModalFooter
                    tip={`Don't delete the filament if you just used it all up. 
                        Instead, press the 'Move to Empty' button in the filament's menu.`}
                    error={error}
                >
                    <Button look={ButtonStyles.secondary} onClick={() => setOpenModal("")}>Cancel</Button>
                    <Button look={ButtonStyles.danger} onClick={onDeleteConfirm} loading={loading} data-rybbit-event="delete-filament">
                        Confirm
                    </Button>
                </ModalFooter>
            </Modal>
        </>}
    </>);
}
