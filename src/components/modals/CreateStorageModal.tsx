import Modal, { ModalFooter, ModalHeader, ModalProps } from "../base/Modal";
import Input from "../base/Input";
import { useObjectState } from "@/lib/util/hooks";
import Button from "../base/Button";
import { useEffect, useState } from "react";
import { Create } from "@/types/general";
import { StorageRecord } from "@/types/pb";
import { pb } from "@/api/pb";
import { StorageWithFilament } from "@/types/storage";

type Props = {
    initial?: StorageRecord;
    onCreate?: (s: StorageWithFilament) => void;
    onModify?: (s: StorageWithFilament) => void;
} & ModalProps;

export default function CreateStorageModal(props: Props) {
    const user = pb.authStore.record;

    if (!user)
        return;

    const [storage, setStorage, reset] = useObjectState<Create<StorageRecord>>(props.initial ?? {
        name: "",
        filament: [],
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!props.initial)
            return;
        setStorage(props.initial);
    }, [props.initial]);

    async function createStorage() {
        setError("");

        if (!user)
            return void setError("Not authenticated");

        if (!storage.name)
            return void setError("Please fill out all required fields.");

        setLoading(true);

        if (!props.initial)
            await pb.collection("storage").create<StorageWithFilament>({ ...storage, user: user!.id }, { expand: "filament" })
                .then(res => {
                    setLoading(false);
                    reset();
                    props.onClose();
                    props.onCreate?.(res);
                })
                .catch(e => {
                    console.error(e);
                    setLoading(false);
                    setError(e.message);
                });
        else
            await pb.collection("storage").update<StorageWithFilament>(
                props.initial.id, { ...storage, user: user!.id },
                { expand: "filament" }
            )
                .then(res => {
                    setLoading(false);
                    props.onClose();
                    props.onModify?.(res);
                })
                .catch(e => {
                    console.error(e);
                    setLoading(false);
                    setError(e.message);
                });
    }

    return (
        <Modal {...props} title={props.initial ? "Edit Storage" : "Create Storage"}>
            <ModalHeader>
                {props.initial ? "Edit an existing storage object." :
                    "Create a storage object to represent locations of your filament."}
            </ModalHeader>

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
