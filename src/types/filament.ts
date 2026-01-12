import { DBDates } from "./general";

export type Filament = {
    id: string,
    user: string,

    name: string,
    material: string,
    brand?: string,
    color: string,

    mass: number,
    initialMass: number,

    note?: string,
    link?: string,
    temperature?: number,
    diameter?: number,
    cost?: number,
    spoolType?: "full" | "refill" | "nospool",
} & DBDates
