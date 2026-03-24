"use client";

import { pb } from "@/api/pb";
import Divider from "@/components/base/Divider";
import MotionContainer from "@/components/base/MotionContainer";
import Spinner from "@/components/base/Spinner";
import Subtext from "@/components/base/Subtext";
import FilamentIcon from "@/components/filament/FilamentIcon";
import PrintList from "@/components/prints/PrintList";
import { toastError } from "@/lib/util/error";
import { celcius, grams } from "@/lib/util/units";
import { FilamentRecord, PrintsRecord, UsersRecord } from "@/types/pb";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";

export default function FilamentPage({ params }: { params: Promise<{ id: string }> }) {
    const user = pb.authStore.record as unknown as UsersRecord;

    if (!user)
        return null;

    const [filamentList, setFilamentList] = useState<(FilamentRecord & { expand: { prints: PrintsRecord[] }})[]>([]);
    const [filament, setFilament] = useState<(FilamentRecord & { expand: { prints: PrintsRecord[] }})>();

    useEffect(() => {
        params.then(p => {
            pb.collection("filament").getFullList<FilamentRecord & { expand: { prints: PrintsRecord[] }}>({
                filter: `user.id = "${user.id}"`,
                expand: "prints",
            })
                .then(res => {
                    setFilamentList(res);
                    setFilament(res.find(f => f.id === p.id));
                })
                .catch(e => toastError("Could not fetch filament", e));
        });
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
                        <div className="text-center"><Subtext>Nozzle Temp.</Subtext> {celcius(filament.nozzleTemperature)}</div>
                        <Divider vertical />
                    </>}
                    {!!filament.bedTemperature && <>
                        <div className="text-center"><Subtext>Bed Temp.</Subtext> {celcius(filament.bedTemperature)}</div>
                        <Divider vertical />
                    </>}
                    {!!filament.diameter && <>
                        <div className="text-center"><Subtext>Diameter</Subtext> {filament.diameter}mm</div>
                        <Divider vertical />
                    </>}
                    <div className="text-center"><Subtext>Total Prints</Subtext> {filament.prints?.length}</div>
                    <Divider vertical />
                </div>
                <Divider />

                <h3>Prints With This Filament</h3>

                <PrintList prints={filament.expand.prints ?? []} filament={filamentList} />
            </>}
        </Suspense>
    </MotionContainer>;
}
