"use client";

import { pb } from "@/api/pb";
import Button from "@/components/base/Button";
import Divider from "@/components/base/Divider";
import MotionContainer from "@/components/base/MotionContainer";
import CreatePrintModal from "@/components/modals/CreatePrintModal";
import PrintList from "@/components/prints/PrintList";
import { UsersRecord, PrintsRecord } from "@/types/pb";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";

export default function PrintPage() {
    const user = pb.authStore.record as unknown as UsersRecord;

    if (!user)
        return null;

    const [openModal, setOpenModal] = useState("");
    const [prints, setPrints] = useState<PrintsRecord[]>([]);

    useEffect(() => {
        pb.collection("prints").getFullList({ filter: `user.id = "${user.id}"` })
            .then(setPrints);
    }, []);

    return (<MotionContainer>
        <div className="flex items-center justify-between">
            <h2>Prints</h2>
            <Button className="h-full flex items-center justify-center gap-1" onClick={() => setOpenModal("print")}>
                <Plus size={32} /> New
            </Button>
        </div>
        <Divider />

        <PrintList prints={prints} />

        <CreatePrintModal open={openModal === "print"} onClose={() => setOpenModal("")} />
    </MotionContainer>);
}
