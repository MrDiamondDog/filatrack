"use client";

import Button from "@/components/base/Button";
import Divider from "@/components/base/Divider";
import MotionContainer from "@/components/base/MotionContainer";
import CreatePrintModal from "@/components/modals/CreatePrintModal";
import PrintList from "@/components/prints/PrintList";
import { Plus } from "lucide-react";
import { useState } from "react";

export default function PrintPage() {
    const [openModal, setOpenModal] = useState("");

    return (<MotionContainer>
        <div className="flex items-center justify-between">
            <h2>Prints</h2>
            <Button className="h-full flex items-center justify-center gap-1" onClick={() => setOpenModal("print")}>
                <Plus size={32} /> New
            </Button>
        </div>
        <Divider />

        <PrintList />

        <CreatePrintModal open={openModal === "print"} onClose={() => setOpenModal("")} />
    </MotionContainer>);
}
