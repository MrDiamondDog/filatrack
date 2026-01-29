import { DBDates } from "./general";

export type Storage = {
    id: string,
    user: string,

    name: string,
    icon: string,

    /**
     * IDs of all the filament in the storage.
     */
    filament: string[],
} & DBDates
