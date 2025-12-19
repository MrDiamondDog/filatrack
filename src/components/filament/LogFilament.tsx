import { useState } from "react";
import Button from "../Button";
import Divider from "../Divider";
import Input from "../Input";
import Modal, { ModalFooter, ModalProps } from "../Modal";
import Subtext from "../Subtext";
import { Filament, FilamentLog, UserSettings } from "@/db/types";
import { ApiRes } from "@/lib/db/types";
import { app } from "@/lib/db";
import { handleApiError } from "@/lib/errors";
import SmallFilamentPreview from "./SmallFilamentPreview";
import { grams } from "@/lib/units";

export default function LogFilamentModal({ open, onClose, filament, onFinish, currentLog, userSettings }:
    { filament: Filament, onFinish: (newFilament: Filament, newLog: FilamentLog) => void, userSettings?: UserSettings,
        currentLog?: FilamentLog } & ModalProps) {
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const [filamentUsed, setFilamentUsed] = useState(currentLog?.filamentUsed ?? 0);
    const [note, setNote] = useState(currentLog?.note ?? "");

    function calculateNewFilamentMass(input: number) {
        // If current log exists, undo the filament used by that and subtract by the new value
        if (currentLog)
            return filament.currentMass + currentLog.filamentUsed - input;

        // Otherwise, just currentMass - new value
        return filament.currentMass - input;
    }

    async function logFilament() {
        if (Number.isNaN(filamentUsed)) {
            setError("Last time I checked, you can't 3d print anything with undefined filament.");
            return;
        }

        setLoading(true);
        setError("");

        let res: ApiRes<{ log: FilamentLog, filament?: Filament }> | null = null;
        if (currentLog) {
            res = await app.filament.editFilamentLog({
                id: currentLog.id,

                filamentUsed,

                note,

                filamentId: currentLog.filamentId,
                time: currentLog.time,
            }, currentLog);
        } else {
            res = await app.filament.createFilamentLog({
                filamentUsed,

                previousMass: filament.currentMass,
                newMass: calculateNewFilamentMass(filamentUsed),

                note,

                filamentId: filament.id,
                time: new Date(),
            });
        }

        if (res.error) {
            setError(handleApiError(res.error));
            setLoading(false);
            return;
        }

        setLoading(false);
        setError("");
        setFilamentUsed(0);
        onClose();
        onFinish(res.data.filament ?? filament, res.data.log);
    }

    return (
        <Modal open={open} onClose={onClose} title="Log Filament Use">
            <Subtext className="mb-2">
                    If you've used this filament, log how much was used so you'll know how much is left.
            </Subtext>
            <Divider />
            <div className="flex flex-col items-center gap-2">
                <SmallFilamentPreview filament={filament} noInteraction className="bg-bg-lighter" />
                <Input
                    label="Filament Used (g)"
                    type="number"
                    value={filamentUsed}
                    onChange={e => setFilamentUsed(parseInt(e.target.value))}
                    autoFocus={true}
                />
                <Input
                    label="Note"
                    placeholder="What did you print?"
                    maxLength={45}
                    value={note}
                    onChange={e => setNote(e.target.value)}
                />
            </div>

            <Divider />

            {!!userSettings?.additionalFilamentModifier && <Subtext className="w-full text-center text-xs">
                Additional Filament Modifier: {userSettings.additionalFilamentModifier}g
            </Subtext>}
            <p className="w-full text-center text-sm">
                This will leave{" "}
                {grams(Math.max(
                    0,
                    calculateNewFilamentMass(filamentUsed)
                ))} / {grams(filament.startingMass)} remaining.
            </p>

            <ModalFooter
                error={error}>
                <Button loading={loading} onClick={logFilament} data-rybbit-event="log">Confirm</Button>
            </ModalFooter>
        </Modal>
    );
}
