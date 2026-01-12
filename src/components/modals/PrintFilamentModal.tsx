import { Filament } from "@/types/filament";
import Modal, { ModalFooter, ModalHeader, ModalProps } from "../base/Modal";
import Input from "../base/Input";
import { useObjectState } from "@/lib/hooks";
import Button from "../base/Button";
import { useState } from "react";
import FilamentCard from "../filament/FilamentCard";
import { grams } from "@/lib/units";
import { Print } from "@/types/print";
import Subtext from "../base/Subtext";
import Link from "next/link";

export default function PrintFilamentModal({ filament, ...props }: { filament: Filament } & ModalProps) {
    const [print, setPrint] = useObjectState<Omit<Print, "id" | "user" | "created" | "updated">>({
        filamentRolls: [filament],
        filamentUsage: { [filament.id]: 0 },

        name: "",
        totalFilament: 0,
        totalRolls: 1,
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    function printFilament() {
        setError("");

        if (!print.filamentUsage)
            return void setError("Please fill out all required fields.");

        setLoading(true);
        // TODO: backend
    }

    return <Modal {...props} title="Print Filament">
        <ModalHeader>
            Log how much filament you used to keep track of how much you have left.<br />
            <Subtext>If you want to make a print with multiple filaments, go <Link href="/app/prints">here</Link>.</Subtext>
        </ModalHeader>

        <div className="flex gap-2">
            <FilamentCard filament={filament} noninteractable className="bg-bg-lighter" />

            <div>
                <Input
                    label="Filament Used (g)"
                    subtext="Include any waste."
                    type="number"
                    value={print.filamentUsage[filament.id]}
                    onChange={e => setPrint({
                        filamentUsage: { [filament.id]: parseInt(e.target.value) },
                    })}
                    required
                    autoFocus
                />

                <Input
                    label="Label"
                    subtext="An additional note to later identify what this log was for."
                    value={print.name}
                    onChange={e => setPrint({ name: e.target.value })}
                />

                <p>You will have {grams(filament.mass - print.totalFilament)}/{grams(filament.initialMass)} remaining.</p>
            </div>
        </div>

        <ModalFooter error={error}>
            <Button onClick={printFilament} loading={loading}>Log</Button>
        </ModalFooter>
    </Modal>;
}
