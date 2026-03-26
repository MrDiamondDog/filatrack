import { Create } from "@/types/general";
import { FilamentRecord } from "@/types/pb";

export function randomFrom<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

export function randomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const randomFilamentNames = {
    Red: "#FF0000",
    Green: "#00FF00",
    Blue: "#0000FF",
    Black: "#000000",
    White: "#FFFFFF",
    Yellow: "#FFFF00",
    Purple: "#800080",
    Wood: "#8B4513",
    Gray: "#808080",
    "Carbon Fiber": "#333333",
    Transparent: "#FFFFFF",
};

export const randomFilamentBrands = [
    "Prusa",
    "Hatchbox",
    "eSUN",
    "MatterHackers",
    "Polymaker",
    "Sunlu",
    "Raise3D",
    "Anycubic",
    "Creality",
    "Elegoo",
    "Bambu",
];

export const randomFilamentMaterials = [
    "PLA",
    "ABS",
    "PETG",
    "TPU",
];

export const randomFilamentMaxMass = [2000, 1000, 500, 250, 200];

export function randomFilament(): Create<FilamentRecord> {
    const name = randomFrom(Object.keys(randomFilamentNames));
    const maxMass = randomFrom(randomFilamentMaxMass);

    return {
        name,
        prints: [],
        brand: randomFrom(randomFilamentBrands),
        color: randomFilamentNames[name as keyof typeof randomFilamentNames]!,
        material: randomFrom(randomFilamentMaterials),
        mass: randomInt(1, maxMass),
        nozzleTemperature: 220,
        diameter: 1.75,
        initialMass: maxMass,
        note: "Test",
    };
}
