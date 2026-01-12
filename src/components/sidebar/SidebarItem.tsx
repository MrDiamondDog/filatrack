"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SidebarItem({ children, href }: { href: string } & React.PropsWithChildren) {
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
