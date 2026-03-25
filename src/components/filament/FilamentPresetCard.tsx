import { grams, celcius } from "@/lib/util/units";
import { FilamentPresetsRecord } from "@/types/pb";
import { Weight, Box, Thermometer, Diameter, BedSingle, EllipsisVertical } from "lucide-react";
import CardDetail from "../util/CardDetail";
import Subtext from "../base/Subtext";
import { Dropdown, DropdownContent, DropdownItem, DropdownTrigger } from "../base/Dropdown";
import { useState } from "react";
import CreateFilamentPresetModal from "../modals/CreateFilamentPresetModal";
import { DeleteModal } from "../modals/DeleteModal";
import { pb } from "@/api/pb";

type Props = {
    preset: FilamentPresetsRecord;
    noninteractable?: boolean;
    onModify?: (p: FilamentPresetsRecord) => void;
    onDelete?: () => void;
};

export default function FilamentPresetCard({ preset, noninteractable, onModify, onDelete }: Props) {
    const [openModal, setOpenModal] = useState("");

    return <>
        <div
            className={`bg-bg-light rounded-lg p-2 flex flex-col overflow-hidden w-fit relative pr-10 
                ${noninteractable && "bg-bg-lighter"}`}
        >
            {!noninteractable && <Dropdown>
                <DropdownTrigger asChild>
                    <button className={`absolute top-2 right-2 rounded-lg hover:bg-bg-lightest transition-colors p-1 cursor-pointer
                    text-gray-500`}>
                        <EllipsisVertical />
                    </button>
                </DropdownTrigger>
                <DropdownContent>
                    <DropdownItem onClick={() => setOpenModal("edit")}>Edit</DropdownItem>
                    <DropdownItem onClick={() => setOpenModal("delete")} danger>Delete</DropdownItem>
                </DropdownContent>
            </Dropdown>}

            <p className="text-lg font-bold">{preset.name}</p>
            <Subtext>{preset.brand}</Subtext>
            {!!preset.initialMass && <CardDetail icon={<Weight size={20} />}>{grams(preset.initialMass)}</CardDetail>}
            {!!preset.material && <CardDetail icon={<Box size={20} />}>{preset.material}</CardDetail>}
            {!!preset.nozzleTemperature &&
                <CardDetail icon={<Thermometer size={20} />}>{celcius(preset.nozzleTemperature)}</CardDetail>}
            {!!preset.bedTemperature &&
                <CardDetail icon={<BedSingle size={20} />}>{celcius(preset.bedTemperature)}</CardDetail>}
            {!!preset.diameter &&
                <CardDetail icon={<Diameter size={20} /> }>{preset.diameter}mm</CardDetail>}
        </div>

        <CreateFilamentPresetModal
            open={openModal === "edit"}
            onClose={() => setOpenModal("")}
            initial={preset}
            onCreate={p => onModify?.(p)}
        />

        <DeleteModal
            open={openModal === "delete"}
            onClose={() => setOpenModal("")}
            object="preset"
            preview={<FilamentPresetCard preset={preset} noninteractable />}
            onDelete={() => {
                pb.collection("filamentPresets").delete(preset.id);
                onDelete?.();
                setOpenModal("");
            }}
        />
    </>;
}
