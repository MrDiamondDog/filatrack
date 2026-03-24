import { randomFilament } from "@/lib/util/random";
import Drawer from "../base/Drawer";
import Input from "../base/Input";
import Modal, { ModalFooter, ModalHeader, ModalProps } from "../base/Modal";
import { useState } from "react";
import { useObjectState } from "@/lib/util/hooks";
import { Select } from "../base/Select";
import FilamentColorPicker from "../filament/FilamentColorPicker";
import Button from "../base/Button";
import { pb } from "@/api/pb";
import { Create } from "@/types/general";
import { FilamentPresetsRecord, FilamentPresetsSpoolTypeOptions } from "@/types/pb";

export default function CreateFilamentPresetModal(props: ModalProps & { initial?: FilamentPresetsRecord,
    onCreate: (f: FilamentPresetsRecord) => void }) {
    const user = pb.authStore.record;

    if (!user)
        return null;

    const [drawer, setDrawer] = useState(0);

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const [randomFilamentValues, _] = useState(randomFilament());

    const [preset, setPreset, reset] = useObjectState<Create<FilamentPresetsRecord>>(props.initial ?? {
        name: "",
        color: "#000",
    });

    async function createPreset() {
        setError("");

        if (!user)
            return void setError("Not authenticated");

        if (!preset.name)
            return void setError("Please fill out all required fields.");

        setLoading(true);

        if (!props.initial)
            await pb.collection("filamentPresets").create({ ...preset, user: user.id })
                .then(res => {
                    setLoading(false);
                    reset();
                    props.onClose();
                    props.onCreate(res);
                })
                .catch(e => {
                    console.error(e);
                    setLoading(false);
                    setError(e.message);
                });
        else
            await pb.collection("filamentPresets").update(props.initial.id, { ...preset, user: user.id })
                .then(res => {
                    setLoading(false);
                    props.onClose();
                    props.onCreate(res);
                })
                .catch(e => {
                    console.error(e);
                    setLoading(false);
                    setError(e.message);
                });
    }

    return <Modal {...props} onClose={() => {
        setDrawer(0);
        props.onClose();
    }} title={props.initial ? "Edit Filament Preset" : "Create Filament Preset"}>
        <ModalHeader>{props.initial ? "Edit an existing filament preset" :
            "Create a filament preset to autofill common settings when creating filament."}</ModalHeader>

        <div className="flex flex-col gap-2">
            <Drawer label="Basic Details" open={drawer === 0} onChange={open => setDrawer(open ? 0 : -1)}>
                <Input
                    label="Name"
                    placeholder={randomFilamentValues.name}
                    value={preset.name}
                    onChange={e => setPreset({ name: e.target.value })}
                    maxLength={50}
                    required
                />
                <Input
                    label="Material"
                    placeholder={randomFilamentValues.material}
                    value={preset.material}
                    onChange={e => setPreset({ material: e.target.value })}
                    maxLength={25}
                />
                <Input
                    label="Brand"
                    placeholder={randomFilamentValues.brand}
                    value={preset.brand}
                    onChange={e => setPreset({ brand: e.target.value })}
                    maxLength={50}
                />

                <p>Color</p>
                <FilamentColorPicker value={preset.color ?? "#000"} onChange={color => setPreset({ color })}/>
            </Drawer>

            <Drawer label="Spool Details" open={drawer === 1} onChange={open => setDrawer(open ? 1 : -1)}>
                <Input
                    label="Initial Mass (g)"
                    placeholder=""
                    type="number"
                    value={preset.initialMass}
                    onChange={e => setPreset({ initialMass: parseInt(e.target.value) })}
                />

                <p>Spool Type</p>
                <Select
                    options={{ plastic: "Plastic Spool", cardboard: "Cardboard Spool", refill: "Refill", nospool: "No Spool" }}
                    value={preset.spoolType ?? "full"}
                    onChange={v => setPreset({ spoolType: v as FilamentPresetsSpoolTypeOptions })}
                />

                <Input
                    label="Purchase Link"
                    placeholder=""
                    value={preset.purchaseLink}
                    onChange={e => setPreset({ purchaseLink: e.target.value })}
                />

                <Input
                    label="Price"
                    placeholder=""
                    value={preset.cost}
                    type="number"
                    onChange={e => setPreset({ cost: parseFloat(e.target.value) })}
                />

                <Input
                    label="Notes"
                    placeholder=""
                    value={preset.note}
                    onChange={e => setPreset({ note: e.target.value })}
                    maxLength={200}
                />
            </Drawer>

            <Drawer label="Filament Details" open={drawer === 2} onChange={open => setDrawer(open ? 2 : -1)}>
                <Input
                    label="Nozzle Temperature (°C)"
                    value={preset.nozzleTemperature}
                    onChange={e => setPreset({ nozzleTemperature: parseInt(e.target.value) })}
                    type="number"
                />
                <Input
                    label="Bed Temperature (°C)"
                    value={preset.bedTemperature}
                    onChange={e => setPreset({ bedTemperature: parseInt(e.target.value) })}
                    type="number"
                />
                <Input
                    label="Transmission Distance (TD)"
                    value={preset.transmissionDistance}
                    subtext="A measure of how much light filament lets through."
                    onChange={e => setPreset({ transmissionDistance: parseFloat(e.target.value) })}
                    type="number"
                />
                <Input
                    label="Flow Ratio"
                    value={preset.flowRatio}
                    subtext={`Determines how much more or less the extruder has to extrude to get the best quality. 
                Varies from printer to printer.`}
                    placeholder="1.00"
                    onChange={e => setPreset({ flowRatio: parseFloat(e.target.value) })}
                    type="number"
                />
            </Drawer>
        </div>

        <ModalFooter error={error}>
            <Button onClick={createPreset} loading={loading}>{props.initial ? "Save" : "Create"}</Button>
        </ModalFooter>
    </Modal>;
}
