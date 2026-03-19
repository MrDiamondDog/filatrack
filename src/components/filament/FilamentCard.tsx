"use client";

import FilamentIcon from "./FilamentIcon";
import Subtext from "../base/Subtext";
import Button from "../base/Button";
import { celcius, grams } from "@/lib/util/units";
import { Archive, Box, ChevronRight, Diameter, EllipsisVertical, Thermometer, Weight } from "lucide-react";
import CardDetail from "../util/CardDetail";
import { useState } from "react";
import PrintFilamentModal from "../modals/PrintFilamentModal";
import { useDevice } from "@/lib/util/hooks";
import { FilamentRecord, StorageRecord } from "@/types/pb";
import { Dropdown, DropdownContent, DropdownItem, DropdownSub, DropdownSubContent, DropdownSubTrigger, DropdownTrigger }
    from "../base/Dropdown";
import { DeleteModal } from "../modals/DeleteModal";
import FilamentMiniRow from "./FilamentMiniRow";
import { deleteFilament } from "@/lib/filament";
import { toast } from "sonner";
import Link from "next/link";
import { pb } from "@/api/pb";
import Spinner from "../base/Spinner";

export default function FilamentCard({ filament, storagesList, noninteractable, className, onModify, onDelete }:
    { filament: FilamentRecord, storagesList: StorageRecord[], noninteractable?: boolean, className?: string,
        onModify?: (f: FilamentRecord) => void, onDelete?: () => void
}) {
    const user = pb.authStore.record;

    if (!user)
        return null;

    const [openModal, setOpenModal] = useState("");
    const [isMobile, _] = useDevice();

    async function move(destination: StorageRecord) {
        if (destination.id === filament.storage) {
            // remove it from storage
            await Promise.all([
                pb.collection("storage").update(destination.id, {
                    "filament-": filament.id,
                }),
                pb.collection("filament").update(filament.id, {
                    storage: null,
                }),
            ])
                .then(([storage, filament]) => onModify?.(filament))
                .catch(e => toast.error("Could not move filament", { description: e.message }));
            return;
        }

        await Promise.all([
            pb.collection("storage").update(destination.id, {
                "filament+": filament.id,
            }),
            pb.collection("filament").update(filament.id, {
                storage: destination.id,
            }),
            (filament.storage && pb.collection("storage").update(filament.storage, {
                "filament-": filament.id,
            })),
        ])
            .then(([storage, filament]) => onModify?.(filament))
            .catch(e => toast.error("Could not move filament", { description: e.message }));
    }

    return <>
        <Link
            className={`bg-bg-light rounded-lg pt-4 p-2 flex flex-col gap-1 justify-center items-center md:w-40 relative 
                overflow-hidden border-2 border-transparent ${!noninteractable && "hover:border-primary cursor-pointer"} 
                transition-colors unstyled 
            ${className}`}
            href={`/app/filament/${filament.id}`}
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
                                onClick={e => {
                                    e.preventDefault();
                                    move(s);
                                }}
                                selected={filament.storage === s.id}
                            >
                                {s.name}
                            </DropdownItem>)}
                            {!storagesList && <Spinner />}
                        </DropdownSubContent>
                    </DropdownSub>
                    <DropdownItem onClick={() => setOpenModal("delete")} danger>Delete</DropdownItem>
                </DropdownContent>
            </Dropdown>}

            <FilamentIcon filament={filament} size={isMobile ? 48 : 72} />

            <p className="line-clamp-1 text-md md:text-lg text-nowrap overflow-hidden font-bold text-center">{filament.name}</p>
            <Subtext>{filament.brand}</Subtext>

            <div className="flex flex-col text-gray-400 text-sm mb-2 items-center">
                <CardDetail><Weight size={20} /> {grams(filament.mass)}/{grams(filament.initialMass)}</CardDetail>
                <CardDetail><Box size={20} /> {filament.material}</CardDetail>
                {!!filament.nozzleTemperature &&
                <CardDetail><Thermometer size={20} /> {celcius(filament.nozzleTemperature)}</CardDetail>
                }
                {!!filament.diameter &&
                <CardDetail><Diameter size={20} /> {filament.diameter}mm</CardDetail>
                }
                {(filament.storage && storagesList && !!storagesList.length) &&
                <CardDetail><Archive size={20} /> {storagesList.find(s => s.id === filament.storage)?.name}</CardDetail>
                }
            </div>

            {!noninteractable && <Button className="w-full mt-auto" onClick={e => {
                e.stopPropagation();
                setOpenModal("log");
            }}>Print</Button>}

        </Link>

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
    </>;
}
