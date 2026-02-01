"use client";

import Button from "@/components/base/Button";
import Divider from "@/components/base/Divider";
import MotionContainer from "@/components/base/MotionContainer";
import CreatePrintModal from "@/components/modals/CreatePrintModal";
import PrintList from "@/components/prints/PrintList";
import { PrintsRecord } from "@/types/pb";
import { Plus } from "lucide-react";
import { useState } from "react";

export default function PrintPage() {
    const [openModal, setOpenModal] = useState("");

    const [prints, setPrints] = useState<PrintsRecord[]>([
        // @ts-ignore temp
        { label: "a Test Print", totalFilamentUsed: 124, totalRollsUsed: 2, created: new Date() },
        // @ts-ignore temp
        { label: "z Test Print 2", totalFilamentUsed: 2, totalRollsUsed: 1, created: new Date(Date.now() - 998 * 60 * 24) },
    ]);

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
