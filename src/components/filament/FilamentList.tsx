"use client";

import { Filament } from "@/types/filament";
import FilamentCard from "./FilamentCard";
import Divider from "../base/Divider";
import Tablist from "../base/tabs/Tablist";
import { useState } from "react";
import { Images, TableIcon } from "lucide-react";
import Table from "../base/Table";
import { sortFn as colorSort } from "color-sorter";
import { grams } from "@/lib/util/units";

export default function FilamentList({ filament, title, viewLock }:
    { filament: Filament[], title?: string, viewLock?: "cards" | "table" }) {
    const [view, setView] = useState<"cards" | "table">(viewLock ?? "cards");

    return <>
        {title && <>
            <div className="flex justify-between items-center">
                <h2>{title}</h2>

                {!viewLock && <Tablist
                    tabs={{ cards: <Images />, table: <TableIcon /> }}
                    activeTab={view}
                    onTabChange={v => setView(v as "cards" | "table")}
                />}
            </div>
            <Divider />
        </>}

        {view === "cards" && <div className="grid grid-cols-2 md:flex flex-row flex-wrap w-full gap-2 mb-2">
            {filament.map(f => <FilamentCard filament={f} key={f.id} />)}
        </div>}

        {view === "table" &&
            <Table
                columns={[
                    { label: "Name", key: "name" },
                    {
                        label: "Color", key: "color",
                        render: data => <div style={{ backgroundColor: data.color }} className="p-2 rounded-lg w-full h-full" />,
                        sort: (a, b) => colorSort(a as string, b as string),
                    },
                    { label: "Mass", key: "mass", render: data => grams(data.mass) },
                    { label: "Initial Mass", key: "initialMass", render: data => grams(data.initialMass) },
                    { label: "Material", key: "material" },
                    { label: "Brand", key: "brand" },
                    { label: "Temp.", key: "temperature", render: data => `${data.nozzleTemperature}°C` },
                    { label: "Diameter", key: "diameter", render: data => `${data.diameter}mm` },
                ]}
                data={filament}
            />
        }
    </>;
}
