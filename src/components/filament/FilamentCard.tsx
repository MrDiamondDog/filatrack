"use client";

import FilamentIcon from "./FilamentIcon";
import Subtext from "../base/Subtext";
import { Archive, ChevronRight, EllipsisVertical } from "lucide-react";
import CardDetail from "../util/CardDetail";
import { useState } from "react";
import PrintFilamentModal from "../modals/PrintFilamentModal";
import { useDevice } from "@/lib/util/hooks";
import { FilamentRecord, UsersRecord } from "@/types/pb";
import { Dropdown, DropdownContent, DropdownItem, DropdownSub, DropdownSubContent, DropdownSubTrigger, DropdownTrigger }
    from "../base/Dropdown";
import { DeleteModal } from "../modals/DeleteModal";
import FilamentMiniRow from "./FilamentMiniRow";
import { moveFilament } from "@/lib/filament";
import Link from "next/link";
import Spinner from "../base/Spinner";
import Button from "../base/Button";
import { StorageWithFilament } from "@/types/storage";
import CreateFilamentModal from "../modals/CreateFilamentModal";
import { pb } from "@/api/pb";
import PrintFilamentQRModal from "../modals/PrintFilamentQRModal";
import { toastError } from "@/lib/util/error";
import { getFilamentCardKey } from "@/lib/filamentKeys";

type Props = {
    filament: FilamentRecord;
    storagesList: StorageWithFilament[];
    noninteractable?: boolean;
    keys?: string[];
    className?: string;
    onModify?: (f: FilamentRecord) => void;
    onStoragesModify?: (s: StorageWithFilament[]) => void;
    onDelete?: () => void;
    onDuplicate?: (f: FilamentRecord) => void;
};

export default function FilamentCard({
    filament,
    storagesList,
    noninteractable,
    keys,
    className,
    onModify,
    onStoragesModify,
    onDelete,
    onDuplicate,
}
: Props) {
    const user = pb.authStore.record as UsersRecord | null;

    const [openModal, setOpenModal] = useState("");
    const [isMobile, _] = useDevice();

    async function duplicate() {
        pb.collection("filament").create({ ...filament, id: undefined, prints: [] })
            .then(onDuplicate)
            .catch(e => toastError("Could not duplicate filament", e));
    }

    return <>
        <div
            className={`bg-bg-light rounded-lg pt-4 p-2 border-2 border-transparent relative flex flex-col justify-between
                ${!noninteractable && "hover:border-primary cursor-pointer"} md:w-40 transition-colors overflow-hidden
            ${className}`}
        >
            <div className="absolute top-0 left-0 right-0 w-full h-1 bg-bg-lighter">
                <div
                    className="absolute h-full bg-primary rounded-full"
                    style={{ width: `${(filament.mass ?? 0) / filament.initialMass * 100}%` }}
                />
            </div>

            {!noninteractable && <Dropdown>
                <DropdownTrigger asChild>
                    <button
                        className={`absolute top-2 right-1 rounded-lg hover:bg-bg-lightest transition-colors 
                        p-1 cursor-pointer text-gray-400`}
                    ><EllipsisVertical /></button>
                </DropdownTrigger>
                <DropdownContent>
                    <DropdownItem onClick={() => setOpenModal("edit")}>Edit</DropdownItem>
                    <DropdownSub>
                        <DropdownSubTrigger>
                            <div className="flex justify-between items-center pr-0">
                                Move <ChevronRight size={20} className="text-gray-500" />
                            </div>
                        </DropdownSubTrigger>
                        <DropdownSubContent>
                            {storagesList && storagesList.map(s => <DropdownItem
                                key={s.id}
                                onClick={async e => {
                                    e.preventDefault();
                                    const res = await moveFilament(filament, s.id, storagesList);
                                    if (!res)
                                        return;
                                    onStoragesModify?.(res.newStorages);
                                    onModify?.(res.newFilament);
                                }}
                                className="flex items-center gap-1"
                                selected={filament.storage === s.id}
                                disabled={!!s.capacity && ((s.filament?.length ?? 0) >= s.capacity) && filament.storage !== s.id}
                            >
                                {s.name}
                                {!!s.capacity && <Subtext>{s.filament?.length ?? 0}/{s.capacity}</Subtext>}
                            </DropdownItem>)}
                            {!storagesList && <Spinner />}
                        </DropdownSubContent>
                    </DropdownSub>
                    <DropdownItem onClick={duplicate}>Duplicate</DropdownItem>
                    <DropdownItem onClick={() => setOpenModal("qr")}>QR Code</DropdownItem>
                    <DropdownItem onClick={() => setOpenModal("delete")} danger>Delete</DropdownItem>
                </DropdownContent>
            </Dropdown>}

            <Link href={`/app/filament/${filament.id}`} className={`unstyled flex flex-col gap-1 items-center h-full
                overflow-hidden w-full`}>
                <FilamentIcon filament={filament} size={isMobile ? 48 : 72} />

                <p className="text-md md:text-lg text-nowrap overflow-hidden font-bold text-center text-ellipsis w-full">
                    {filament.name}
                </p>
                {user?.advancedView && <p className="text-xs text-gray-500">{filament.id}</p>}

                <div className="flex flex-col mb-2 md:gap-0 gap-1 items-center w-full *:justify-center">
                    {(
                        filament.storage && storagesList && !!storagesList.length &&
                        ((user?.shownFilamentCardKeys as string[]) ?? []).includes("storage")
                    ) &&
                        <CardDetail icon={<Archive size={20} />}>
                            {storagesList.find(s => s.id === filament.storage)?.name!}
                        </CardDetail>
                    }

                    {((user?.shownFilamentCardKeys as string[]) ?? keys ?? []).map(key => {
                        const keyData = getFilamentCardKey(key);
                        if (!keyData || keyData.customRender)
                            return null;
                        // Return null if there is no data to display
                        if ((keyData.render && !keyData.render(filament)) || (!filament[key as keyof FilamentRecord]))
                            return null;
                        return <CardDetail icon={keyData.icon} key={key}>
                            {keyData.render ?
                                (keyData.render(filament)!) :
                                (`${filament[key as keyof FilamentRecord]}`)
                            }
                        </CardDetail>;
                    })}
                </div>
            </Link>

            {!noninteractable && <Button className="w-full" onClick={e => {
                e.stopPropagation();
                setOpenModal("log");
            }} disabled={(filament.mass ?? 0) <= 0}>Print</Button>}
        </div>

        <PrintFilamentModal
            open={openModal === "log"}
            onClose={() => setOpenModal("")}
            filament={filament}
            onPrintCreate={p => onModify?.({ ...filament, mass: (filament.mass ?? 0) - p.totalFilamentUsed })}
        />

        <PrintFilamentQRModal
            open={openModal === "qr"}
            onClose={() => setOpenModal("")}
            filament={[filament]}
        />

        <DeleteModal
            open={openModal === "delete"}
            onClose={() => setOpenModal("")}
            object="Filament"
            preview={<div className="bg-bg-lighter rounded-lg p-2"><FilamentMiniRow filament={filament} /></div>}
            onDelete={() => {
                pb.collection("filament").delete(filament.id)
                    .catch(e => toastError("Could not delete filament", e));
                onDelete?.();
                setOpenModal("");
            }}
        />

        <CreateFilamentModal
            open={openModal === "edit"}
            onClose={() => setOpenModal("")}
            onCreate={f => onModify?.(f)}
            initial={filament}
            storages={storagesList}
        />
    </>;
}
