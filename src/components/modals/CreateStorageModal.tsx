import Modal, { ModalFooter, ModalHeader, ModalProps } from "../base/Modal";
import Input from "../base/Input";
import { useObjectState } from "@/lib/util/hooks";
import Button from "../base/Button";
import { useState } from "react";
import { Create } from "@/types/general";
import { StorageRecord } from "@/types/pb";
import { pb } from "@/api/pb";
import { StorageWithFilament } from "@/types/storage";

export default function CreateStorageModal(props: { onCreate?: (s: StorageWithFilament) => void } & ModalProps) {
    const user = pb.authStore.record;

    if (!user)
        return;

    const [storage, setStorage] = useObjectState<Create<StorageRecord>>({
        name: "",
        icon: "",
        filament: [],
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function createStorage() {
        setError("");

        if (!user)
            return void setError("Not authenticated");

        if (!storage.name)
            return void setError("Please fill out all required fields.");

        setLoading(true);

        await pb.collection("storage").create<StorageWithFilament>({ ...storage, user: user!.id }, { expand: "filament" })
            .then(res => {
                setLoading(false);
                setStorage({
                    name: "",
                    icon: "",
                    filament: [],
                });
                props.onClose();
                props.onCreate?.(res);
            })
            .catch(e => {
                console.error(e);
                setLoading(false);
                setError(e.message);
            });
    }

    return (
        <Modal {...props} title="Create Storage">
            <ModalHeader>Create a storage object to represent locations of your filament.</ModalHeader>

            <Input
                label="Name"
                placeholder="Drawer"
                value={storage.name}
                onChange={e => setStorage({ name: e.target.value })}
                maxLength={50}
                required
            />

            <Input
                label="Capacity"
                subtext="The maximum number of filament that can fit in this storage. Leave empty or 0 for unlimited."
                placeholder="0"
                value={storage.capacity ?? 0}
                onChange={e => setStorage({ capacity: parseInt(e.target.value) })}
                type="number"
            />

            <ModalFooter error={error}>
                <Button onClick={createStorage} loading={loading}>Create</Button>
            </ModalFooter>
        </Modal>
    );
}
