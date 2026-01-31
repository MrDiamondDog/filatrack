"use client";

import { randomFilament } from "@/lib/util/random";
import { useEffect, useState } from "react";
import FilamentCard from "../filament/FilamentCard";

export default function RotatingFilament() {
    const [filament, setFilament] = useState(randomFilament());

    const [interval, setIntervalId] = useState<NodeJS.Timeout>();

    useEffect(() => {
        setIntervalId(setInterval(() => setFilament(randomFilament), 1000));

        return () => clearInterval(interval);
    }, []);

    return <FilamentCard filament={filament} noninteractable />;
}
