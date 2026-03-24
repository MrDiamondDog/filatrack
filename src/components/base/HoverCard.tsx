import * as HoverCard from "@radix-ui/react-hover-card";
import { AnimatePresence, motion } from "motion/react";
import React from "react";

export function HoverCardRoot({ children }: React.PropsWithChildren) {
    return <HoverCard.Root>
        {children}
    </HoverCard.Root>;
}

export function HoverCardTrigger({ children, asChild }: { asChild?: boolean } & React.PropsWithChildren) {
    return <HoverCard.Trigger asChild={asChild}>
        {children}
    </HoverCard.Trigger>;
}

export function HoverCardContent({ children }: React.PropsWithChildren) {
    return <HoverCard.Portal>
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ type: "keyframes", duration: .15, ease: "easeOut" }}
            >
                <HoverCard.Content className="bg-bg-lighter rounded-lg p-2">
                    {children}

                    <HoverCard.Arrow className="fill-bg-lighter" />
                </HoverCard.Content>
            </motion.div>
        </AnimatePresence>
    </HoverCard.Portal>;
}
