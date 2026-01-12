"use client";

import { Info, OctagonAlert, X } from "lucide-react";
import Divider from "./Divider";
import Subtext from "./Subtext";
import Portal from "./Portal";
import { AnimateSize } from "../util/AnimateSize";
import { AnimatePresence, motion } from "motion/react";

export type ModalProps = {
    open: boolean,
    onClose: () => void
}

// TODO: width doesn't change after initial width
export default function Modal({ children, title, open, onClose, danger }:
{ title: string, open: boolean, onClose: () => void, level?: number, danger?: boolean } & React.PropsWithChildren) {
    return (<Portal>
        <AnimatePresence mode="popLayout">
            {open && <motion.div
                key="bg"
                className="fixed inset-0 bg-black z-100"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.75 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={e => {
                    e.stopPropagation();
                    onClose();
                }}
            />}

            {open && <motion.div
                key="content"
                className={`fixed top-1/2 left-1/2 -translate-1/2 bg-bg-light rounded-lg min-h-25 max-h-[95vh] overflow-scroll
                    border-2 ${danger ? "border-danger" : "border-primary"} px-4 py-3 z-110`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ duration: 0.1, type: "tween" }}
                layout
            >
                <ModalTitle onClose={onClose}>{title}</ModalTitle>

                <AnimateSize>
                    {children}
                </AnimateSize>
            </motion.div>}
        </AnimatePresence>
    </Portal>);
}

export function ModalTitle({ children, onClose }: { onClose: () => void } & React.PropsWithChildren) {
    return (<div className="flex flex-row gap-10 justify-between items-center">
        <h2 className="text-lg md:text-xl">{children}</h2>
        <X size={32} className="rounded-lg p-1 cursor-pointer transition-all hover:bg-bg-lighter" onClick={onClose} />
    </div>);
}

export function ModalHeader({ children }: React.PropsWithChildren) {
    return (<>
        <Subtext>{children}</Subtext>
        <Divider />
    </>);
}

export function ModalFooter({ children, tip, error }: { tip?: string, error?: string } & React.PropsWithChildren) {
    return (<>
        <Divider />
        <div className="flex flex-col gap-2 md:flex-row justify-between w-full items-end">
            <div className="flex flex-col gap-2 w-full">
                {error && <p className="text-gray-400 flex flex-row gap-2 items-center">
                    <OctagonAlert className="text-danger min-w-8 min-h-8" /> {error}
                </p>}
                {tip && <Subtext className="text-xs flex flex-row gap-2 items-center md:min-w-0 min-w-75">
                    <Info className="text-primary min-w-8 min-h-8" /> {tip}
                </Subtext>}
            </div>
            <div className={"flex flex-row gap-1 justify-end"}>
                {children}
            </div>
        </div>
    </>);
}
