"use client";

import FilamentCard from "./FilamentCard";
import Divider from "../base/Divider";
import Tablist from "../base/tabs/Tablist";
import { useState } from "react";
import { Images, Pencil, Plus, TableIcon, Trash2, X } from "lucide-react";
import Table, { EmptyCell } from "../base/Table";
import { sortFn as colorSort } from "color-sorter";
import { grams } from "@/lib/util/units";
import { FilamentRecord } from "@/types/pb";
import Button, { ButtonStyles } from "../base/Button";
import CreateFilamentModal from "../modals/CreateFilamentModal";
import { pb } from "@/api/pb";
import { StorageWithFilament } from "@/types/storage";
import { deleteFromArray, modifyArrayItem } from "@/lib/util/array";
import { startHolyLoader } from "holy-loader";
import { useRouter } from "next/navigation";
import Checkbox from "../base/Checkbox";
import { DeleteModal } from "../modals/DeleteModal";
import { toastError } from "@/lib/util/error";
import { randomFilament } from "@/lib/util/random";

type Props = {
    filament: FilamentRecord[];
    storagesList: StorageWithFilament[];
    title?: string;
    viewLock?: "cards" | "table";
    allowAdd?: boolean;
    allowEdit?: boolean;
    onListModified?: (l: FilamentRecord[]) => void;
    onStoragesModified?: (s: StorageWithFilament[]) => void;
};

export default function FilamentList({
    filament,
    storagesList,
    title,
    viewLock,
    allowAdd,
    allowEdit,
    onListModified,
    onStoragesModified,
}
: Props) {
    const user = pb.authStore.record;

    if (!user)
        return null;

    const [view, setView] = useState<"cards" | "table">(viewLock ?? "cards");
    const [editMode, setEditMode] = useState(false);

    const [selectedFilament, setSelectedFilament] = useState<FilamentRecord[]>([]);

    const [openModal, setOpenModal] = useState("");

    const router = useRouter();

    async function deleteSelected() {
        await Promise.all(selectedFilament.map(filament => pb.collection("filament").delete(filament.id)))
            .then(() => onListModified?.(filament.filter(f => !selectedFilament.includes(f))))
            .catch(e => toastError("Could not delete one or more filament", e));
    }

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

                    {allowEdit && <Button onClick={() => {
                        setView("table");
                        setEditMode(m => !m);
                    }} look={ButtonStyles.secondary}>
                        {editMode ? <X /> : <Pencil />}
                    </Button>}

                    {editMode && <Button look={ButtonStyles.danger} onClick={() => setOpenModal("deleteSelected")}
                        disabled={selectedFilament.length === 0}>
                        <Trash2 />
                    </Button>}

                    {(allowAdd && !editMode) && <Button onClick={() => setOpenModal("create")}>
                        <Plus />
                    </Button>}
                </div>
            </div>
            <Divider />
        </>}

        {view === "cards" && <div className="grid grid-cols-2 md:flex flex-row flex-wrap w-full gap-2 mb-2">
            {filament.map(f => <FilamentCard
                filament={f}
                key={f.id}
                storagesList={storagesList}
                onModify={f => onListModified?.(modifyArrayItem(filament, f, "id"))}
                onStoragesModify={onStoragesModified}
                onDelete={() => onListModified?.(deleteFromArray(filament, f, "id"))}
            />)}
        </div>}

        {view === "table" &&
            <Table
                columns={[
                    (editMode ? {
                        label: <Checkbox
                            checked={selectedFilament.length === filament.length}
                            onCheckedChange={checked => setSelectedFilament(checked ? [...filament] : [])}
                        />,
                        render: row => <Checkbox
                            checked={!!selectedFilament.find(f => f.id === row.id)}
                            onCheckedChange={checked => setSelectedFilament(checked ?
                                [...selectedFilament, row] :
                                deleteFromArray(selectedFilament, row, "id"))}
                        />,
                    } : null),
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
                    {
                        label: "Nozzle Temp.", key: "nozzleTemperature",
                        render: data => (data.nozzleTemperature ? `${data.nozzleTemperature}°C` : <EmptyCell />),
                    },
                    {
                        label: "Diameter", key: "diameter",
                        render: data => (data.diameter ? `${data.diameter}mm` : <EmptyCell />),
                    },
                ]}
                data={filament}
                rowClassName="cursor-pointer hover:bg-bg-lighter transition-colors"
                sort="name"
                sortType="desc"
                onRowClick={row => {
                    if (editMode) {
                        const isSelected = selectedFilament.includes(row);
                        setSelectedFilament(isSelected ? deleteFromArray(selectedFilament, row, "id") : [...selectedFilament, row]);
                        return;
                    }
                    startHolyLoader();
                    router.push(`/app/filament/${row.id}`);
                }}
            />
        }

        {/* For testing, change to true to enable */}
        {false && <Button onClick={() => {
            const f = randomFilament();
            pb.collection("filament").create({ ...f, user: user!.id })
                .then(res => onListModified?.([...filament, res]))
                .catch(e => toastError("", e));
        }}>Add Random</Button>}

        <CreateFilamentModal open={openModal === "create"} onClose={() => setOpenModal("")}
            onCreate={f => onListModified?.([...filament, f])} storages={storagesList}
        />

        <DeleteModal
            open={openModal === "deleteSelected"}
            onClose={() => setOpenModal("")}
            object={`${selectedFilament.length} filament`}
            plural
            preview={" "}
            onDelete={() => {
                deleteSelected();
                setOpenModal("");
            }}
        />
    </>;
}
