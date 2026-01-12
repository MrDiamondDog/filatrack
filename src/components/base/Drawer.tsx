import { ChevronDown, ChevronUp } from "lucide-react";
import React from "react";
import Divider from "./Divider";
import { AnimatePresence, motion } from "motion/react";

export default function Drawer({ label, open, onChange, ...props }:
    { label: string, open: boolean, onChange: (open: boolean) => void, startOpen?: boolean } & React.PropsWithChildren) {
    return (<div className="bg-bg p-2 rounded-lg">
        <div className="flex flex-row gap-1 items-center cursor-pointer" onClick={() => onChange(!open)}>
            {open ? <ChevronUp /> : <ChevronDown />} {label}
        </div>
        <AnimatePresence mode="sync">
            {open && <motion.div
                initial={{ height: 0 }}
                animate={{ height: "auto" }}
                exit={{ width: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                layout
                className="overflow-hidden"
            >
                <Divider />
                {props.children}
            </motion.div>}
        </AnimatePresence>
    </div>);
}
