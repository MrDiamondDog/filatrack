"use client";

import { pb } from "@/api/pb";
import Button, { ButtonStyles } from "@/components/base/Button";
import Divider from "@/components/base/Divider";
import MotionContainer from "@/components/base/MotionContainer";
import { Select } from "@/components/base/Select";
import Subtext from "@/components/base/Subtext";
import Tab from "@/components/base/tabs/Tab";
import Tablist from "@/components/base/tabs/Tablist";
import FilamentPresetCard from "@/components/filament/FilamentPresetCard";
import CreateFilamentPresetModal from "@/components/modals/CreateFilamentPresetModal";
import { logout } from "@/lib/auth";
import { deleteFromArray, modifyArrayItem } from "@/lib/util/array";
import { toastError } from "@/lib/util/error";
import { useObjectState } from "@/lib/util/hooks";
import {
    FilamentPresetsRecord,
    UsersLengthUnitOptions,
    UsersMassUnitOptions,
    UsersRecord,
    UsersTempUnitOptions,
} from "@/types/pb";
import { startHolyLoader, stopHolyLoader } from "holy-loader";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function SettingsPage() {
    const user = pb.authStore.record as unknown as UsersRecord | null;

    if (!user)
        return null;

    const [userData, setUserData] = useObjectState({ ...user });
    const [filamentPresets, setFilamentPresets] = useState<FilamentPresetsRecord[]>([]);

    const [openModal, setOpenModal] = useState("");

    async function updateSettings(newSettings: Partial<UsersRecord>) {
        startHolyLoader();
        await pb.collection("users").update(user!.id, { ...newSettings })
            .then(setUserData)
            .catch(e => {
                toastError("Could not update user", e);
            });
        stopHolyLoader();
    }

    useEffect(() => {
        pb.collection("filamentPresets").getFullList({
            filter: `user.id = "${user.id}"`,
        })
            .then(setFilamentPresets)
            .catch(e => toastError("Could not fetch filament presets", e));
    }, []);

    return (<>
        <MotionContainer>
            <Tablist tabs={{ account: "Account", preferences: "Preferences" }} activeTab="account">
                <Tab name="account">
                    <div className="bg-bg-light rounded-lg p-4 flex gap-2 w-fit mt-2 items-center">
                        <img src={pb.files.getURL(userData, userData.avatar!)} className="rounded-full size-30" />
                        <div className="*:w-full">
                            <h2>{userData.name}</h2>
                            <Divider />
                            <Link href="/about/privacy-policy">Privacy Policy</Link>
                            <Button look={ButtonStyles.secondary} className="mb-1" onClick={logout}>Log Out</Button>
                            <Button look={ButtonStyles.secondary} className="mb-1">Edit Username</Button>
                            <Button look={ButtonStyles.danger}>Delete Account</Button>
                        </div>
                    </div>
                </Tab>
                <Tab name="preferences" className="max-w-150">
                    <div>
                        <h2 className="mt-2">Units</h2>
                        <Subtext>
                            The default units that Filatrack will display.
                        </Subtext>

                        <Divider />

                        <p>Temperature</p>
                        <Select
                            options={{ c: "°C", f: "°F" }}
                            value={userData.tempUnit}
                            onChange={v => updateSettings({ tempUnit: v as UsersTempUnitOptions })}
                        />

                        <p>Mass</p>
                        <Select
                            options={{ g: "g", lb: "lb" }}
                            value={userData.massUnit}
                            onChange={v => updateSettings({ massUnit: v as UsersMassUnitOptions })}
                        />
                        {userData.massUnit === "lb" && <Subtext className="text-[12px]">
                            Why did I make this an option...
                        </Subtext>}

                        <p>Length</p>
                        <Select
                            options={{ mm: "mm", in: "in" }}
                            value={userData.lengthUnit}
                            onChange={v => updateSettings({ lengthUnit: v as UsersLengthUnitOptions })}
                        />
                    </div>
                    <Divider />
                    <div>
                        <div className="flex justify-between items-center">
                            <h2>Filament Presets</h2>
                            <Button onClick={() => setOpenModal("filament-preset")}><Plus /></Button>
                        </div>
                        <Subtext>Presets you can use to autofill common values when making filament.</Subtext>

                        <Divider />

                        <div className="flex gap-2 flex-wrap">
                            {filamentPresets.map(p => <FilamentPresetCard
                                key={p.id} preset={p} onModify={p => setFilamentPresets(modifyArrayItem(filamentPresets, p, "id"))}
                                onDelete={() => setFilamentPresets(deleteFromArray(filamentPresets, p, "id"))}
                            />)}
                        </div>
                    </div>
                    <Divider />
                    <div>
                        <div className="flex justify-between items-center">
                            <h2>Custom Attributes</h2>
                            <Button disabled onClick={() => setOpenModal("custom-attribute")}><Plus /></Button>
                        </div>
                        <Subtext>
                            Allows you to track filament properties that Filatrack doesn't have.
                        </Subtext>

                        <Divider />

                        <p>Coming soon!</p>

                        {/* <div className="flex flex-col gap-2">
                            {userSettings.expand.customAttributes?.map(a => <CustomAttributeCard attribute={a} />)}
                        </div> */}
                    </div>
                </Tab>
            </Tablist>

        </MotionContainer>

        <CreateFilamentPresetModal open={openModal === "filament-preset"} onClose={() => setOpenModal("")}
            onCreate={p => setFilamentPresets([...filamentPresets, p])} />
        {/* <CreateCustomAttributeModal open={openModal === "custom-attribute"} onClose={() => setOpenModal("")} /> */}
    </>);
}
