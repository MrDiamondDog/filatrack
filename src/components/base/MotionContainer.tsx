"use client";

import { motion } from "motion/react";

export default function MotionContainer({ children }: React.PropsWithChildren) {
    return <motion.main
        layout
        initial={{ opacity: 0 }}
        exit={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full p-4 overflow-scroll ml-50"
    >
        {children}
    </motion.main>;
}
