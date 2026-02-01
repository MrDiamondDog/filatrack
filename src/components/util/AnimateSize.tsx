import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

interface AnimateSizeProps {
  children: React.ReactNode;
  className?: string;
  lockWidth?: boolean;
  lockHeight?: boolean;
}

export function AnimateSize({ children, className, lockWidth, lockHeight }: AnimateSizeProps) {
    const [width, setWidth] = useState<number | "auto">("auto");
    const [height, setHeight] = useState<number | "auto">("auto");

    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current)
            return;

        const resizeObserver = new ResizeObserver(entries => {
            // console.log(entries);

            !lockWidth && setWidth(entries[0]?.contentRect?.width ?? "auto");
            !lockHeight && setHeight(entries[0]?.contentRect?.height ?? "auto");
        });

        resizeObserver.observe(containerRef.current);

        return () => resizeObserver.disconnect();
    }, [containerRef.current]);

    return (
        <motion.div
            className={`overflow-hidden ${className ?? ""}`}
            initial={{ width: lockWidth ? undefined : width, height: lockHeight ? undefined : height }}
            animate={{ width: lockWidth ? undefined : width, height: lockHeight ? undefined : height }}
            transition={{ type: "spring", duration: 0.1 }}
        >
            <div
                ref={containerRef}
                className={!lockWidth ? "w-fit" : undefined}
            >
                {children}
            </div>
        </motion.div>
    );
};
