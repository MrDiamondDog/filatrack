import { useState } from "react";
import Modal, { ModalFooter, ModalHeader, ModalProps } from "../base/Modal";
import { pb } from "@/api/pb";
import { UsersRecord } from "@/types/pb";
import Button from "../base/Button";
import { toast } from "sonner";
import { toastError } from "@/lib/util/error";
import Subtext from "../base/Subtext";

export default function EditAvatarModal(props: ModalProps) {
    const user = pb.authStore.record as unknown as UsersRecord;

    const [file, setFile] = useState<File>();

    async function updateAvatar() {
        if (!file)
            return;

        if (!file.type.startsWith("image/") || (file.type !== "image/png" && file.type !== "image/jpeg"))
            return void toast.error("Invalid image. Please only upload PNGs or JPEGs.");

        pb.collection("users").update(user.id, { avatar: file })
            .then(props.onClose)
            .catch(e => toastError("Could not update avatar", e));
    }

    return <Modal {...props} title="Edit Avatar">
        <ModalHeader>Change your profile picture.</ModalHeader>
        <input
            type="file"
            className="file:bg-primary file:rounded-lg file:px-2 file:cursor-pointer h-fit"
            onChange={e => setFile(e.target.files?.[0])}
        />
        <Subtext className="text-xs">Max. 5mb</Subtext>

        {file && <img src={URL.createObjectURL(file)} className="mx-auto mt-2 rounded-full size-30 object-cover" />}

        <ModalFooter>
            <Button onClick={updateAvatar}>Submit</Button>
        </ModalFooter>
    </Modal>;
}
