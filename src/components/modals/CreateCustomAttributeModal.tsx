import { useObjectState } from "@/lib/util/hooks";
import Modal, { ModalFooter, ModalHeader, ModalProps } from "../base/Modal";
import Tablist from "../base/tabs/Tablist";
import Input from "../base/Input";
import Button from "../base/Button";
import { CustomAttributesRecord, CustomAttributesTypeOptions } from "@/types/pb";
import { Create } from "@/types/general";

export default function CreateCustomAttributeModal(props: ModalProps) {
    const [customAttribute, setCustomAttribute] = useObjectState<Create<CustomAttributesRecord>>({
        name: "",
        type: CustomAttributesTypeOptions.string,
    });

    return (<Modal {...props} title="Create Custom Attribute">
        <ModalHeader>Create a custom attribute to track information that Filatrack doesn't.</ModalHeader>

        <Tablist
            tabs={{ string: "Text", number: "Number" }}
            activeTab={customAttribute.type}
            onTabChange={t => setCustomAttribute({ type: t as CustomAttributesTypeOptions })}
            className="bg-bg! w-full! *:w-full mb-2"
        />

        <Input
            label="Name"
            subtext="How this attribute should be displayed in the UI."
            placeholder="Density"
            value={customAttribute.name}
            onChange={e => setCustomAttribute({ name: e.target.value })}
            required
        />

        {customAttribute.type === "number" && <Input
            label="Units"
            subtext="The units to display with the value in the UI."
            placeholder="g/mm^3"
            value={customAttribute.units}
            onChange={e => setCustomAttribute({ units: e.target.value })}
        />}

        <ModalFooter>
            <Button>Create</Button>
        </ModalFooter>
    </Modal>);
}
