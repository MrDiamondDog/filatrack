"use client";

import { pb } from "@/api/pb";
import Button from "@/components/base/Button";
import Divider from "@/components/base/Divider";
import MotionContainer from "@/components/base/MotionContainer";
import Spinner from "@/components/base/Spinner";
import CreatePrintModal from "@/components/modals/CreatePrintModal";
import PrintList from "@/components/prints/PrintList";
import { toastError } from "@/lib/util/error";
import { UsersRecord, PrintsRecord, FilamentRecord } from "@/types/pb";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";

export default function PrintPage() {
    const user = pb.authStore.record as unknown as UsersRecord;

    if (!user)
        return null;

    const [openModal, setOpenModal] = useState("");
    const [prints, setPrints] = useState<PrintsRecord[]>();
    const [filament, setFilament] = useState<FilamentRecord[]>();

    useEffect(() => {
        pb.collection("prints").getFullList({ filter: `user.id = "${user.id}"` })
            .then(setPrints)
            .catch(e => toastError("Could not fetch prints", e));

        pb.collection("filament").getFullList({ filter: `user.id = "${user.id}"` })
            .then(setFilament)
            .catch(e => toastError("Could not fetch filament", e));
    }, []);

    return (<MotionContainer>
        {(prints && filament) ? <>
            <div className="flex items-center justify-between">
                <h2>Prints</h2>
                <Button className="h-full flex items-center justify-center gap-1" onClick={() => setOpenModal("print")}>
                    <Plus size={32} /> New
                </Button>
            </div>
            <Divider />

            <PrintList prints={prints} filament={filament} />
            {!prints.length && <p className="w-full text-center">
                You haven't logged any prints yet. Press the + in the top right to get started!
            </p>}

            <CreatePrintModal
                open={openModal === "print"}
                onClose={() => setOpenModal("")}
                onCreate={p => setPrints([...(prints ?? []), p])}
            />
        </> : <Spinner />}
    </MotionContainer>);
}
