import { DBDates } from "./general";

export type Print = {
    id: string,
    user: string,

    label: string,

    /**
     * Record of filament IDs to amount of filament used from that filament in g.
     */
    filamentUsage: Record<string, number>,
    /**
     * The IDs of the rolls used.
     */
    filamentRolls: string[],

    /**
     * Total filament used in g.
     */
    totalFilamentUsed: number,
    /**
     * Total number of rolls used during this print
     */
    totalRollsUsed: number,
} & DBDates
