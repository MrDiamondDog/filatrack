import { DBDates } from "./general";

export type FilamentLog = {
    id: string,
    user: string,
    filament: string,

    label: string,
    filamentUsed: number,
    previousMass: number,
    newMass: number,
} & DBDates
