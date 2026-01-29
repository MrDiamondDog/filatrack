import { DBDates } from "./general";

export type MaterialPreset = {
    material: string,
    nozzleTemperature?: number,
    bedTemperature?: number,
    transmissionDistance?: number,
    flowRatio?: number,
}

export type CustomAttribute = {
    name: string,
    type: "string" | "number",
    units?: string,
}

export type UserSettings = {
    user: string,

    tempUnit: "c" | "f",
    massUnit: "g" | "lb", // why do i even make this an option
    lengthUnit: "mm" | "in",

    materialPresets: MaterialPreset[],

    customAttributes: CustomAttribute[]
} & DBDates;
