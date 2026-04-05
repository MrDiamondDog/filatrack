"use client";

import { pb } from "@/api/pb";
import Button, { ButtonStyles } from "@/components/base/Button";
import Checkbox from "@/components/base/Checkbox";
import Divider from "@/components/base/Divider";
import Input from "@/components/base/Input";
import Modal, { ModalFooter, ModalHeader } from "@/components/base/Modal";
import MotionContainer from "@/components/base/MotionContainer";
import { Select } from "@/components/base/Select";
import Spinner from "@/components/base/Spinner";
import Subtext from "@/components/base/Subtext";
import Tab from "@/components/base/tabs/Tab";
import Tablist from "@/components/base/tabs/Tablist";
import FilamentPresetCard from "@/components/filament/FilamentPresetCard";
import CreateFilamentPresetModal from "@/components/modals/CreateFilamentPresetModal";
import EditAvatarModal from "@/components/modals/EditAvatarModal";
import { QRFieldSelector } from "@/components/modals/PrintFilamentQRModal";
import UserTag from "@/components/settings/UserTag";
import { logout } from "@/lib/auth";
import { filamentCardKeys, filamentTableKeys, getFilamentCardKey, getFilamentTableKey } from "@/lib/filamentKeys";
import { deleteFromArray, modifyArrayItem, moveArrayItem } from "@/lib/util/array";
import { toastError } from "@/lib/util/error";
import { useObjectState } from "@/lib/util/hooks";
import {
    FilamentPresetsRecord,
    UsersFilamentSortOptions,
    UsersLengthUnitOptions,
    UsersMassUnitOptions,
    UsersRecord,
    UsersTempUnitOptions,
} from "@/types/pb";
import { QRSettings } from "@/types/users";
import { startHolyLoader, stopHolyLoader } from "holy-loader";
import { ChevronDown, ChevronUp, Heart, Pencil, Plus, Save, Spool, Trash2, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

function FilamentKeyField({ title, onMove, onDelete }: { title: string, onMove: (dir: "up" | "down") => void, onDelete: () => void }) {
    return (<div className="flex items-center justify-between">
        <p>{title}</p>
        <div className="flex gap-1 items-center text-gray-500 *:cursor-pointer">
            <ChevronUp size={20} onClick={() => onMove("up")} />
            <ChevronDown size={20} onClick={() => onMove("down")} />
            <Trash2 size={20} onClick={onDelete} />
        </div>
    </div>);
}

export default function SettingsPage() {
    const user = pb.authStore.record as unknown as UsersRecord | null;

    if (!user)
        return null;

    const [userData, setUserData] = useObjectState({ ...user });
    const [filamentPresets, setFilamentPresets] = useState<FilamentPresetsRecord[]>([]);

    const [filamentCount, setFilamentCount] = useState<number>();
    const [storagesCount, setStoragesCount] = useState<number>();
    const [printsCount, setPrintsCount] = useState<number>();

    const [openModal, setOpenModal] = useState("");

    const [editing, setEditing] = useState(false);
    const [usernameInput, setUsernameInput] = useState(userData.name);

    const [deleteConfirmation, setDeleteConfirmation] = useState(false);

    async function updateSettings(newSettings: Partial<UsersRecord>) {
        startHolyLoader();
        await pb.collection("users").update(user!.id, { ...newSettings })
            .then(setUserData)
            .catch(e => {
                toastError("Could not update user", e);
            });
        stopHolyLoader();
    }

    async function deleteAccount() {
        if (!deleteConfirmation)
            return void setDeleteConfirmation(true);

        pb.collection("users").delete(user!.id)
            .then(logout);
    }

    useEffect(() => {
        pb.collection("filamentPresets").getFullList({
            filter: `user.id = "${user.id}"`,
        })
            .then(setFilamentPresets)
            .catch(e => toastError("Could not fetch filament presets", e));

        pb.collection("filament").getList()
            .then(res => setFilamentCount(res.totalItems))
            .catch(e => toastError("Could not fetch filament", e));

        pb.collection("storage").getList()
            .then(res => setStoragesCount(res.totalItems))
            .catch(e => toastError("Could not fetch filament", e));

        pb.collection("prints").getList()
            .then(res => setPrintsCount(res.totalItems))
            .catch(e => toastError("Could not fetch filament", e));
    }, []);

    useEffect(() => {
        setDeleteConfirmation(false);
    }, [openModal]);

    return (<>
        <MotionContainer>
            <Tablist tabs={{ account: "Account", preferences: "Preferences", appearance: "Appearance" }} activeTab="account">
                <Tab name="account" className="max-w-300">
                    <div className="bg-bg-light rounded-lg p-4 flex gap-2 w-fit mt-2 items-center">
                        <div className="relative w-full">
                            <img src={pb.files.getURL(userData, userData.avatar!)} className="rounded-full size-30 object-cover" />
                            <div className={`absolute inset-0 rounded-full opacity-0 hover:opacity-100 
                                transition-opacity bg-[#000000a4] cursor-pointer`}
                            onClick={() => setOpenModal("avatar")}>
                                <Pencil size={32} className="absolute-center" />
                            </div>
                        </div>
                        <div className="w-full">
                            <div className="flex gap-2 items-center">
                                {!editing && <h2>{userData.name}</h2>}
                                {editing && <Input value={usernameInput} onChange={e => setUsernameInput(e.target.value)} />}

                                {!editing && <Pencil
                                    className="text-gray-500 cursor-pointer"
                                    onClick={() => setEditing(true)}
                                />}
                                {editing && <>
                                    <Save
                                        className="text-primary cursor-pointer"
                                        onClick={() => {
                                            setEditing(false);
                                            updateSettings({ name: usernameInput });
                                        }}
                                    />
                                    <X
                                        className="text-danger cursor-pointer"
                                        onClick={() => {
                                            setEditing(false);
                                            setUsernameInput(userData.name);
                                        }}
                                    />
                                </>}
                            </div>
                            <div className="flex gap-1 items-center">
                                {userData.supporter && <UserTag hexColor="#ffb2cb"><Heart size={16} /> Supporter</UserTag>}
                                {userData.legacy && <UserTag hexColor="#0dd599"><Spool size={16} /> Early User</UserTag>}
                            </div>
                            <Divider />
                            <div className="w-full flex">
                                <Divider vertical />
                                <div>
                                    <h3>Filament</h3>
                                    <Divider />
                                    <h2>{filamentCount ?? <Spinner />}</h2>
                                </div>
                                <Divider vertical />
                                <div>
                                    <h3>Storages</h3>
                                    <Divider />
                                    <h2>{storagesCount ?? <Spinner />}</h2>
                                </div>
                                <Divider vertical />
                                <div>
                                    <h3>Prints</h3>
                                    <Divider />
                                    <h2>{printsCount ?? <Spinner />}</h2>
                                </div>
                                <Divider vertical />
                            </div>
                            <Divider />
                            <div className="*:w-full w-full flex gap-1">
                                <Button look={ButtonStyles.secondary} onClick={() => {
                                    logout();
                                    pb.authStore.clear();
                                }}>Log Out</Button>
                                <Button look={ButtonStyles.danger} onClick={() => setOpenModal("delete")}>Delete Account</Button>
                            </div>
                        </div>
                    </div>
                    <Link href="/about/privacy-policy">Privacy Policy</Link>
                </Tab>
                <Tab name="preferences" className="max-w-150">
                    <div>
                        <h2 className="mt-2">Defaults</h2>
                        <Subtext>The defaults for various options.</Subtext>

                        <Divider />

                        <p>Filament Sorting</p>
                        <Select
                            options={{
                                name: "Name",
                                color: "Color",
                                material: "Material",
                                brand: "Brand",
                                updated: "Recent",
                            }}
                            value={userData.filamentSort}
                            onChange={v => updateSettings({ filamentSort: v as UsersFilamentSortOptions })}
                        />

                        <p>Default QR code options</p>
                        <div className="bg-bg-light rounded-lg p-2">
                            <QRFieldSelector
                                fields={(userData.defaultQrSettings as QRSettings)?.fields ?? []}
                                onListUpdate={f => updateSettings({
                                    defaultQrSettings: { ...(userData.defaultQrSettings as object), fields: f },
                                })}
                            />

                            <p>Format</p>
                            <Select
                                options={{ PNG: "PNG", SVG: "SVG" }}
                                value={(userData.defaultQrSettings as QRSettings)?.format ?? "SVG"}
                                onChange={f => updateSettings({
                                    defaultQrSettings: { ...(userData.defaultQrSettings as object), format: f },
                                })}
                            />
                        </div>
                    </div>
                    <Divider />
                    <div>
                        <div className="flex justify-between items-center">
                            <h2>Filament Presets</h2>
                            <Button onClick={() => setOpenModal("filament-preset")}><Plus /></Button>
                        </div>
                        <Subtext>Presets you can use to autofill common values when making filament.</Subtext>

                        <div className="flex gap-2 flex-wrap">
                            {filamentPresets.map(p => <FilamentPresetCard
                                key={p.id} preset={p} onModify={p => setFilamentPresets(modifyArrayItem(filamentPresets, p, "id"))}
                                onDelete={() => setFilamentPresets(deleteFromArray(filamentPresets, p, "id"))}
                            />)}
                            {!filamentPresets.length && <p>You don't have any filament presets yet.</p>}
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

                        <p>Coming soon!</p>

                        {/* <div className="flex flex-col gap-2">
                            {userSettings.expand.customAttributes?.map(a => <CustomAttributeCard attribute={a} />)}
                        </div> */}
                    </div>

                    <Divider />

                    <Checkbox checked={userData.advancedView ?? false} onCheckedChange={c => updateSettings({ advancedView: c })}>
                        Advanced View
                    </Checkbox>
                </Tab>
                <Tab name="appearance" className="max-w-150">
                    {/* TODO: For the love of god this tab is awful. Split these into components */}
                    <h2>Filament Card/Table Display</h2>
                    <Subtext>Change data what is displayed on filament cards and tables.</Subtext>

                    <div className="bg-bg-light rounded-lg p-2 flex gap-2 w-fit">
                        <div>
                            <p>Card Fields</p>
                            <div className="flex flex-col gap-1 bg-bg-lighter rounded-lg p-2">
                                {((user.shownFilamentCardKeys ?? []) as string[]).map((key, i) => {
                                    const filamentKey = getFilamentCardKey(key);
                                    if (!filamentKey)
                                        return null;
                                    return <FilamentKeyField
                                        title={filamentKey.title}
                                        key={i}
                                        onMove={dir => updateSettings({
                                            shownFilamentCardKeys:
                                                moveArrayItem((user.shownFilamentCardKeys ?? []) as string[], i, dir),
                                        })}
                                        onDelete={() => updateSettings({
                                            shownFilamentCardKeys:
                                                deleteFromArray((user.shownFilamentCardKeys ?? []) as string[], key),
                                        })}
                                    />;
                                })}
                            </div>

                            <p>Add Fields</p>
                            <Select
                                options={{
                                    ...Object.fromEntries(
                                        filamentCardKeys.map(k => !((user.shownFilamentCardKeys as string[]) ?? []).includes(k.key) &&
                                        [k.key, k.title]
                                        ).filter(e => !!e)
                                    ),
                                }}
                                placeholder="Select a field to add"
                                value=""
                                onChange={v => updateSettings({
                                    shownFilamentCardKeys: [...((user.shownFilamentCardKeys ?? []) as string[]), v],
                                })}
                            />
                        </div>
                        <Divider vertical />
                        <div>
                            <p>Table Fields</p>
                            <div className="flex flex-col gap-1 bg-bg-lighter rounded-lg p-2">
                                {((user.shownFilamentTableKeys ?? []) as string[]).map((key, i) => {
                                    const filamentKey = getFilamentTableKey(key);
                                    if (!filamentKey)
                                        return null;
                                    return <FilamentKeyField
                                        title={filamentKey.title}
                                        key={i}
                                        onMove={dir => updateSettings({
                                            shownFilamentTableKeys:
                                                moveArrayItem((user.shownFilamentTableKeys ?? []) as string[], i, dir),
                                        })}
                                        onDelete={() => updateSettings({
                                            shownFilamentTableKeys:
                                                deleteFromArray((user.shownFilamentTableKeys ?? []) as string[], key),
                                        })}
                                    />;
                                })}
                            </div>

                            <p>Add Fields</p>
                            <Select
                                options={{
                                    ...Object.fromEntries(
                                        filamentTableKeys
                                            .map(k => !((user.shownFilamentTableKeys as string[]) ?? []).includes(k.key) &&
                                                [k.key, k.title]
                                            ).filter(e => !!e)
                                    ),
                                }}
                                placeholder="Select a field to add"
                                value=""
                                onChange={v => updateSettings({
                                    shownFilamentTableKeys: [...((user.shownFilamentTableKeys ?? []) as string[]), v],
                                })}
                            />
                        </div>
                    </div>

                    <Divider />

                    <h2 className="mt-2">Units</h2>
                    <Subtext>The default units that Filatrack will display.</Subtext>

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
                </Tab>
            </Tablist>

        </MotionContainer>

        <Modal title="Delete Filatrack Account" open={openModal === "delete"} onClose={() => setOpenModal("")} danger>
            <ModalHeader>Permanently delete your Filatrack account and all associated data.</ModalHeader>
            <h3>This action is permanent!</h3>
            <div className="whitespace-pre-wrap">
                Once deleted, your data can not be retrieved.{"\n"}
                All filament, storages, and prints will be permanently lost.{"\n"}
                {(userData.supporter || userData.legacy) && <>
                    You will also lose the following user tags:
                    <div className="flex gap-1 w-full justify-center">
                        {userData.supporter && <UserTag hexColor="#ffb2cb"><Heart size={16} /> Supporter</UserTag>}
                        {userData.legacy && <UserTag hexColor="#0dd599"><Spool size={16} /> Early User</UserTag>}
                    </div>
                    You may not get these back, even if you make a new account.{"\n"}
                </>}
                <b>Are you sure you want to continue?</b>
            </div>
            <ModalFooter>
                <Button onClick={() => setOpenModal("")}>Cancel</Button>
                <Button look={ButtonStyles.danger} className="text-nowrap" onClick={deleteAccount}>
                    {deleteConfirmation ? "Are you sure?" : "Delete Account"}
                </Button>
            </ModalFooter>
        </Modal>

        <EditAvatarModal
            open={openModal === "avatar"}
            onClose={() => setOpenModal("")}
        />

        <CreateFilamentPresetModal open={openModal === "filament-preset"} onClose={() => setOpenModal("")}
            onCreate={p => setFilamentPresets([...filamentPresets, p])} />
        {/* <CreateCustomAttributeModal open={openModal === "custom-attribute"} onClose={() => setOpenModal("")} /> */}
    </>);
}
