import { privacyPolicyLastUpdate } from "@/app/about/privacy-policy/page";
import { UsersDefaultViewOptions, UsersFilamentSortOptions, UsersRecord } from "@/types/pb";

export const defaultUserSettings: Partial<UsersRecord> = {
    filamentSort: "name" as UsersFilamentSortOptions,
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
    defaultView: "card" as UsersDefaultViewOptions,
    lastSeenPrivacyPolicy: privacyPolicyLastUpdate as unknown as string,
};
