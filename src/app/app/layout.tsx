import Sidebar from "@/components/sidebar/Sidebar";
import { AnimatePresence } from "motion/react";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Filatrack Dashboard",
};

export default function AppLayout({
    children,
}: Readonly<{
	children: React.ReactNode;
}>) {
    return <div className="flex flex-row w-full overflow-hidden">
        <Sidebar />

        <AnimatePresence>
            {children}
        </AnimatePresence>
    </div>;
}
