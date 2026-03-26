"use client";

import { pb } from "@/api/pb";
import Divider from "@/components/base/Divider";
import MotionContainer from "@/components/base/MotionContainer";
import CreateButton from "@/components/dashboard/CreateButton";
import FilamentChart from "@/components/dashboard/FilamentChart";
import FilamentList from "@/components/filament/FilamentList";
import StorageList from "@/components/storage/StorageList";
import { toastError } from "@/lib/util/error";
import { FilamentRecord } from "@/types/pb";
import { StorageWithFilament } from "@/types/storage";
import { useEffect, useState } from "react";

export default function DashboardPage() {
    const user = pb.authStore.record;

    if (!user)
        return null;

    const [filament, setFilament] = useState<FilamentRecord[]>([]);
    const [storages, setStorages] = useState<StorageWithFilament[]>([]);

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
    }, []);

    return (<MotionContainer>
        <div className="flex justify-between items-center">
            <h1>Dashboard</h1>

            <CreateButton onFilamentCreate={f => setFilament([...filament, f])} storages={storages} />
        </div>

        <Divider />

        {!!filament.length && <FilamentChart filament={filament} />}
        {!filament.length && <p className="w-full text-center">
            You don't have any filament yet. Press the + button in the top right to get started!
        </p>}

        {!!filament.length && <>
            <div className="w-full flex flex-col md:flex-row mt-5">
                <div className="w-full">
                    <h2>Storage</h2>
                    <Divider />
                    <StorageList storages={storages} onListUpdate={setStorages} />
                </div>

                <Divider vertical />

                <div className="w-full">
                    <FilamentList
                        title="Recent Filament"
                        filament={(filament)
                            .sort((a, b) => new Date(b.updated).getTime() - new Date(a.updated).getTime())
                            .slice(0, 3)}
                        viewLock="cards"
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
                onListModified={setFilament}
                onStoragesModified={setStorages}
                allowEdit
                allowAdd
                allowSort
            />
        </>}
    </MotionContainer>);
}
