import { Filament } from "./filament";
import { DBDates } from "./general";

export type Storage = {
    id: string,
    user: string,

    name: string,
    icon: string,

    filament: Filament[],
} & DBDates
