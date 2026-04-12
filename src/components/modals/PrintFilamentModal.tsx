import Modal, { ModalFooter, ModalHeader, ModalProps } from "../base/Modal";
import Input from "../base/Input";
import { useObjectState } from "@/lib/util/hooks";
import Button from "../base/Button";
import { useState } from "react";
import FilamentCard from "../filament/FilamentCard";
import { grams } from "@/lib/util/units";
import Link from "next/link";
import { FilamentRecord, PrintsRecord, UsersRecord } from "@/types/pb";
import { Create } from "@/types/general";
import { pb } from "@/api/pb";

type Props = {
    filament: FilamentRecord;
    onPrintCreate: (p: PrintsRecord) => void;
} & ModalProps;

export default function PrintFilamentModal({ filament, onPrintCreate, ...props }: Props) {
    const user = pb.authStore.record as unknown as UsersRecord;

    if (!user)
        return null;

    const [print, setPrint] = useObjectState<Create<PrintsRecord<Record<string, number>>>>({
        filamentRolls: [filament.id],
        filamentUsage: { [filament.id]: 0 },

        label: "",
        totalFilamentUsed: 0,
        totalRollsUsed: 1,
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function printFilament() {
        setError("");

        if (!print.filamentUsage)
            return void setError("Please fill out all required fields.");

        setLoading(true);

        const newPrint = await pb.collection("prints").create({
            user: user.id,
            ...print,
        });

        await pb.collection("filament").update(filament.id, {
            mass: (filament.mass ?? 0) - print.totalFilamentUsed,
        })
            .then(() => {
                setLoading(false);
                setPrint({
                    filamentRolls: [filament.id],
                    filamentUsage: { [filament.id]: 0 },

                    label: "",
                    totalFilamentUsed: 0,
                    totalRollsUsed: 1,
                });
                props.onClose();
                onPrintCreate(newPrint);
            })
            .catch(e => {
                console.error(e);
                setLoading(false);
                setError(e.message);
            });;
    }

    return <Modal {...props} title="Print Filament">
        <ModalHeader>
            Log how much filament you used to keep track of how much you have left.<br />
            If you want to make a print with multiple filaments, go <Link href="/app/prints">here</Link>.
        </ModalHeader>

        <div className="flex md:flex-row flex-col items-center gap-2">
            <FilamentCard filament={filament} noninteractable className="bg-bg-lighter" storagesList={[]} />

            <div>
                <Input
                    label="Filament Used (g)"
                    subtext="Include any waste."
                    type="number"
                    value={print.filamentUsage?.[filament.id] ?? ""}
                    onChange={e => setPrint({
                        filamentUsage: { [filament.id]: parseInt(e.target.value) },
                        totalFilamentUsed: parseInt(e.target.value),
                    })}
                    required
                    autoFocus
                />

                <Input
                    label="Label"
                    subtext="An additional note to later identify what this log was for."
                    value={print.label}
                    onChange={e => setPrint({ label: e.target.value })}
                />

                <p>You will have{" "}
                    {grams((filament.mass ?? 0) - (print.totalFilamentUsed ?? 0))}/{grams(filament.initialMass)} remaining.
                </p>
            </div>
        </div>

        <ModalFooter error={error}>
            <Button onClick={printFilament} loading={loading}>Log</Button>
        </ModalFooter>
    </Modal>;
}
