"use client";

import { pb } from "@/api/pb";
import Divider from "@/components/base/Divider";
import MotionContainer from "@/components/base/MotionContainer";
import Spinner from "@/components/base/Spinner";
import Subtext from "@/components/base/Subtext";
import FilamentIcon from "@/components/filament/FilamentIcon";
import PrintList from "@/components/prints/PrintList";
import { celcius, grams } from "@/lib/util/units";
import { FilamentRecord, PrintsRecord } from "@/types/pb";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";

export default function FilamentPage({ params }: { params: Promise<{ id: string }> }) {
    const [filament, setFilament] = useState<FilamentRecord>();

    const prints: PrintsRecord[] = [
        // @ts-ignore temp
        { label: "a Test Print", totalFilamentUsed: 124, totalRollsUsed: 2, created: new Date() },
        // @ts-ignore temp
        { label: "z Test Print 2", totalFilamentUsed: 2, totalRollsUsed: 1, created: new Date(Date.now() - 998 * 60 * 24) },
    ];

    useEffect(() => {
        params.then(p => pb.collection("filament").getOne(p.id)
            .then(setFilament));
    }, []);

    return <MotionContainer>
        <Suspense fallback={<Spinner />}>
            {filament && <>
                <Link href="/app/filament" className="flex items-center gap-1"><ArrowLeft /> Back</Link>
                <Divider />

                <div className="flex gap-2 items-center mt-1">
                    <FilamentIcon filament={filament} size={48} />
                    <h2>{filament.name}</h2>
                </div>

                {filament.note && <p>{filament.note}</p>}

                <Divider />

                <div className="flex gap-1">
                    <div className="text-center"><Subtext>Material</Subtext> {filament.material}</div>
                    <Divider vertical />
                    {filament.brand && <>
                        <div className="text-center"><Subtext>Brand</Subtext> {filament.brand}</div>
                        <Divider vertical />
                    </>}
                    <div className="text-center">
                        <Subtext>Mass</Subtext>
                        {grams(filament.mass)}/{grams(filament.initialMass)}
                    </div>
                    <Divider vertical />
                    {!!filament.nozzleTemperature && <>
                        <div className="text-center"><Subtext>Print Temperature</Subtext> {celcius(filament.nozzleTemperature)}</div>
                        <Divider vertical />
                    </>}
                    {!!filament.diameter && <>
                        <div className="text-center"><Subtext>Diameter</Subtext> {filament.diameter}mm</div>
                        <Divider vertical />
                    </>}
                    <div className="text-center"><Subtext>Total Prints</Subtext> {prints.length}</div>
                    <Divider vertical />
                </div>
                <Divider />

                <h3>Prints With This Filament</h3>
                <Divider />

                <PrintList prints={prints} />
            </>}
        </Suspense>
    </MotionContainer>;
}
