import { FilamentKey } from "@/types/filament";
// eslint-disable-next-line max-len
import { Archive, BedDouble, Box, Diameter, DollarSign, Lightbulb, LineSquiggle, NotebookText, Palette, Spool, Store, Thermometer, Weight } from "lucide-react";
import { celcius, grams } from "./util/units";

export function getFilamentCardKey(key: string) {
    return filamentCardKeys.find(k => k.key === key);
}

export function getFilamentTableKey(key: string) {
    return filamentTableKeys.find(k => k.key === key);
}

export const commonFilamentKeys: FilamentKey[] = [
    {
        key: "storage",
        title: "Storage",
        icon: <Archive size={20} />,
        customRender: true,
    },
    {
        key: "material",
        title: "Material",
        icon: <Box size={20} />,
    },
    {
        key: "brand",
        title: "Brand",
        icon: <Store size={20} />,
    },
    {
        key: "note",
        title: "Note",
        icon: <NotebookText size={20} />,
    },
    {
        key: "purchaseLink",
        title: "Purchase Link",
        icon: <Store size={20} />,
    },
    {
        key: "nozzleTemperature",
        title: "Nozzle Temperature",
        icon: <Thermometer size={20} />,
        render: filament => (filament.nozzleTemperature ? celcius(filament.nozzleTemperature) : undefined),
    },
    {
        key: "bedTemperature",
        title: "Bed Temperature",
        icon: <BedDouble size={20} />,
        render: filament => (filament.bedTemperature ? celcius(filament.bedTemperature) : undefined),
    },
    {
        key: "diameter",
        title: "Diameter",
        icon: <Diameter size={20} />,
        render: filament => (filament.diameter ? `${filament.diameter}mm` : undefined),
    },
    {
        key: "cost",
        title: "Cost",
        icon: <DollarSign size={20} />,
        render: filament => (filament.cost ? `$${filament.cost}` : undefined),
    },
    {
        key: "transmissionDistance",
        title: "Transmission Distance",
        icon: <Lightbulb size={20} />,
    },
    {
        key: "flowRatio",
        title: "Flow Ratio",
        icon: <LineSquiggle size={20} />,
    },
    {
        key: "spoolType",
        title: "Spool Type",
        icon: <Spool size={20} />,
    },
];

export const filamentCardKeys: FilamentKey[] = [
    ...commonFilamentKeys,
    {
        key: "mass",
        title: "Mass",
        icon: <Weight size={20} />,
        render: filament => `${grams(filament.mass ?? 0)}/${grams(filament.initialMass)}`,
    },
    {
        key: "color",
        title: "Color",
        icon: <Palette size={20} />,
    },
];

export const filamentTableKeys: FilamentKey[] = [
    ...commonFilamentKeys,
    {
        key: "mass",
        title: "Mass",
        icon: <Weight size={20} />,
        render: filament => grams(filament.mass ?? 0),
    },
    {
        key: "initialMass",
        title: "Initial Mass",
        icon: <Weight size={20} />,
        render: filament => grams(filament.mass ?? 0),
    },
];
