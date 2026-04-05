"use client";

import { Archive, Cog, Heart, Home, MessageSquareText, Printer, Spool } from "lucide-react";
import SidebarItem from "./SidebarItem";
import Divider from "../base/Divider";
import Link from "next/link";
import { useDevice } from "@/lib/util/hooks";
import { AccountCard } from "../auth/AccountCard";
import FilamentIcon from "../filament/FilamentIcon";
import { randomFilamentNames, randomFrom } from "@/lib/util/random";
import { useState } from "react";
import { FaDiscord, FaGithub } from "react-icons/fa6";
import { pb } from "@/api/pb";
import { UsersRecord } from "@/types/pb";

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
    const [iconColor, setIconColor] = useState(randomFrom(Object.keys(randomFilamentNames)));

    if (isMobile)
        return <MobileSidebar />;

    const user = pb.authStore.record as UsersRecord | null;

    if (!user)
        return null;

    return (<div className="h-screen w-50 bg-bg-light p-2 px-4 fixed flex flex-col justify-between">
        <div>
            <Link className="unstyled flex flex-row gap-2 items-center px-2 pt-2 w-full justify-center" href="/">
                <FilamentIcon size={40} color={iconColor} />
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
            <SidebarItem href="/about/feedback"><MessageSquareText size={24} /> Feedback</SidebarItem>
            <SidebarItem href="https://github.com/mrdiamonddog/filatrack"><FaGithub size={24} /> GitHub</SidebarItem>
            <SidebarItem href="https://discord.gg/HUjRATbH2g"><FaDiscord size={24} /> Discord</SidebarItem>
            {!user.supporter && <SidebarItem href="/about/support"
                className="mb-2 bg-[#e41d5f26] text-[#ffb2cb]"
            >
                <Heart /> Support
            </SidebarItem>}
            <AccountCard />
        </div>
    </div>);
}
