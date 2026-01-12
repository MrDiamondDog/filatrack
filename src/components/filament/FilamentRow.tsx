import { Filament } from "@/types/filament";
import FilamentIcon from "./FilamentIcon";
import { grams } from "@/lib/units";

export default function FilamentRow({ filament }: { filament: Filament }) {
    return <tr>
        <td><FilamentIcon filament={filament} size={36} /></td>
        <td>{filament.name}</td>
        <td className="relative">
            <div style={{ backgroundColor: filament.color }} className="rounded-lg absolute inset-2" />
        </td>
        <td className="relative">
            {grams(filament.mass)}/{grams(filament.initialMass)}
            <div className="absolute top-0 left-0 right-0 bg-bg-light w-full h-1">
                <div className="absolute top-0 left-0 bg-primary h-full rounded-r-full"
                    style={{ width: `${filament.mass / filament.initialMass * 100}%` }}
                />
            </div>
        </td>
        <td>{filament.material}</td>
        <td>{filament.brand}</td>
    </tr>;
}
