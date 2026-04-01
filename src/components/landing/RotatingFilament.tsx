"use client";

import { randomFilament, randomInt } from "@/lib/util/random";
import { useEffect, useState } from "react";
import FilamentCard from "../filament/FilamentCard";
import { IsoAutoDateString } from "@/types/pb";

export default function RotatingFilament() {
    const [filament, setFilament] = useState(randomFilament());

    useEffect(() => {
        const interval = setInterval(() => setFilament(randomFilament), 1000);

        return () => clearInterval(interval);
    }, []);

    return <FilamentCard
        filament={{
            id: `${randomInt(0, 9999999999)}`,
            user: "",
            created: "" as IsoAutoDateString,
            updated: "" as IsoAutoDateString,
            ...filament,
        }}
        noninteractable
        storagesList={[]}
    />;
}
