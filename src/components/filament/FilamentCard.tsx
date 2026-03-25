"use client";

import FilamentIcon from "./FilamentIcon";
import Subtext from "../base/Subtext";
import { celcius, grams } from "@/lib/util/units";
import { Archive, BedSingle, Box, ChevronRight, Diameter, EllipsisVertical, Thermometer, Weight } from "lucide-react";
import CardDetail from "../util/CardDetail";
import { useState } from "react";
import PrintFilamentModal from "../modals/PrintFilamentModal";
import { useDevice } from "@/lib/util/hooks";
import { FilamentRecord } from "@/types/pb";
import { Dropdown, DropdownContent, DropdownItem, DropdownSub, DropdownSubContent, DropdownSubTrigger, DropdownTrigger }
    from "../base/Dropdown";
import { DeleteModal } from "../modals/DeleteModal";
import FilamentMiniRow from "./FilamentMiniRow";
import { deleteFilament, moveFilament } from "@/lib/filament";
import { toast } from "sonner";
import Link from "next/link";
import { pb } from "@/api/pb";
import Spinner from "../base/Spinner";
import Button from "../base/Button";
import { StorageWithFilament } from "@/types/storage";
import CreateFilamentModal from "../modals/CreateFilamentModal";

type Props = {
    filament: FilamentRecord;
    storagesList: StorageWithFilament[];
    noninteractable?: boolean;
    className?: string;
    onModify?: (f: FilamentRecord) => void;
    onStoragesModify?: (s: StorageWithFilament[]) => void;
    onDelete?: () => void;
};

export default function FilamentCard({ filament, storagesList, noninteractable, className, onModify, onStoragesModify, onDelete }
: Props) {
    const user = pb.authStore.record;

    if (!user)
        return null;

    const [openModal, setOpenModal] = useState("");
    const [isMobile, _] = useDevice();

    return <>
        <div
            className={`bg-bg-light rounded-lg pt-4 p-2 border-2 border-transparent relative flex flex-col justify-between
                ${!noninteractable && "hover:border-primary cursor-pointer"} md:w-40 transition-colors overflow-hidden
            ${className}`}
        >
            <div className="absolute top-0 left-0 right-0 w-full h-1 bg-bg-lighter">
                <div
                    className="absolute h-full bg-primary rounded-full"
                    style={{ width: `${filament.mass / filament.initialMass * 100}%` }}
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
                        <DropdownSubTrigger asChild>
                            <DropdownItem
                                className="flex justify-between items-center pr-0"
                            >
                                Move <ChevronRight size={20} className="text-gray-500" />
                            </DropdownItem>
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
                    <DropdownItem onClick={() => setOpenModal("delete")} danger>Delete</DropdownItem>
                </DropdownContent>
            </Dropdown>}

            <Link href={`/app/filament/${filament.id}`} className={`unstyled flex flex-col gap-1 items-center h-full
                overflow-hidden w-full`}>
                <FilamentIcon filament={filament} size={isMobile ? 48 : 72} />

                <p className="text-md md:text-lg text-nowrap overflow-hidden font-bold text-center text-ellipsis w-full">
                    {filament.name}
                </p>
                <Subtext>{filament.brand}</Subtext>

                <div className="flex flex-col mb-2 items-center w-full *:justify-center">
                    <CardDetail icon={<Weight size={20} />}>{grams(filament.mass)}/{grams(filament.initialMass)}</CardDetail>
                    <CardDetail icon={<Box size={20} />}>{filament.material}</CardDetail>
                    {(filament.storage && storagesList && !!storagesList.length) &&
                        <CardDetail icon={<Archive size={20} />}>
                            {storagesList.find(s => s.id === filament.storage)?.name!}
                        </CardDetail>}
                    {!!filament.nozzleTemperature &&
                        <CardDetail icon={<Thermometer size={20} />}>{celcius(filament.nozzleTemperature)}</CardDetail>}
                    {!!filament.bedTemperature &&
                        <CardDetail icon={<BedSingle size={20} />}>{celcius(filament.bedTemperature)}</CardDetail>}
                    {!!filament.diameter &&
                        <CardDetail icon={<Diameter size={20} /> }>{filament.diameter}mm</CardDetail>}
                </div>
            </Link>

            {!noninteractable && <Button className="w-full" onClick={e => {
                e.stopPropagation();
                setOpenModal("log");
            }}>Print</Button>}
        </div>

        <PrintFilamentModal
            open={openModal === "log"}
            onClose={() => setOpenModal("")}
            filament={filament}
            onPrintCreate={p => onModify?.({ ...filament, mass: filament.mass - p.totalFilamentUsed })}
        />

        <DeleteModal
            open={openModal === "delete"}
            onClose={() => setOpenModal("")}
            object="Filament"
            preview={<div className="bg-bg-lighter rounded-lg p-2"><FilamentMiniRow filament={filament} /></div>}
            onDelete={() => {
                deleteFilament(filament).catch(e => toast.error("Failed to delete filament", { description: e.message }));
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
