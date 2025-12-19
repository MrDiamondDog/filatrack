"use client";

import { useEffect, useState } from "react";
import Modal, { ModalFooter, ModalProps } from "../Modal";
import Subtext from "../Subtext";
import Divider from "../Divider";
import Input from "../Input";
import Button, { ButtonStyles } from "../Button";
import { useObjectState } from "@/lib/hooks";
import MaterialPicker from "./MaterialPicker";
import MassPicker from "./MassPicker";
import { Filament, UserSettings } from "@/db/types";
import Spinner from "../Spinner";
import FilamentColorPicker, { filamentColors } from "./ColorPicker";
import { randomFrom } from "@/lib/random";
import { DBObjectParams, ApiRes } from "@/lib/db/types";
import { app } from "@/lib/db";
import Drawer from "../Drawer";
import { handleApiError } from "@/lib/errors";

export default function AddFilamentModal({ onAdd, currentFilament, open, onClose, userSettings, boxId }:
    ModalProps & {
        currentFilament?: Filament,
        onAdd?: (filament: Filament | Filament[]) => void,
        userSettings: UserSettings,
        boxId?: string,
     }) {
    const [step, setStep] = useState(-1);

    const [amountToCreate, setAmountToCreate] = useState("1");

    const [filamentData, setFilamentData] = useObjectState<DBObjectParams<Omit<Filament, "shortId">>>(currentFilament ?? {
        name: "",
        brand: "",
        color: randomFrom(filamentColors),
        material: userSettings.defaultMaterial,
        note: "",
        index: 0,

        printingTemperature: null,
        diameter: null,
        cost: null,

        box: boxId ?? null,

        currentMass: userSettings.defaultMass,
        startingMass: userSettings.defaultMass,

        lastUsed: new Date(0),
    });

    function reset() {
        setFilamentData({
            name: "",
            brand: "",
            color: randomFrom(filamentColors),
            material: userSettings?.defaultMaterial ?? "PLA",
            note: "",

            printingTemperature: null,
            diameter: null,
            cost: null,

            box: boxId ?? null,

            currentMass: userSettings?.defaultMass ?? 1000,
            startingMass: userSettings?.defaultMass ?? 1000,

            lastUsed: new Date(0),
        });
        setStep(0);
        setError("");
        setAmountToCreate("1");
    }

    const [error, setError] = useState("");
    const [requiredError, setRequiredError] = useState(false);
    const [loading, setLoading] = useState(false);

    async function addFilament() {
        setError("");
        setRequiredError(false);

        if (!filamentData.name || !filamentData.color || !filamentData.material) {
            setError("You must fill out all required fields");
            setRequiredError(true);
            return;
        }

        if (!(/^#(?:[0-9a-fA-F]{3}){1,2}$/).test(filamentData.color)) {
            setError("Invalid color hex code.");
            return;
        }

        setLoading(true);

        const res = currentFilament ?
            await app.filament.editFilament(currentFilament.id, filamentData) :
            await app.filament.createFilament(filamentData);

        let copiesRes: ApiRes<Filament[]> | null = null;
        if (!currentFilament && parseInt(amountToCreate) > 1 && !Number.isNaN(parseInt(amountToCreate)))
            copiesRes = await app.filament.createMultipleFilament(filamentData, parseInt(amountToCreate) - 1);

        if (res.error || copiesRes?.error) {
            setError(handleApiError(res.error ?? copiesRes?.error!));
            setLoading(false);
            return;
        }

        setLoading(false);
        onClose();

        onAdd?.([res.data, ...(copiesRes?.data ?? [])]);
    }

    useEffect(() => {
        reset();

        if (currentFilament)
            setFilamentData(currentFilament);
    }, [open]);

    useEffect(() => {
        if (parseInt(amountToCreate) > 50)
            setAmountToCreate("50");
    }, [amountToCreate]);

    return (<>
        <Modal open={open} onClose={onClose} title={`${currentFilament ? "Edit" : "Add"} Filament`}>
            <Subtext>
                {currentFilament ? "Edit this filament's properties." : "Add a new filament to start tracking it's usage."}
            </Subtext>
            <Divider />

            {step === -1 && <Spinner />}

            {step === 0 && <>
                <Input
                    label="Name"
                    value={filamentData.name}
                    onChange={e => setFilamentData({ name: e.target.value })}
                    error={(requiredError && !filamentData.name) && "This field is required"}
                    maxLength={32}
                    placeholder="Basic Green, Matte Black, etc."
                />
                <Input
                    label="Brand"
                    value={filamentData.brand}
                    onChange={e => setFilamentData({ brand: e.target.value })}
                    maxLength={32}
                    placeholder="Bambu Lab, Elegoo, etc."
                />

                <Input label="Notes" value={filamentData.note} onChange={e => setFilamentData({ note: e.target.value })} />
                {!currentFilament && <>
                    <Input
                        label="Amount To Create (total)"
                        type="number"
                        value={amountToCreate}
                        onChange={e => setAmountToCreate(e.target.value)}
                    />
                    <Subtext>The amount of this filament to create, total. (max 50)</Subtext>
                </>}

                <p>Color</p>
                <FilamentColorPicker value={filamentData.color} onChange={c => setFilamentData({ color: c })} />
            </>}

            {step === 1 && <>
                <p>Material</p>
                <MaterialPicker
                    value={filamentData.material}
                    onChange={m => setFilamentData({ material: m })}
                    userSettings={userSettings}
                />
            </>}

            {step === 2 && <>
                <MassPicker values={filamentData} onChange={setFilamentData} />

                <Drawer label="Optional Info">
                    <Input
                        label="Printing Temperature (°C)"
                        type="number"
                        value={filamentData.printingTemperature ?? ""}
                        onChange={e => setFilamentData({ printingTemperature: !e.target.value ? null : parseInt(e.target.value) })}
                    />
                    <Input
                        label="Diameter (mm)"
                        type="number"
                        value={filamentData.diameter ?? ""}
                        onChange={e => setFilamentData({ diameter: !e.target.value ? null : parseFloat(e.target.value) })}
                    />
                    <Input
                        label="Cost"
                        type="number"
                        value={filamentData.cost ?? ""}
                        onChange={e => setFilamentData({ cost: !e.target.value ? null : parseFloat(e.target.value) })}
                    />
                </Drawer>
            </>}

            <ModalFooter error={error}>
                {step > 0 && <>
                    <Button onClick={() => setStep(Math.max(0, step - 1))} look={ButtonStyles.secondary}>
                        Previous
                    </Button>
                </>}
                <Button onClick={() => (step === 2 ? addFilament() : setStep(step + 1))} loading={loading}
                    data-rybbit-event={step === 2 ? "create-filament" : undefined}
                >
                    {step === 2 ? (currentFilament ? "Edit" : "Add") : "Next"}
                </Button>
            </ModalFooter>
        </Modal>
    </>);
}
