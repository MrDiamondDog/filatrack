import { randomFilament } from "@/lib/util/random";
import Drawer from "../base/Drawer";
import Input from "../base/Input";
import Modal, { ModalFooter, ModalHeader, ModalProps } from "../base/Modal";
import { useEffect, useState } from "react";
import { useObjectState } from "@/lib/util/hooks";
import { Select } from "../base/Select";
import FilamentColorPicker from "../filament/FilamentColorPicker";
import FilamentMassPicker from "../filament/FilamentMassPicker";
import Button from "../base/Button";
import Divider from "../base/Divider";
import RequiredStar from "../base/RequiredStar";
import { FilamentPresetsRecord, FilamentRecord, FilamentSpoolTypeOptions } from "@/types/pb";
import { pb } from "@/api/pb";
import { Create } from "@/types/general";
import { StorageWithFilament } from "@/types/storage";
import StoragePicker from "../storage/StoragePicker";
import Subtext from "../base/Subtext";
import { analyticsEvent } from "@/lib/analytics";

type Props = {
    initial?: FilamentRecord;
    onCreate: (f: FilamentRecord) => void;
    storages: StorageWithFilament[];
    presets?: FilamentPresetsRecord[];
} & ModalProps;

export default function CreateFilamentModal(props: Props) {
    const user = pb.authStore.record;

    if (!user)
        return null;

    const [drawer, setDrawer] = useState(0);

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const [randomFilamentValues, _] = useState(randomFilament());

    const [filament, setFilament, reset] = useObjectState<Create<FilamentRecord>>(props.initial ?? {
        name: "",
        material: "",
        color: "#fff",
        brand: "",
        mass: 1000,
        initialMass: 1000,
        spoolType: FilamentSpoolTypeOptions.plastic,
    });

    const [preset, setPreset] = useState<FilamentPresetsRecord>();

    useEffect(() => {
        if (!props.initial)
            return;
        setFilament(props.initial);
    }, [props.initial]);

    useEffect(() => {
        reset();

        if (!preset)
            return;

        // @ts-ignore The types it's saying aren't compatible are, in fact, identical
        setFilament({ ...preset });
    }, [preset]);

    async function createFilament() {
        setError("");

        if (!user)
            return void setError("Not authenticated");

        if (!filament.name || !filament.material || !filament.color || !filament.mass || !filament.initialMass || !filament.spoolType)
            return void setError("Please fill out all required fields.");

        if (filament.mass > filament.initialMass || filament.mass < 0 || filament.initialMass < 0)
            return void setError("Invalid filament mass.");

        setLoading(true);

        analyticsEvent("FILAMENT_CREATE", { material: filament.material, brand: filament.brand });

        async function addToStorage(newFilament: FilamentRecord) {
            if (!filament.storage)
                return;
            return await pb.collection("storage").update(filament.storage, {
                "filament+": newFilament.id,
            });
        }

        if (!props.initial)
            await pb.collection("filament").create({ ...filament, user: user.id })
                .then(res => {
                    setLoading(false);
                    addToStorage(res);
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
            await pb.collection("filament").update(props.initial.id, { ...filament, user: user.id })
                .then(res => {
                    setLoading(false);
                    addToStorage(res);
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
        reset();
        props.onClose();
    }} title={props.initial ? "Edit Filament" : "Create Filament"}>
        <ModalHeader>{props.initial ? "Edit an existing filament roll." : "Add a new filament roll to your collection."}</ModalHeader>

        <div className="flex flex-col gap-2">
            {(!props.initial && !!props.presets?.length) &&
                <Select
                    options={props.presets.reduce(
                        (prev, curr) => ({ ...prev, [curr.id]: curr.name }),
                        { "": <Subtext>No preset selected</Subtext> }
                    )}
                    value={preset?.id ?? ""}
                    onChange={p => setPreset(props.presets!.find(pr => pr.id === p))}
                />
            }

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

                {!props.initial && <>
                    <p>Storage</p>
                    <StoragePicker
                        value={filament.storage ?? ""}
                        storages={props.storages}
                        onChange={s => setFilament({ storage: s.id })}
                    />
                </>}
            </Drawer>

            <Drawer label="Spool Details" open={drawer === 1} onChange={open => setDrawer(open ? 1 : -1)}>
                <FilamentMassPicker
                    values={{ mass: filament.mass ?? 0, initialMass: filament.initialMass }}
                    onChange={v => setFilament({ ...v })}
                />

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
            <Button onClick={createFilament} loading={loading}>{props.initial ? "Save" : "Create"}</Button>
        </ModalFooter>
    </Modal>;
}
