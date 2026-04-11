import Button, { ButtonStyles } from "../base/Button";
import Modal, { ModalFooter, ModalHeader, ModalProps } from "../base/Modal";

type Props = {
    preview: React.ReactNode;
    object: string;
    plural?: boolean;
    onDelete: () => void;
} & ModalProps;

export function DeleteModal({ preview, object, plural, onDelete, ...props }: Props) {
    return <Modal title={`Delete ${object}`} {...props} danger>
        <ModalHeader>Permanently delete {object}.</ModalHeader>

        Are you sure you want to delete {plural ? "these" : "this"} {object}?

        {preview}

        This cannot be undone.

        <ModalFooter>
            <Button look={ButtonStyles.secondary} onClick={props.onClose}>Cancel</Button>
            <Button look={ButtonStyles.danger} onClick={onDelete}>Delete</Button>
        </ModalFooter>
    </Modal>;
}
