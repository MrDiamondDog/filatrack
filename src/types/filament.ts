import { DBDates } from "./general";

export type Filament = {
    id: string,
    /**
     * User ID of the owner of this filament.
     */
    user: string,

    /**
     * ID of the storage this filament is currently in. Undefined/null if none
     */
    storage?: string | null,

    /**
     * IDs of all the prints made with this filament.
     */
    prints: string[],

    name: string,
    material: string,
    /**
     * Hex code
     */
    color: string,
    brand?: string | null,

    mass: number,
    initialMass: number,

    note?: string | null,
    purchaseLink?: string | null,
    nozzleTemperature?: number | null,
    bedTemperature?: number | null,
    diameter?: number | null,
    cost?: number | null,
    transmissionDistance?: number | null,
    flowRate?: number | null,
    spoolType?: "plastic" | "cardboard" | "refill" | "nospool" | null,

    customAttributes?: Record<string, string | number> | null
} & DBDates
