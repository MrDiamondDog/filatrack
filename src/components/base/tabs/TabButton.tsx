import { motion } from "motion/react";

export default function TabButton({
    children, active, onClick,
}: Readonly<{ children: React.ReactNode, active?: boolean, onClick: () => void }>) {
    return (
        <motion.button
            className={"cursor-pointer px-2 py-1 rounded-lg hover:bg-bg-lighter relative"}
            onClick={onClick}
        >
            {active && <motion.div
                className="bg-primary absolute top-0 left-0 rounded-lg w-full h-full"
                layoutId="tabbutton"
            />}

            <div className="relative z-10">
                {children}
            </div>
        </motion.button>
    );
}
