"use client";

import Button, { ButtonStyles } from "@/components/base/Button";
import Divider from "@/components/base/Divider";
import MotionContainer from "@/components/base/MotionContainer";
import { Select } from "@/components/base/Select";
import Subtext from "@/components/base/Subtext";
import Tab from "@/components/base/tabs/Tab";
import Tablist from "@/components/base/tabs/Tablist";
import CustomAttributeCard from "@/components/filament/CustomAttributeCard";
import MaterialPresetCard from "@/components/filament/MaterialPresetCard";
import CreateCustomAttributeModal from "@/components/modals/CreateCustomAttributeModal";
import CreateMaterialPresetModal from "@/components/modals/CreateMaterialPresetModal";
import { useObjectState } from "@/lib/hooks";
import { UserSettings } from "@/types/settings";
import { Plus } from "lucide-react";
import { useState } from "react";

export default function SettingsPage() {
    // TODO: backend
    const [userSettings, setUserSettings] = useObjectState<UserSettings>({
        user: "lalala",
        tempUnit: "c",
        massUnit: "g",
        lengthUnit: "mm",
        materialPresets: [{ material: "PLA", nozzleTemperature: 220, bedTemperature: 60, transmissionDistance: 1.00, flowRatio: 1 },
            { material: "PLA", nozzleTemperature: 220, bedTemperature: 60, transmissionDistance: 1.00, flowRatio: 1 },
        ],
        customAttributes: [{ name: "Density", type: "number", units: "g/mm^3" },
            { name: "Location", type: "string" },
        ],
        created: new Date(),
        updated: new Date(),
    });

    const [openModal, setOpenModal] = useState("");

    return (<>
        <MotionContainer>
            <Tablist tabs={{ account: "Account", preferences: "Preferences" }} activeTab="account">
                <Tab name="account">
                    <div className="bg-bg-light rounded-lg p-4 flex gap-2 w-fit mt-2">
                        <img src="/apple-touch-icon.png" className="rounded-full" />
                        <div>
                            <h2>Username</h2>
                            <Divider />
                            <Button look={ButtonStyles.secondary} className="mb-1">Edit Username</Button>
                            <Button look={ButtonStyles.danger}>Delete Account</Button>
                        </div>
                    </div>
                </Tab>
                <Tab name="preferences" className="w-fit">
                    <div>
                        <h2 className="mt-2">Units</h2>
                        <Subtext>
                    The default units that Filatrack will display.
                        </Subtext>

                        <Divider />

                        <p>Temperature</p>
                        <Select
                            options={{ c: "°C", f: "°F" }}
                            value={userSettings.tempUnit}
                            onChange={v => setUserSettings({ tempUnit: v as "c" | "f" })}
                        />

                        <p>Mass</p>
                        <Select
                            options={{ g: "g", lb: "lb" }}
                            value={userSettings.massUnit}
                            onChange={v => setUserSettings({ massUnit: v as "g" | "lb" })}
                        />
                        {userSettings.massUnit === "lb" && <Subtext className="text-[12px]">
                            Why did I make this an option...
                        </Subtext>}

                        <p>Length</p>
                        <Select
                            options={{ mm: "mm", in: "in" }}
                            value={userSettings.lengthUnit}
                            onChange={v => setUserSettings({ lengthUnit: v as "mm" | "in" })}
                        />
                    </div>
                    <Divider />
                    <div>
                        <div className="flex justify-between items-center">
                            <h2>Material Presets</h2>
                            <Button onClick={() => setOpenModal("material-preset")}><Plus /></Button>
                        </div>
                        <Subtext>Presets you can use to autofill common values when making filament.</Subtext>

                        <Divider />

                        <div className="flex flex-col gap-2">
                            {userSettings.materialPresets.map(p => <MaterialPresetCard preset={p} editable />)}
                        </div>
                    </div>
                    <Divider />
                    <div>
                        <div className="flex justify-between items-center">
                            <h2>Custom Attributes</h2>
                            <Button onClick={() => setOpenModal("custom-attribute")}><Plus /></Button>
                        </div>
                        <Subtext>
                            Allows you to track filament properties that Filatrack doesn't have.
                        </Subtext>

                        <Divider />

                        <div className="flex flex-col gap-2">
                            {userSettings.customAttributes.map(a => <CustomAttributeCard attribute={a} />)}
                        </div>
                    </div>
                </Tab>
            </Tablist>

        </MotionContainer>

        <CreateMaterialPresetModal open={openModal === "material-preset"} onClose={() => setOpenModal("")} />
        <CreateCustomAttributeModal open={openModal === "custom-attribute"} onClose={() => setOpenModal("")} />
    </>);
}
