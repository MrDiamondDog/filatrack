import { useState } from "react";
import Button from "../base/Button";
import Input from "../base/Input";
import Modal, { ModalFooter, ModalHeader, ModalProps } from "../base/Modal";
import { useObjectState } from "@/lib/hooks";
import { MaterialPreset } from "@/types/settings";

export default function CreateMaterialPresetModal(props: ModalProps) {
    const [materialPreset, setMaterialPreset] = useObjectState<MaterialPreset>({
        user: "",
        material: "PLA",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function create() {
        setError("");

        if (!materialPreset.material)
            return void setError("Please fill out all required values.");

        setLoading(true);

        // TODO: backend
    }

    return <Modal {...props} title="Create Material Preset">
        <ModalHeader>Create a material preset to autofill common values when making filament.</ModalHeader>

        <Input
            label="Material"
            placeholder="PLA"
            required
            value={materialPreset.material}
            onChange={e => setMaterialPreset({ material: e.target.value })}
        />
        <Input
            label="Nozzle Temperature (°C)"
            value={materialPreset.nozzleTemperature}
            subtext="The nozzle temperature you print this filament at."
            onChange={e => setMaterialPreset({ nozzleTemperature: parseInt(e.target.value) })}
            type="number"
        />
        <Input
            label="Bed Temperature (°C)"
            value={materialPreset.bedTemperature}
            subtext="The best bed temperature for this material."
            onChange={e => setMaterialPreset({ bedTemperature: parseInt(e.target.value) })}
            type="number"
        />
        <Input
            label="Transmission Distance (TD)"
            value={materialPreset.transmissionDistance}
            subtext="A measure of how much light filament lets through."
            onChange={e => setMaterialPreset({ transmissionDistance: parseFloat(e.target.value) })}
            type="number"
        />
        <Input
            label="Flow Ratio"
            value={materialPreset.flowRatio}
            subtext="Determines how much more or less the extruder has to extrude to get the best quality."
            placeholder="1.00"
            onChange={e => setMaterialPreset({ flowRatio: parseFloat(e.target.value) })}
            type="number"
        />

        <ModalFooter>
            <Button>Create</Button>
        </ModalFooter>
    </Modal>;
}
