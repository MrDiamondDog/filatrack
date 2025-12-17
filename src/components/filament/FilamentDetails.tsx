import { Filament } from "@/db/types";
import Modal, { ModalProps } from "../Modal";
import FilamentEntry from "./Filament";
import Subtext from "../Subtext";
import Divider from "../Divider";
import FilamentHistoryList from "./FilamentHistory";
import Button from "../Button";
import { Diameter, DollarSign, Text, Thermometer } from "lucide-react";

export default function FilamentDetailsModal({ filament, openLogModal, ...props }:
    { filament: Filament, openLogModal?: () => void } & ModalProps) {
    return (
        <Modal {...props} title="Filament Details">
            <Subtext>View extra details and usage of this filament.</Subtext>
            <Divider />

            <div className="flex flex-col md:flex-row max-w-[500px]">
                <div>
                    <FilamentEntry
                        isPreview
                        filament={filament}
                        light
                    />
                    {!!filament.note && <div className="flex flex-row gap-1 items-center mt-1 text-sm a-hide">
                        <Text className="min-w-[24px]" />
                        {filament.note}
                    </div>}
                    {!!filament.printingTemperature && <div className="flex flex-row gap-1 items-center mt-1 text-sm">
                        <Thermometer className="min-w-[24px]" />
                        {filament.printingTemperature}°C
                    </div>}
                    {!!filament.diameter && <div className="flex flex-row gap-1 items-center mt-1 text-sm">
                        <Diameter className="min-w-[24px]" />
                        {filament.diameter}mm
                    </div>}
                    {!!filament.cost && <div className="flex flex-row gap-1 items-center mt-1 text-sm">
                        <DollarSign className="min-w-[24px]" />
                        ${filament.cost}
                    </div>}
                </div>
                <Divider vertical className="hidden md:block" />
                <Divider className="block md:hidden" />
                <div className="max-h-[150px] md:max-h-[250px] min-w-[250px] overflow-y-scroll overflow-x-hidden">
                    <FilamentHistoryList filament={filament} />
                </div>
            </div>

            {!!openLogModal && <>
                <Divider />

                <Button className="w-full" onClick={openLogModal}>Log</Button>
            </>}
        </Modal>
    );
}
