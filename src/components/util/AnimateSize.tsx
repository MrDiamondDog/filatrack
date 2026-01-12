import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

interface AnimateSize {
  children: React.ReactNode
  className?: string
}

export function AnimateSize({ children, className }: AnimateSize) {
    const [width, setWidth] = useState<number | "auto">("auto");
    const [height, setHeight] = useState<number | "auto">("auto");

    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current)
            return;

        const resizeObserver = new ResizeObserver(entries => {
            // console.log(entries);

            setWidth(entries[0]?.contentRect?.width ?? "auto");
            setHeight(entries[0]?.contentRect?.height ?? "auto");
        });

        resizeObserver.observe(containerRef.current);

        return () => resizeObserver.disconnect();
    }, [containerRef.current]);

    return (
        <motion.div
            className={`overflow-hidden ${className ?? ""}`}
            initial={{ width, height }}
            animate={{ width, height }}
            transition={{ type: "spring", duration: 0.1 }}
        >
            <div
                ref={containerRef}
                className="w-fit"
            >
                {children}
            </div>
        </motion.div>
    );
};
