import { DBDates } from "./general";

export type MaterialPreset = {
    user: string,

    material: string,
    nozzleTemperature?: number,
    bedTemperature?: number,
    transmissionDistance?: number,
    flowRatio?: number,

    public?: boolean,
}

export type CustomAttribute = {
    user: string,

    name: string,
    type: "string" | "number",
    units?: string,
}

export type UserSettings = {
    id: string,
    user: string,

    tempUnit: "c" | "f",
    massUnit: "g" | "lb", // why do i even make this an option
    lengthUnit: "mm" | "in",

    materialPresets: MaterialPreset[],

    customAttributes: CustomAttribute[]
} & DBDates;
