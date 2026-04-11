"use client";

import { motion } from "motion/react";
import { Suspense } from "react";
import Spinner from "./Spinner";

export default function MotionContainer({ children }: React.PropsWithChildren) {
    return <motion.main
        initial={{ opacity: 0 }}
        exit={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full p-4 overflow-scroll mb-15 md:ml-50"
    >
        <Suspense fallback={<Spinner />}>
            {children}
        </Suspense>
    </motion.main>;
}
