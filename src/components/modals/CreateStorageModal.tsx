import Modal, { ModalFooter, ModalHeader, ModalProps } from "../base/Modal";
import Input from "../base/Input";
import { useObjectState } from "@/lib/util/hooks";
import Button from "../base/Button";
import { useState } from "react";
import { Create } from "@/types/general";
import { StorageRecord } from "@/types/pb";
import { pb } from "@/api/pb";

export default function CreateStorageModal(props: ModalProps) {
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

        await pb.collection("storage").create({ ...storage, user: user!.id })
            .then(() => {
                setLoading(false);
                setStorage({
                    name: "",
                    icon: "",
                    filament: [],
                });
                props.onClose();
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
                placeholder="Rack"
                value={storage.name}
                onChange={e => setStorage({ name: e.target.value })}
                maxLength={50}
                required
            />

            <ModalFooter error={error}>
                <Button onClick={createStorage} loading={loading}>Create</Button>
            </ModalFooter>
        </Modal>
    );
}
