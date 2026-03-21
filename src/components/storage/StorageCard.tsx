import { Archive, Box, CirclePile, Weight } from "lucide-react";
import CardDetail from "../util/CardDetail";
import { grams } from "@/lib/util/units";
import Link from "next/link";
import { FilamentRecord, StorageResponse } from "@/types/pb";

export default function StorageCard({ storage }: { storage: StorageResponse<{ filament: FilamentRecord[] }> }) {
    const filament: FilamentRecord[] = storage.expand.filament ?? [];

    const totalMass = filament.reduce((prev, curr) => prev + curr.mass, 0);
    const totalInitialMass = filament.reduce((prev, curr) => prev + curr.initialMass, 0);

    return <Link
        className={`unstyled bg-bg-light p-2 rounded-lg min-w-50 border-2 border-transparent hover:border-primary 
            cursor-pointer transition-colors relative overflow-hidden`}
        href={`/app/storage/${storage.id}`}
    >
        <div className="absolute top-0 left-0 right-0 w-full h-1 bg-bg-lighter">
            <div className="absolute h-full bg-primary" style={{ width: `${totalMass / totalInitialMass * 100}%` }} />
        </div>

        <div className="flex gap-2 items-center">
            <Archive />
            <h3>{storage.name}</h3>
        </div>
        <div className="flex flex-col mb-2 items-baseline w-full">
            <CardDetail icon={<CirclePile size={20} />}>
                {filament.length}
                {!!storage.capacity && `/${storage.capacity}`} filament roll{filament.length === 1 && !storage.capacity ? "" : "s"}
            </CardDetail>
            <CardDetail icon={<Box size={20} />}>
                {!filament.length ? "None" : [...new Set(filament.map(f => f.material))].join(", ")}
            </CardDetail>
            <CardDetail icon={<Weight size={20} />}>
                {grams(totalMass)}/{grams(totalInitialMass)}
            </CardDetail>
        </div>

        <div className="w-full flex gap-1 flex-wrap mt-2">
            {filament.map(f => <div className="w-5 h-5 rounded-sm" style={{ backgroundColor: f.color }} key={f.id} />)}
            {/* {filament.map(f => <FilamentIcon filament={f} size={32} />)} */}
        </div>
    </Link>;
}
