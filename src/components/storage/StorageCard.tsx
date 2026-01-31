import { Storage } from "@/types/storage";
import { Archive, Box, CirclePile, Weight } from "lucide-react";
import CardDetail from "../util/CardDetail";
import { grams } from "@/lib/util/units";
import Link from "next/link";

export default function StorageCard({ storage }: { storage: Storage }) {
    const totalMass = storage.filament.reduce((prev, curr) => prev + curr.mass, 0);
    const totalInitialMass = storage.filament.reduce((prev, curr) => prev + curr.initialMass, 0);

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
        <CardDetail>
            <CirclePile size={20} /> {storage.filament.length} filament roll{storage.filament.length === 1 ? "" : "s"}
        </CardDetail>
        <CardDetail>
            <Box size={20} />
            {[...new Set(storage.filament.map(f => f.material))].join(", ")}
        </CardDetail>
        <CardDetail>
            <Weight size={20} /> {grams(totalMass)}/
            {grams(totalInitialMass)}
        </CardDetail>

        <div className="w-full flex gap-1 flex-wrap mt-2">
            {storage.filament.map(f => <div className="w-5 h-5 rounded-sm" style={{ backgroundColor: f.color }} key={f.id} />)}
        </div>
    </Link>;
}
