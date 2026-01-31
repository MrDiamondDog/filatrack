"use client";

import MotionContainer from "@/components/base/MotionContainer";
import FilamentList from "@/components/filament/FilamentList";
import { randomFilament } from "@/lib/util/random";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function StoragePage() {
    // TODO: load storage object
    // @ts-ignore temporary
    const [storage, setStorage] = useState<Storage>({
        id: "0", name: "Storage 1", icon: "", filament:
        [randomFilament(), randomFilament(), randomFilament(), randomFilament(), randomFilament(),
            randomFilament(), randomFilament(), randomFilament(), randomFilament(), randomFilament(),
            randomFilament(), randomFilament(), randomFilament(), randomFilament(), randomFilament(),
            randomFilament(), randomFilament(), randomFilament(), randomFilament(), randomFilament(),
            randomFilament(), randomFilament(), randomFilament(), randomFilament(), randomFilament(),
            randomFilament(), randomFilament(), randomFilament(), randomFilament(), randomFilament(),
            randomFilament(), randomFilament(), randomFilament(), randomFilament(), randomFilament(),
        ],
    });

    return <MotionContainer>
        <Link href="/app" className="flex gap-1 items-center"><ArrowLeft /> Back</Link>
        <FilamentList filament={storage.filament} title={storage.name} />
    </MotionContainer>;
}
