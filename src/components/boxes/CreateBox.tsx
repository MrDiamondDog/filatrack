import { Box } from "@/db/types";
import Modal, { ModalFooter, ModalProps } from "../Modal";
import Subtext from "../Subtext";
import Divider from "../Divider";
import Input from "../Input";
import { useState } from "react";
import Button from "../Button";
import { app } from "@/lib/db";
import { handleApiError } from "@/lib/errors";
import { ApiRes } from "@/lib/db/types";

export default function CreateBoxModal({ onAdd, currentBox, ...props }: { onAdd: (box: Box) => void, currentBox?: Box } & ModalProps) {
    const [name, setName] = useState(currentBox?.name ?? "");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function addBox() {
        setError("");
        setLoading(true);

        let res: ApiRes<Box> | null = null;

        if (!currentBox)
            res = await app.boxes.createBox({
                name,
                index: 999,
                filamentIds: [],
            });
        else
            res = await app.boxes.editBox(currentBox.id, {
                name,
            });

        if (res.error) {
            setError(handleApiError(res.error));
            setLoading(false);
            return;
        }

        onAdd(res.data);
        props.onClose();
        setLoading(false);
        setName("");
    }

    return (<Modal {...props} title="Create Box">
        <Subtext>Create a filament box to organize your filament!</Subtext>
        <Divider />

        <Input
            label="Name"
            value={name}
            maxLength={48}
            onChange={e => setName(e.target.value)}
        />

        <ModalFooter error={error}>
            <Button onClick={addBox} loading={loading} data-rybbit-event="create-box">Create</Button>
        </ModalFooter>
    </Modal>);
}
