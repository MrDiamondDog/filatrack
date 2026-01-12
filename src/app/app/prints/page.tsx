"use client";

import Button from "@/components/base/Button";
import Divider from "@/components/base/Divider";
import MotionContainer from "@/components/base/MotionContainer";
import CreatePrintModal from "@/components/modals/CreatePrintModal";
import PrintList from "@/components/prints/PrintList";
import { Print } from "@/types/print";
import { Plus } from "lucide-react";
import { useState } from "react";

export default function PrintPage() {
    const [openModal, setOpenModal] = useState("");

    const [prints, setPrints] = useState<Print[]>([
        // @ts-ignore temp
        { name: "a Test Print", totalFilament: 124, totalRolls: 2, created: new Date() },
        // @ts-ignore temp
        { name: "z Test Print 2", totalFilament: 2, totalRolls: 1, created: new Date(Date.now() - 998 * 60 * 24) },
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
