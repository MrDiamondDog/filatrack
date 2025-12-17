import Button, { ButtonStyles } from "../Button";
import Divider from "../Divider";
import Modal, { ModalFooter } from "../Modal";
import Subtext from "../Subtext";
import { useEffect, useState } from "react";
import Spinner from "../Spinner";
import { toDateString, toTimeString } from "@/lib/date";
import { Filament, FilamentLog } from "@/db/types";
import { Clock, Pencil, Trash2 } from "lucide-react";
import LogFilamentModal from "./LogFilament";
import { app } from "@/lib/db";
import { handleApiError } from "@/lib/errors";

function FilamentHistoryEntry({ log, onDelete, onEdit, preview, filament }:
    {
        log: FilamentLog,
        onDelete?: () => void,
        onEdit?: (l: FilamentLog) => void,
        preview?: boolean,
        filament?: Filament
    }) {
    const [openModal, setOpenModal] = useState("");

    return (<>
        <div className="bg-bg-lighter rounded-lg w-full p-2 flex flex-row justify-between items-center">
            <div className="flex flex-row items-center gap-2">
                <div className="w-full">
                    <div className="flex flex-row items-center gap-1 a-hide">
                        {log.filamentUsed}g {!!log.note && `- ${log.note}`}
                    </div>
                    <Subtext className="flex flex-row items-center gap-1 text-xs">
                        <Clock size={16} /> {toDateString(log.time)}, {toTimeString(log.time, false)}
                    </Subtext>
                </div>
            </div>
            {!preview && <div className="flex flex-col gap-2">
                <Pencil size={20} className="cursor-pointer hover:scale-105 transition-all" onClick={() => setOpenModal("edit")} />
                <Trash2 size={20} className="cursor-pointer hover:scale-105 transition-all" onClick={() => setOpenModal("delete")} />
            </div>}
        </div>

        {!preview && <Modal open={openModal === "delete"} onClose={() => setOpenModal("")} title="Delete Log" level={1}>
            <Subtext>Delete this log from the filament.</Subtext>
            <Divider />

            <p>Are you sure you want to delete this log?</p>
            <p>This will undo the filament used by this log.</p>
            <FilamentHistoryEntry log={log} preview />

            <ModalFooter>
                <Button onClick={() => setOpenModal("")} look={ButtonStyles.secondary}>Cancel</Button>
                <Button onClick={() => {
                    setOpenModal("");
                    onDelete?.();
                }} look={ButtonStyles.danger}>Delete</Button>
            </ModalFooter>
        </Modal>}

        {!preview && <LogFilamentModal
            open={openModal === "edit"}
            onClose={() => setOpenModal("")}
            filament={filament!}
            currentLog={log}
            onFinish={(_, l) => onEdit?.(l)}
        />}
    </>);
}

export default function FilamentHistoryList({ filament }: { filament: Filament }) {
    const [logs, setLogs] = useState<FilamentLog[]>([]);

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!open)
            return;

        setLoading(true);

        setLogs([]);
        app.filament.getFilamentLogs(filament.id).then(res => {
            setLoading(false);

            if (res.error) {
                setError(handleApiError(res.error));
                return;
            }

            setLogs(res.data.sort((a, b) => Number(a.time) - Number(b.time)));
        });
    }, [open]);

    function onEditLog(newLog: FilamentLog, i: number) {
        setLogs([...logs.slice(0, i), newLog, ...logs.slice(i + 1)]);
    }

    function onDeleteLog(i: number) {
        app.filament.deleteFilamentLog(logs[i]);
        setLogs([...logs.slice(0, i), ...logs.slice(i + 1)]);
    }

    return (<>
        {loading && <Spinner />}
        <div className="flex flex-col gap-2">
            {logs.map((l, i) => <FilamentHistoryEntry
                log={l}
                key={l.id}
                onEdit={l => onEditLog(l, i)}
                onDelete={() => onDeleteLog(i)}
                filament={filament}
            />)}
        </div>
        {(logs.length === 0 && !loading) &&
            <p className="w-full text-center">
                Looks like you haven't logged anything for this filament yet. Get printing!
            </p>
        }
    </>);
}
