"use client";

import { useEffect, useState } from "react";
import { Box, Filament, UserSettings } from "@/db/types";
import { ListFilter, Plus } from "lucide-react";
import Input from "@/components/Input";
import { app } from "../../../lib/db";
import { useDevice } from "../../../lib/hooks";
import SearchTipsModal from "@/components/filament/SearchTips";
import Footer from "@/components/Footer";
import { sidebarWidth } from "../../../lib/constants";
import { Select } from "@/components/Select";
import { handleApiError } from "../../../lib/errors";
import Divider from "@/components/Divider";
import FilamentList from "@/components/filament/FilamentList";
import Button from "@/components/Button";
import CreateBoxModal from "@/components/boxes/CreateBox";
import Subtext from "@/components/Subtext";
import BoxEntry from "@/components/boxes/Box";
import Spinner from "@/components/Spinner";

export default function FilamentPage() {
    const [isMobile, width] = useDevice();

    const [sortBy, setSortBy] = useState<keyof Filament>("index");
    const [search, setSearch] = useState("");

    const [openModal, setOpenModal] = useState("");

    const [userSettings, setUserSettings] = useState<UserSettings>();

    const [allFilament, setAllFilament] = useState<Filament[]>();
    const [allBoxes, setAllBoxes] = useState<Box[]>();

    function fetchFilament() {
        app.filament.getAllFilaments().then(res => {
            if (res.error)
                return void handleApiError(res.error, "toast");

            setAllFilament(res.data!);
        });
    }

    useEffect(() => {
        app.settings.getUserSettings().then(res => {
            if (res.error)
                return void handleApiError(res.error, "toast");

            setUserSettings(res.data!);
        });

        fetchFilament();

        app.boxes.getAllBoxes().then(res => {
            if (res.error)
                return void handleApiError(res.error, "toast");

            setAllBoxes(res.data!);
        });
    }, []);

    return <>
        <div
            className="bg-bg w-full p-4 pt-2 mb-[75px] md:mb-0 h-full pb-20"
            style={{ marginLeft: (!width || isMobile) ? undefined : sidebarWidth }}
        >
            <div className="w-full bg-bg-light rounded-lg p-2 flex flex-col md:flex-row md:items-center gap-1 drop-shadow-lg">
                <div className="flex flex-row items-center gap-1 w-full md:w-[unset]">
                    <ListFilter className="min-w-[24px]" />
                    <Select
                        value={sortBy}
                        onChange={v => setSortBy(v as keyof Filament)}
                        className="h-full w-full"
                        options={{
                            index: "Custom",
                            name: "Name",
                            brand: "Brand",
                            material: "Material",
                            lastUsed: "Last Used",
                            currentMass: "Current Mass",
                            startingMass: "Starting Mass",
                        }}
                    />
                </div>
                <Input
                    placeholder="Search Filament..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="focus-within:w-full transition-all"
                    onFocus={() => setOpenModal((userSettings?.seenSearchTips ?? true) ? "" : "searchtips")}
                />
            </div>

            <div className="flex justify-between items-center mt-2">
                <h2>Filament Boxes</h2>
                <Button onClick={() => setOpenModal("createbox")}><Plus size={32} /></Button>
            </div>

            <Divider />

            <div className="flex gap-2">
                {!allBoxes && <Spinner />}
                {(allBoxes && !allBoxes?.length) && <Subtext>Nothing to see here.</Subtext>}
                {(allBoxes && allFilament) && allBoxes.map((box, i) => <BoxEntry
                    box={box}
                    allFilament={allFilament}
                    key={box.id}
                    onEdit={newBox => setAllBoxes([...allBoxes.slice(0, i), newBox, ...allBoxes.slice(i + 1)])}
                    onDelete={() => {
                        setAllBoxes(allBoxes.filter(b => b.id !== box.id));
                        fetchFilament();
                    }}
                />)}
            </div>

            <FilamentList
                data={search ? allFilament : allFilament?.filter(f => !f.box)}
                title="Your Filament"
                allowAdd
                sortBy={sortBy}
                search={search}
                allBoxes={allBoxes}
            />

            <Footer />
        </div>

        <SearchTipsModal
            open={openModal === "searchtips"}
            onClose={() => {
                setUserSettings({ ...userSettings!, seenSearchTips: true });
                setOpenModal("");
            }}
        />

        {allBoxes && <CreateBoxModal
            open={openModal === "createbox"}
            onClose={() => setOpenModal("")}
            onAdd={box => setAllBoxes([...allBoxes, box])}
        />}
    </>;
}
