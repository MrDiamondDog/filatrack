"use client";

import FilamentCard from "./FilamentCard";
import Divider from "../base/Divider";
import Tablist from "../base/tabs/Tablist";
import { useState } from "react";
import { Images, Plus, TableIcon } from "lucide-react";
import Table from "../base/Table";
import { sortFn as colorSort } from "color-sorter";
import { grams } from "@/lib/util/units";
import { FilamentRecord, StorageRecord } from "@/types/pb";
import Button from "../base/Button";
import CreateFilamentModal from "../modals/CreateFilamentModal";
import { pb } from "@/api/pb";

export default function FilamentList({ filament, storagesList, title, viewLock, allowAdd, onListModified }:
    { filament: FilamentRecord[], storagesList: StorageRecord[], title?: string, viewLock?: "cards" | "table",
        allowAdd?: boolean, onListModified?: (l: FilamentRecord[]) => void
}) {
    const user = pb.authStore.record;

    if (!user)
        return null;

    const [view, setView] = useState<"cards" | "table">(viewLock ?? "cards");

    const [openModal, setOpenModal] = useState("");

    return <>
        {title && <>
            <div className="flex justify-between items-center">
                <h2>{title}</h2>

                <div className="flex gap-2 items-center">
                    {!viewLock && <Tablist
                        tabs={{ cards: <Images />, table: <TableIcon /> }}
                        activeTab={view}
                        onTabChange={v => setView(v as "cards" | "table")}
                    />}

                    {allowAdd && <Button onClick={() => setOpenModal("create")}><Plus /></Button>}
                </div>
            </div>
            <Divider />
        </>}

        {view === "cards" && <div className="grid grid-cols-2 md:flex flex-row flex-wrap w-full gap-2 mb-2">
            {filament.map(f => <FilamentCard
                filament={f}
                key={f.id}
                storagesList={storagesList}
                onModify={f => onListModified?.([
                    ...filament.slice(0, filament.findIndex(lf => lf.id === f.id)),
                    f,
                    ...filament.slice(filament.findIndex(lf => lf.id === f.id) + 1),
                ])}
                onDelete={() => onListModified?.([...filament.filter(fil => fil.id !== f.id)])}
            />)}
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
                    { label: "Temp.", key: "nozzleTemperature", render: data => `${data.nozzleTemperature}°C` },
                    { label: "Diameter", key: "diameter", render: data => `${data.diameter}mm` },
                ]}
                data={filament}
            />
        }

        <CreateFilamentModal open={openModal === "create"} onClose={() => setOpenModal("")}
            onCreate={f => onListModified?.([...filament, f])}
        />
    </>;
}
