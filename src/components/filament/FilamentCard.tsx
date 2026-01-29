"use client";

import { Filament } from "@/types/filament";
import FilamentIcon from "./FilamentIcon";
import Subtext from "../base/Subtext";
import Button from "../base/Button";
import { celcius, grams } from "@/lib/units";
import { Box, Diameter, EllipsisVertical, Thermometer, Weight } from "lucide-react";
import CardDetail from "../util/CardDetail";
import { useState } from "react";
import PrintFilamentModal from "../modals/PrintFilamentModal";
import { useRouter } from "next/navigation";
import { useDevice } from "@/lib/hooks";

export default function FilamentCard({ filament, noninteractable, className }:
    { filament: Filament, noninteractable?: boolean, className?: string }) {
    const [openModal, setOpenModal] = useState("");
    const [isMobile, _] = useDevice();

    const router = useRouter();

    return <><div
        className={`bg-bg-light rounded-lg pt-4 p-2 flex flex-col gap-1 justify-center items-center md:w-40 relative overflow-hidden
            border-2 border-transparent ${!noninteractable && "hover:border-primary cursor-pointer"} transition-colors unstyled 
            ${className}`}
        onClick={() => !noninteractable && router.push(`/app/filament/${filament.id}`)}
    >
        <div className="absolute top-0 left-0 right-0 w-full h-1 bg-bg-lighter">
            <div
                className="absolute h-full bg-primary rounded-full"
                style={{ width: `${filament.mass / filament.initialMass * 100}%` }}
            />
        </div>

        {!noninteractable && <button
            className={"absolute top-2 right-1 rounded-lg hover:bg-bg-lightest transition-colors p-1 cursor-pointer text-gray-400"}
            onClick={e => {
                e.stopPropagation();
            }}
        >
            <EllipsisVertical />
        </button>}

        <FilamentIcon filament={filament} size={isMobile ? 48 : 72} />

        <p className="line-clamp-1 text-md md:text-lg text-nowrap overflow-hidden font-bold text-center">{filament.name}</p>
        <Subtext>{filament.brand}</Subtext>

        <div className="flex flex-col text-gray-400 text-sm mb-2 items-center">
            <CardDetail><Weight size={20} /> {grams(filament.mass)}/{grams(filament.initialMass)}</CardDetail>
            <CardDetail><Box size={20} /> {filament.material}</CardDetail>
            {filament.nozzleTemperature &&
                <CardDetail><Thermometer size={20} /> {celcius(filament.nozzleTemperature)}</CardDetail>
            }
            {filament.diameter &&
                <CardDetail><Diameter size={20} /> {filament.diameter}mm</CardDetail>
            }
        </div>

        {!noninteractable && <Button className="w-full" onClick={e => {
            e.stopPropagation();
            setOpenModal("log");
        }}>Print</Button>}

    </div>

    <PrintFilamentModal open={openModal === "log"} onClose={() => setOpenModal("")} filament={filament} />
    </>;
}
