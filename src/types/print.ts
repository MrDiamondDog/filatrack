import { Filament } from "./filament";
import { DBDates } from "./general";

export type Print = {
    id: string,
    user: string,

    name: string,

    totalFilament: number,
    totalRolls: number,

    filamentUsage: Record<string, number>,
    filamentRolls: Filament[],
} & DBDates
