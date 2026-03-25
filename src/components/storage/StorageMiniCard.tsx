import { StorageWithFilament } from "@/types/storage";
import Subtext from "../base/Subtext";
import { grams } from "@/lib/util/units";

export default function StorageMiniCard({ storage }: { storage: StorageWithFilament }) {
    const totalMass = storage.expand?.filament?.reduce((prev, curr) => prev + curr.mass, 0) ?? 0;
    const totalInitialMass = storage.expand?.filament?.reduce((prev, curr) => prev + curr.initialMass, 0) ?? 0;

    return (<div className="relative w-full">
        <div className="absolute top-0 left-0 right-0 bg-bg-light h-1 w-full rounded-full">
            <div className="absolute top-0 left-0 bg-primary h-full rounded-full"
                style={{ width: `${totalMass / totalInitialMass * 100}%` }} />
        </div>

        <div className="flex gap-2 items-center pt-1 justify-between w-full">
            <p>{storage.name}</p>
            <Subtext>
                {storage.filament.length}
                {!!storage.capacity && `/${storage.capacity}`} roll{storage.filament.length === 1 && !storage.capacity ? "" : "s"}
            </Subtext>
            <Subtext>{grams(totalMass)}/{grams(totalInitialMass)}</Subtext>
        </div>
    </div>);
}
