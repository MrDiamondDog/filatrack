"use client";

import { Archive, Cog, Home, Printer, Spool } from "lucide-react";
import SidebarItem from "./SidebarItem";
import Divider from "../base/Divider";
import Link from "next/link";
import { useDevice } from "@/lib/util/hooks";
import { AccountCard } from "../auth/AccountCard";

export function MobileSidebar() {
    return (<div className="z-1 bottom-0 left-0 right-0 h-15 bg-bg-light p-2 px-4 fixed flex items-center justify-around gap-2">
        <SidebarItem href="/app"><Home size={32} /></SidebarItem>
        <SidebarItem href="/app/filament"><Spool size={32} /></SidebarItem>
        <SidebarItem href="/app/storage"><Archive size={32} /></SidebarItem>
        <SidebarItem href="/app/prints"><Printer size={32} /></SidebarItem>
        <SidebarItem href="/app/settings"><Cog size={32} /></SidebarItem>
    </div>);
}

export default function Sidebar() {
    const [isMobile, _] = useDevice();

    if (isMobile)
        return <MobileSidebar />;

    return (<div className="h-screen w-50 bg-bg-light p-2 px-4 fixed flex flex-col justify-between">
        <div>
            <Link className="unstyled flex flex-row gap-2 items-center px-2 pt-2 w-full justify-center" href="/">
                <img src="/filament.svg" width="40" height="40" />
                <h1 className="text-2xl">Filatrack</h1>
            </Link>

            <Divider />

            <div>
                <SidebarItem href="/app"><Home /> Dashboard</SidebarItem>
                <SidebarItem href="/app/filament"><Spool /> Filament</SidebarItem>
                <SidebarItem href="/app/storage"><Archive /> Storage</SidebarItem>
                <SidebarItem href="/app/prints"><Printer /> Prints</SidebarItem>
                <SidebarItem href="/app/settings"><Cog /> Settings</SidebarItem>
            </div>
        </div>

        <div>
            <AccountCard />
        </div>
    </div>);
}
