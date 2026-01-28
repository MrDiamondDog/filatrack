"use client";

import { useDevice } from "@/lib/hooks";
import { motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function MobileSidebarItem({ children, href }: { href: string } & React.PropsWithChildren) {
    const active = usePathname() === href;

    return (<Link href={href} className="unstyled flex flex-col justify-center items-center relative w-full h-full">
        {children}

        {active && <motion.div
            className="bg-bg-lighter absolute top-0 left-0 rounded-lg w-full h-full -z-1"
            layoutId="sidebar-button"
        />}
    </Link>);
}

export default function SidebarItem({ children, href }: { href: string } & React.PropsWithChildren) {
    const [isMobile, _] = useDevice();

    if (isMobile)
        return <MobileSidebarItem href={href}>{children}</MobileSidebarItem>;

    const active = usePathname() === href;

    return (<Link href={href} className={`unstyled flex flex-row items-center gap-2 rounded-lg p-2 mb-1
       transition-colors relative`}>
        {children}

        {active && <motion.div
            className="bg-bg-lighter absolute top-0 left-0 rounded-lg w-full h-full -z-1"
            layoutId="sidebar-button"
        />}
    </Link>);
}
