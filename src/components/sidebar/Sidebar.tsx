import { Archive, Cog, Home, Printer, Spool } from "lucide-react";
import SidebarItem from "./SidebarItem";
import Divider from "../base/Divider";
import Link from "next/link";

export default function Sidebar() {
    return (<div className="h-screen w-50 bg-bg-light p-2 px-4 fixed">
        <Link className="unstyled flex flex-row gap-2 items-center px-2 pt-2 w-full justify-center" href="/">
            <img src="/filament.svg" width="40" height="40" />
            <h1 className="text-2xl">Filatrack</h1>
        </Link>

        <Divider />

        <SidebarItem href="/app"><Home /> Dashboard</SidebarItem>
        <SidebarItem href="/app/filament"><Spool /> Filament</SidebarItem>
        <SidebarItem href="/app/storage"><Archive /> Storage</SidebarItem>
        <SidebarItem href="/app/prints"><Printer /> Prints</SidebarItem>
        <SidebarItem href="/app/settings"><Cog /> Settings</SidebarItem>
    </div>);
}
