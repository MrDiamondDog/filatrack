import Modal, { ModalFooter, ModalHeader, ModalProps } from "../base/Modal";
import Input from "../base/Input";
import { useObjectState } from "@/lib/hooks";
import { Storage } from "@/types/storage";
import Button from "../base/Button";
import { useState } from "react";

export default function CreateStorageModal(props: ModalProps) {
    const [storage, setStorage] = useObjectState<Omit<Storage, "id" | "user" | "created" | "updated">>({
        name: "",
        icon: "",
        filament: [],
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    function createStorage() {
        setError("");

        if (!storage.name)
            return void setError("Please fill out all required fields.");

        setLoading(true);

        // TODO: backend
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
