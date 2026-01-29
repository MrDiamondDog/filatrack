import { DBDates } from "./general";

export type User = {
    id: string,

    email: string,
    emailVisibility: boolean,
    verified: boolean,

    name: string,
    avatar?: string,

    filament: string[],
    storage: string[],
    logs: string[],

    settings: string,
} & DBDates
