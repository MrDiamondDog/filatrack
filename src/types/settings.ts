import { DBDates } from "./general";

export type MaterialPreset = {
    material: string,
    printingTemperature: number,
    bedTemperature: number
}

export type UserSettings = {
    user: string,

    tempUnit: "c" | "f",
    massUnit: "g" | "lb",
    lengthUnit: "mm" | "in",

    materialPresets: Record<string, MaterialPreset>
} & DBDates;
