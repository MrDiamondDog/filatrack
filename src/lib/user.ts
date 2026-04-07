export const defaultUserSettings = {
    filamentSort: "name",
    shownFilamentCardKeys: ["storage", "brand", "material", "mass"],
    shownFilamentTableKeys: [
        "storage",
        "color",
        "brand",
        "material",
        "mass",
        "initialMass",
        "nozzleTemperature",
        "bedTemperature",
    ],
    defaultQrSettings: {
        fields: [
            {
                title: "Mass",
            },
            {
                title: "Nozzle Temperature",
            },
            {
                title: "Bed Temperature",
            },
            {
                key: "note",
                title: "Note",
            },
        ],
        format: "SVG",
    },
};
