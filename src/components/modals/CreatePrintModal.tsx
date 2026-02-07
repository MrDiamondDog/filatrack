import { useState } from "react";
import Modal, { ModalFooter, ModalHeader, ModalProps } from "../base/Modal";
import FilamentPicker from "../filament/FilamentPicker";
import Drawer from "../base/Drawer";
import Input from "../base/Input";
import FilamentMiniRow from "../filament/FilamentMiniRow";
import Divider from "../base/Divider";
import Button from "../base/Button";
import Subtext from "../base/Subtext";
import { grams } from "@/lib/util/units";
import { FilamentRecord, UsersRecord } from "@/types/pb";
import { pb } from "@/api/pb";

export default function CreatePrintModal({ ...props }: ModalProps) {
    const user = pb.authStore.record as unknown as UsersRecord;

    const [selectedFilament, setSelectedFilament] = useState<FilamentRecord[]>([]);
    const [drawer, setDrawer] = useState(0);
    const [filamentUsed, setFilamentUsed] = useState<Record<string, number>>({});
    const [label, setLabel] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function createPrint() {
        setError("");

        if (selectedFilament.length === 0)
            return void setError("Please select one or more filament.");

        console.log(Object.values(filamentUsed), Object.values(filamentUsed).filter(v => !v));

        if (Object.values(filamentUsed).filter(v => !v || v <= 0).length > 0)
            return void setError("Please fill out all required fields.");

        setLoading(true);

        await pb.collection("prints").create({
            label,
            user: user.id,
            filamentRolls: selectedFilament.map(f => f.id),
            filamentUsage: filamentUsed,
            totalFilamentUsed: Object.values(filamentUsed).reduce((prev, curr) => prev + curr),
            totalRollsUsed: selectedFilament.length,
        })
            .then(() => {
                setLoading(false);
                setLabel("");
                setDrawer(0);
                setSelectedFilament([]);
                props.onClose();
            })
            .catch(e => {
                console.error(e);
                setLoading(false);
                setError(e.message);
            });
    }

    return (<Modal {...props} title="Create Print">
        <ModalHeader>Create a print to accurately keep track of how much filament you've used.</ModalHeader>

        <div className="flex flex-col gap-2">
            <Input label="Name" placeholder="What did you print?" value={label} onChange={e => setLabel(e.target.value)} />

            <Drawer label="Select Filament Used" open={drawer === 0} onChange={open => setDrawer(open ? 0 : -1)}>
                <FilamentPicker values={selectedFilament} onChange={setSelectedFilament} />
            </Drawer>

            <Drawer label="Filament Usage" open={drawer === 1} onChange={open => setDrawer(open ? 1 : -1)}>
                <div className="flex flex-col gap-2">
                    {selectedFilament.map(f => <div
                        className="flex flex-col gap-1 w-full"
                        key={f.id}
                    >
                        <FilamentMiniRow filament={f} />
                        <Input
                            placeholder="Filament Used (g)"
                            type="number"
                            value={filamentUsed[f.id] ?? ""}
                            onChange={e => setFilamentUsed({ ...filamentUsed, [f.id]: parseInt(e.target.value) })}
                        />
                        <Divider />
                    </div>)}
                </div>

                <div className="flex gap-1 justify-center">
                    <div className="text-center">
                        <Subtext>Total Filament Used</Subtext>
                        {grams(Object.values(filamentUsed).reduce((prev, curr) => prev + curr, 0))}
                    </div>
                    <Divider vertical />
                    <div className="text-center"><Subtext>Total Rolls Used</Subtext> {selectedFilament.length}</div>
                </div>
            </Drawer>
        </div>

        <ModalFooter error={error}>
            <Button onClick={createPrint} loading={loading}>Create</Button>
        </ModalFooter>
    </Modal>);
}
