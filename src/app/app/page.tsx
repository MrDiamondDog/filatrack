"use client";

import { pb } from "@/api/pb";
import Button from "@/components/base/Button";
import Divider from "@/components/base/Divider";
import MotionContainer from "@/components/base/MotionContainer";
import Spinner from "@/components/base/Spinner";
import CreateButton from "@/components/dashboard/CreateButton";
import FilamentChart from "@/components/dashboard/FilamentChart";
import FilamentList from "@/components/filament/FilamentList";
import ScanQRModal from "@/components/modals/ScanQRModal";
import StorageList from "@/components/storage/StorageList";
import { toastError } from "@/lib/util/error";
import { useDevice } from "@/lib/util/hooks";
import { FilamentPresetsRecord, FilamentRecord } from "@/types/pb";
import { StorageWithFilament } from "@/types/storage";
import { ScanLine } from "lucide-react";
import { useEffect, useState } from "react";

export default function DashboardPage() {
    const user = pb.authStore.record;

    if (!user)
        return null;

    const [isMobile, _] = useDevice();

    const [filament, setFilament] = useState<FilamentRecord[]>();
    const [storages, setStorages] = useState<StorageWithFilament[]>();
    const [presets, setPresets] = useState<FilamentPresetsRecord[]>();

    const [openModal, setOpenModal] = useState("");

    useEffect(() => {
        pb.collection("filament").getFullList({
            filter: `user.id = "${user.id}"`,
        })
            .then(setFilament)
            .catch(e => toastError("Could not fetch filament", e));

        pb.collection("storage").getFullList<StorageWithFilament>({
            filter: `user.id = "${user.id}"`,
            expand: "filament",
        })
            .then(setStorages)
            .catch(e => toastError("Could not fetch storages", e));

        pb.collection("filamentPresets").getFullList({
            filter: `user.id = "${user.id}"`,
        })
            .then(setPresets)
            .catch(e => toastError("Could not fetch filament", e));
    }, []);

    return (<MotionContainer>
        {(filament && storages && presets) ? <>
            <div className="flex justify-between items-center">
                <h1>Dashboard</h1>

                <div className="flex gap-2">
                    <Button className="flex gap-1 items-center" onClick={() => setOpenModal("scan")}>
                        <ScanLine size={32} /> {!isMobile && "Scan"}
                    </Button>
                    <CreateButton onFilamentCreate={f => setFilament([...filament, f])} storages={storages} presets={presets} />
                </div>
            </div>

            <Divider />

            <FilamentChart filament={filament} />

            <div className="w-full flex flex-col md:flex-row mt-5">
                <div className="w-full">
                    <h2>Storage</h2>
                    <Divider />
                    <StorageList storages={storages} onListUpdate={setStorages} />
                    {!storages.length && <p className="w-full text-center">
                        You don't have any storages yet. Press the + button in the top right to get started!
                    </p>}
                </div>

                <Divider vertical />

                <div className="w-full">
                    <FilamentList
                        title="Recent Filament"
                        filament={(filament)
                            .sort((a, b) => new Date(b.updated).getTime() - new Date(a.updated).getTime())
                            .slice(0, isMobile ? 4 : 3)}
                        viewLock="card"
                        storagesList={storages}
                        onListModified={setFilament}
                        onStoragesModified={setStorages}
                    />
                </div>
            </div>

            <Divider />

            <FilamentList
                title="All Filament"
                filament={filament}
                storagesList={storages}
                presets={presets}
                onListModified={setFilament}
                onStoragesModified={setStorages}
                allowEdit
                allowAdd
                allowSort
            />
            {!filament.length && <p className="w-full text-center">
                You don't have any filament yet. Press the + button in the top right to get started!
            </p>}

            <ScanQRModal open={openModal === "scan"} onClose={() => setOpenModal("")} />
        </> : <Spinner />}
    </MotionContainer>);
}
