import { Filament } from "@/types/filament";
import { grams } from "@/lib/util/units";
import Subtext from "../base/Subtext";
import FilamentIcon from "./FilamentIcon";

export default function FilamentMiniRow({ filament }: { filament: Filament }) {
    return <div className="flex gap-2 items-center w-full">
        <FilamentIcon filament={filament} size={32} />
        <div className="relative w-full">
            <div className="absolute top-0 left-0 right-0 h-1">
                <div className="absolute top-0 left-0 right-0 bg-bg-light w-full h-1 rounded-full">
                    <div className="absolute top-0 left-0 bg-primary h-full rounded-full"
                        style={{ width: `${filament.mass / filament.initialMass * 100}%` }}
                    />
                </div>
            </div>

            <div className="flex gap-2 items-center pt-1 justify-between w-full">
                <p>{filament.name}</p>
                <Subtext>{grams(filament.mass)}/{grams(filament.initialMass)}</Subtext>
                <Subtext>{filament.material}</Subtext>
                <Subtext>{filament.brand}</Subtext>
            </div>
        </div>
    </div>;
}
