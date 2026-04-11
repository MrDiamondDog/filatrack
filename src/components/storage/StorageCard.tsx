import { Archive, Box, CirclePile, EllipsisVertical, Weight } from "lucide-react";
import CardDetail from "../util/CardDetail";
import { grams } from "@/lib/util/units";
import Link from "next/link";
import { Dropdown, DropdownTrigger, DropdownContent, DropdownItem } from "../base/Dropdown";
import { useEffect, useState } from "react";
import { DeleteModal } from "../modals/DeleteModal";
import { pb } from "@/api/pb";
import { toastError } from "@/lib/util/error";
import { StorageWithFilament } from "@/types/storage";
import CreateStorageModal from "../modals/CreateStorageModal";

type Props = {
    storage: StorageWithFilament;
    noninteractable?: boolean;
    onDelete?: () => void;
    onModify?: (s: StorageWithFilament) => void;
};

export default function StorageCard({ storage, noninteractable, onDelete, onModify }: Props) {
    const [filament, setFilament] = useState(storage.expand?.filament ?? []);

    const totalMass = filament.reduce((prev, curr) => prev + (curr.mass ?? 0), 0);
    const totalInitialMass = filament.reduce((prev, curr) => prev + curr.initialMass, 0);

    const [openModal, setOpenModal] = useState("");

    useEffect(() => {
        setFilament(storage.expand?.filament ?? []);
    }, [storage]);

    async function deleteStorage() {
        await pb.collection("storage").delete(storage.id)
            .then(() => {
                setOpenModal("");
                onDelete?.();
            })
            .catch(e => toastError("Could not delete storage", e));
    }

    return <>
        <Link
            className={`unstyled bg-bg-light p-2 rounded-lg min-w-50 transition-colors overflow-hidden
                    border-2 border-transparent relative block
                ${!noninteractable && "hover:border-primary cursor-pointer"}`}
            href={!noninteractable ? `/app/storage/${storage.id}` : ""}
        >
            {!noninteractable && <div className="absolute top-0 left-0 right-0 w-full h-1 bg-bg-lighter">
                <div className="absolute h-full bg-primary" style={{ width: `${totalMass / totalInitialMass * 100}%` }} />
            </div>}

            {!noninteractable && <Dropdown>
                <DropdownTrigger asChild>
                    <button
                        className={`absolute top-2 right-1 rounded-lg hover:bg-bg-lightest transition-colors 
                                p-1 cursor-pointer text-gray-400`}
                    ><EllipsisVertical /></button>
                </DropdownTrigger>
                <DropdownContent>
                    <DropdownItem onClick={() => setOpenModal("edit")}>Edit</DropdownItem>
                    <DropdownItem onClick={() => setOpenModal("delete")} danger>Delete</DropdownItem>
                </DropdownContent>
            </Dropdown>}

            <div className="flex gap-2 items-center mr-6">
                <Archive size={24} />
                <h3 className="text-nowrap text-ellipsis overflow-hidden">{storage.name}</h3>
            </div>
            <div className="flex flex-col mb-2 items-baseline w-full">
                <CardDetail icon={<CirclePile size={20} />}>
                    {filament.length}
                    {!!storage.capacity && `/${storage.capacity}`}{" "}
                        filament roll{filament.length === 1 && !storage.capacity ? "" : "s"}
                </CardDetail>
                <CardDetail icon={<Box size={20} />}>
                    {!filament.length ? "None" : [...new Set(filament.map(f => f.material))].join(", ")}
                </CardDetail>
                <CardDetail icon={<Weight size={20} />}>
                    {grams(totalMass)}/{grams(totalInitialMass)}
                </CardDetail>
            </div>

            <div className="w-full flex gap-1 flex-wrap mt-2">
                {filament.map(f => <div className="w-5 h-5 rounded-sm" style={{ backgroundColor: f.color }} key={f.id} />)}
                {/* {filament.map(f => <FilamentIcon filament={f} size={32} />)} */}
            </div>
        </Link>

        <CreateStorageModal
            open={openModal === "edit"}
            onClose={() => setOpenModal("")}
            initial={storage}
            onModify={onModify}
        />

        <DeleteModal open={openModal === "delete"} onClose={() => setOpenModal("")}
            preview={<StorageCard storage={storage} noninteractable />} object="storage" onDelete={deleteStorage}
        />
    </>;
}
