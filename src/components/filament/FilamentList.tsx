"use client";

import FilamentCard from "./FilamentCard";
import Divider from "../base/Divider";
import Tablist from "../base/tabs/Tablist";
import { useEffect, useState } from "react";
import { ArchiveRestore, Images, Pencil, Plus, QrCode, Search, SortDesc, TableIcon, Trash2, X } from "lucide-react";
import Table, { EmptyCell } from "../base/Table";
import { sortFn as colorSort } from "color-sorter";
import { FilamentPresetsRecord, FilamentRecord, UsersRecord } from "@/types/pb";
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
import Input from "../base/Input";
import { Select } from "../base/Select";
import { Dropdown, DropdownContent, DropdownItem, DropdownTrigger } from "../base/Dropdown";
import StorageMiniCard from "../storage/StorageMiniCard";
import { moveFilament } from "@/lib/filament";
import PrintFilamentQRModal from "../modals/PrintFilamentQRModal";
import { getFilamentTableKey } from "@/lib/filamentKeys";
import { useDevice } from "@/lib/util/hooks";

type Props = {
    filament: FilamentRecord[];
    storagesList: StorageWithFilament[];
    presets?: FilamentPresetsRecord[];
    title?: string;
    viewLock?: "card" | "table";
    allowAdd?: boolean;
    allowEdit?: boolean;
    allowSort?: boolean;
    onListModified?: (l: FilamentRecord[]) => void;
    onStoragesModified?: (s: StorageWithFilament[]) => void;
};

export default function FilamentList({
    filament,
    storagesList,
    presets,
    title,
    viewLock,
    allowAdd,
    allowEdit,
    allowSort,
    onListModified,
    onStoragesModified,
} : Props) {
    const user = pb.authStore.record as UsersRecord | null;

    if (!user)
        return null;

    const [isMobile, _] = useDevice();

    // Set to view lock, fallback to user's default view, fallback to card view if neither are set
    const [view, setView] = useState<"card" | "table">((viewLock ?? user.defaultView) || "card");
    const [editMode, setEditMode] = useState(false);

    const [selectedFilament, setSelectedFilament] = useState<FilamentRecord[]>([]);

    const [displayedFilament, setDisplayedFilament] = useState<FilamentRecord[]>([]);
    const [sortKey, setSortKey] = useState<keyof FilamentRecord>(user.filamentSort ?? "name");
    const [search, setSearch] = useState("");

    const [openModal, setOpenModal] = useState("");

    const router = useRouter();

    async function deleteSelected() {
        await Promise.all(selectedFilament.map(filament => pb.collection("filament").delete(filament.id)))
            .then(() => onListModified?.(filament.filter(f => !selectedFilament.includes(f))))
            .catch(e => toastError("Could not delete one or more filament", e));
    }

    async function moveSelected(destination: string) {
        await new Promise<void>(async(resolve, reject) => {
            for (const f of selectedFilament)
                await moveFilament(f, destination, storagesList)
                    .catch(reject);
            resolve();
        })
            .then(() => {
                pb.collection("filament").getFullList({
                    filter: `user.id = "${user!.id}"`,
                })
                    .then(onListModified)
                    .catch(e => toastError("Could not fetch filament", e));

                pb.collection("storage").getFullList<StorageWithFilament>({
                    filter: `user.id = "${user!.id}"`,
                    expand: "filament",
                })
                    .then(onStoragesModified)
                    .catch(e => toastError("Could not fetch storages", e));
            })
            .catch(e => toastError("Could not move one or more filament", e));
    }

    function handleList() {
        const filteredList = filament.filter(f => f.name.toLowerCase().includes(search.toLowerCase()));

        const sortedList = filteredList.sort((a, b) => {
            if (sortKey === "name" || sortKey === "material" || sortKey === "brand")
                return (a[sortKey] ?? "").localeCompare(b[sortKey] ?? "");
            if (sortKey === "color")
                return colorSort(a[sortKey], b[sortKey]);
            if (sortKey === "updated")
                return new Date(b[sortKey]).getTime() - new Date(a[sortKey]).getTime();

            return 0;
        });

        setDisplayedFilament(sortedList);
    }

    useEffect(() => {
        handleList();
    }, [filament, sortKey, search]);

    return <>
        {(allowSort && view !== "table") && <div
            className="w-full bg-bg-light rounded-lg p-2 my-2 flex md:flex-row flex-col md:items-center gap-2"
        >
            <div className="flex items-center gap-2">
                <SortDesc />

                <Select
                    options={{
                        name: "Name",
                        color: "Color",
                        material: "Material",
                        brand: "Brand",
                        updated: "Recent",
                    } as Record<keyof FilamentRecord, string>}
                    value={sortKey}
                    onChange={k => setSortKey(k as keyof FilamentRecord)}
                    placeholder="Sort By..."
                    className="md:w-fit!"
                />
            </div>

            {!isMobile && <Divider vertical />}

            <div className="flex items-center gap-2">
                <Search />

                <Input
                    placeholder="Search Filament..."
                    className="md:w-fit w-full"
                    containerClassName="md:w-unset w-full"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
            </div>
        </div>}

        {title && <>
            <div className="flex justify-between items-center">
                <h2 className="w-full">{title}</h2>

                <div className="flex gap-2 items-center justify-end md:flex-nowrap flex-wrap">
                    {(!viewLock && !editMode) && <Tablist
                        tabs={{ card: <Images />, table: <TableIcon /> }}
                        activeTab={view}
                        onTabChange={v => setView(v as "card" | "table")}
                    />}

                    {allowEdit && <Button onClick={() => {
                        setView("table");
                        setEditMode(m => !m);
                    }} look={ButtonStyles.secondary}>
                        {editMode ? <X /> : <Pencil />}
                    </Button>}

                    {editMode && <Dropdown>
                        <DropdownTrigger asChild disabled={selectedFilament.length === 0}>
                            <Button look={ButtonStyles.secondary}
                                disabled={selectedFilament.length === 0}>
                                <ArchiveRestore />
                            </Button>
                        </DropdownTrigger>
                        <DropdownContent>
                            <p>Moving {selectedFilament.length} filament</p>
                            <Divider className="bg-bg-lightest" />
                            {storagesList.map(s => <DropdownItem onClick={() => moveSelected(s.id)}
                                disabled={!!s.capacity && (selectedFilament.length > s.capacity - s.filament.length)}>
                                <StorageMiniCard storage={s} />
                            </DropdownItem>)}
                        </DropdownContent>
                    </Dropdown>}

                    {editMode && <Button look={ButtonStyles.secondary} onClick={() => setOpenModal("qr")}
                        disabled={selectedFilament.length === 0}>
                        <QrCode />
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

        {view === "card" && <div className="grid grid-cols-2 md:flex flex-row flex-wrap w-full gap-2 mb-2">
            {displayedFilament.map(f => <FilamentCard
                filament={f}
                key={f.id}
                storagesList={storagesList}
                onModify={f => onListModified?.(modifyArrayItem(filament, f, "id"))}
                onStoragesModify={onStoragesModified}
                onDelete={() => onListModified?.(deleteFromArray(filament, f, "id"))}
                onDuplicate={f => onListModified?.([...filament, f])}
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
                        render: data => <div style={{ backgroundColor: data.color }} className="p-2 rounded-lg h-full w-20" />,
                        sort: (a, b) => colorSort(a as string, b as string),
                    },
                    (((user.shownFilamentTableKeys as string[]) ?? []).includes("storage") ? {
                        label: "Storage",
                        key: "storage",
                        render: data => storagesList.find(s => s.id === data.storage)?.name ?? <EmptyCell />,
                        // TODO: sort this properly (hard)
                    } : null),
                    ...((user.shownFilamentTableKeys as string[]) ?? []).map(key => {
                        const filamentKey = getFilamentTableKey(key);
                        if (!filamentKey || filamentKey.customRender)
                            return null;

                        return {
                            label: filamentKey.title,
                            key: filamentKey.key,
                            render: filamentKey.render,
                        };
                    }),
                ]}
                data={filament}
                rowClassName="cursor-pointer hover:bg-bg-lighter transition-colors"
                sort={sortKey}
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

        {process.env.NODE_ENV === "development" && <Button onClick={() => {
            const f = randomFilament();
            pb.collection("filament").create({ ...f, user: user!.id })
                .then(res => onListModified?.([...filament, res]))
                .catch(e => toastError("", e));
        }}>Add Random</Button>}

        <CreateFilamentModal open={openModal === "create"} onClose={() => setOpenModal("")}
            onCreate={f => onListModified?.([...filament, f])} storages={storagesList} presets={presets}
        />

        <PrintFilamentQRModal
            open={openModal === "qr"}
            onClose={() => setOpenModal("")}
            filament={selectedFilament}
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
