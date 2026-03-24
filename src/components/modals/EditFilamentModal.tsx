import { randomFilament } from "@/lib/util/random";
import Drawer from "../base/Drawer";
import Input from "../base/Input";
import Modal, { ModalFooter, ModalHeader, ModalProps } from "../base/Modal";
import { useState } from "react";
import { useObjectState } from "@/lib/util/hooks";
import { Select } from "../base/Select";
import FilamentColorPicker from "../filament/FilamentColorPicker";
import FilamentMassPicker from "../filament/FilamentMassPicker";
import Button from "../base/Button";
import Divider from "../base/Divider";
import RequiredStar from "../base/RequiredStar";
import { FilamentRecord, FilamentSpoolTypeOptions } from "@/types/pb";
import { pb } from "@/api/pb";

export default function EditFilamentModal(props: ModalProps & { filament: FilamentRecord, onModify: (f: FilamentRecord) => void }) {
    const user = pb.authStore.record;

    if (!user)
        return null;

    const [drawer, setDrawer] = useState(0);

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const [randomFilamentValues, _] = useState(randomFilament());

    const [filament, setFilament, reset] = useObjectState<FilamentRecord>(props.filament);

    async function editFilament() {
        setError("");

        if (!user)
            return void setError("Not authenticated");

        if (!filament.name || !filament.material || !filament.color || !filament.mass || !filament.initialMass || !filament.spoolType)
            return void setError("Please fill out all required fields.");

        if (filament.mass > filament.initialMass || filament.mass < 0 || filament.initialMass < 0)
            return void setError("Invalid filament mass.");

        setLoading(true);

        await pb.collection("filament").update(filament.id, { ...filament })
            .then(res => {
                setLoading(false);
                reset();
                props.onClose();
                props.onModify(res);
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
    }} title="Edit Filament">
        <ModalHeader>Modify an existing filament's options.</ModalHeader>

        <div className="flex flex-col gap-2">
            <Drawer label="Basic Details" open={drawer === 0} onChange={open => setDrawer(open ? 0 : -1)}>
                <Input
                    label="Name"
                    placeholder={randomFilamentValues.name}
                    value={filament.name}
                    onChange={e => setFilament({ name: e.target.value })}
                    maxLength={50}
                    required
                />
                <Input
                    label="Material"
                    placeholder={randomFilamentValues.material}
                    value={filament.material}
                    onChange={e => setFilament({ material: e.target.value })}
                    maxLength={25}
                    required
                />
                <Input
                    label="Brand"
                    placeholder={randomFilamentValues.brand}
                    value={filament.brand}
                    onChange={e => setFilament({ brand: e.target.value })}
                    maxLength={50}
                />

                <p>Color<RequiredStar /></p>
                <FilamentColorPicker value={filament.color} onChange={color => setFilament({ color })}/>
            </Drawer>

            <Drawer label="Spool Details" open={drawer === 1} onChange={open => setDrawer(open ? 1 : -1)}>
                <FilamentMassPicker values={filament} onChange={v => setFilament({ ...v })} />

                <Divider />

                <p>Spool Type<RequiredStar /></p>
                <Select
                    options={{ plastic: "Plastic Spool", cardboard: "Cardboard Spool", refill: "Refill", nospool: "No Spool" }}
                    value={filament.spoolType ?? "full"}
                    onChange={v => setFilament({ spoolType: v as FilamentSpoolTypeOptions })}
                />

                <Input
                    label="Purchase Link"
                    placeholder=""
                    value={filament.purchaseLink}
                    onChange={e => setFilament({ purchaseLink: e.target.value })}
                />

                <Input
                    label="Price"
                    placeholder=""
                    type="number"
                    value={filament.cost}
                    onChange={e => setFilament({ cost: parseInt(e.target.value) })}
                />

                <Input
                    label="Notes"
                    placeholder=""
                    value={filament.note}
                    onChange={e => setFilament({ note: e.target.value })}
                    maxLength={200}
                />
            </Drawer>

            <Drawer label="Filament Details" open={drawer === 2} onChange={open => setDrawer(open ? 2 : -1)}>
                <Input
                    label="Nozzle Temperature (°C)"
                    value={filament.nozzleTemperature}
                    onChange={e => setFilament({ nozzleTemperature: parseInt(e.target.value) })}
                    type="number"
                />
                <Input
                    label="Bed Temperature (°C)"
                    value={filament.bedTemperature}
                    onChange={e => setFilament({ bedTemperature: parseInt(e.target.value) })}
                    type="number"
                />
                <Input
                    label="Transmission Distance (TD)"
                    value={filament.transmissionDistance}
                    subtext="A measure of how much light filament lets through."
                    onChange={e => setFilament({ transmissionDistance: parseFloat(e.target.value) })}
                    type="number"
                />
                <Input
                    label="Flow Ratio"
                    value={filament.flowRatio}
                    subtext={`Determines how much more or less the extruder has to extrude to get the best quality. 
                Varies from printer to printer.`}
                    placeholder="1.00"
                    onChange={e => setFilament({ flowRatio: parseFloat(e.target.value) })}
                    type="number"
                />
            </Drawer>
        </div>

        <ModalFooter error={error}>
            <Button onClick={editFilament} loading={loading}>Save</Button>
        </ModalFooter>
    </Modal>;
}
