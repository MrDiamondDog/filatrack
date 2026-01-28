import { randomFilament } from "@/lib/random";
import Drawer from "../base/Drawer";
import Input from "../base/Input";
import Modal, { ModalFooter, ModalHeader, ModalProps } from "../base/Modal";
import { useState } from "react";
import { Filament } from "@/types/filament";
import { useObjectState } from "@/lib/hooks";
import { Select } from "../base/Select";
import FilamentColorPicker from "../filament/FilamentColorPicker";
import FilamentMassPicker from "../filament/FilamentMassPicker";
import Button from "../base/Button";
import Divider from "../base/Divider";
import RequiredStar from "../base/RequiredStar";

export default function CreateFilamentModal(props: ModalProps) {
    const [drawer, setDrawer] = useState(0);

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const [randomFilamentValues, _] = useState(randomFilament());

    const [filament, setFilament] = useObjectState<Omit<Filament, "id" | "user" | "created" | "updated">>({
        name: "",
        material: "",
        color: "#fff",
        mass: 1000,
        initialMass: 1000,
        spoolType: "plastic",
    });

    function createFilament() {
        setError("");

        if (!filament.name || !filament.material || !filament.color || !filament.mass || !filament.initialMass || !filament.spoolType)
            return void setError("Please fill out all required fields.");

        if (filament.mass > filament.initialMass || filament.mass < 0 || filament.initialMass < 0)
            return void setError("Invalid filament mass.");

        setLoading(true);

        // TODO: backend implementation
    }

    return <Modal {...props} onClose={() => {
        setDrawer(0);
        props.onClose();
    }} title="Create Filament">
        <ModalHeader>Add a new filament roll to your collection.</ModalHeader>

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
                    onChange={v => setFilament({ spoolType: v as keyof Filament["spoolType"] })}
                />

                <Input
                    label="Purchase Link"
                    placeholder=""
                    value={filament.link}
                    onChange={e => setFilament({ link: e.target.value })}
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
                    label="Temperature (°C)"
                    placeholder="200"
                    type="number"
                    value={filament.temperature}
                    onChange={e => setFilament({ temperature: parseInt(e.target.value) })}
                />

                <Input
                    label="Diameter (mm)"
                    placeholder="1.75"
                    type="number"
                    value={filament.diameter}
                    onChange={e => setFilament({ diameter: parseInt(e.target.value) })}
                />
            </Drawer>
        </div>

        <ModalFooter error={error}>
            <Button onClick={createFilament} loading={loading}>Create</Button>
        </ModalFooter>
    </Modal>;
}
