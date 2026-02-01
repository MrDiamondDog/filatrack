"use client";

import { pb } from "@/api/pb";
import { UsersRecord } from "@/types/pb";
import { ChevronDown, LogOut } from "lucide-react";
import { useState } from "react";
import Divider from "../base/Divider";
import { AnimateSize } from "../util/AnimateSize";
import { logout } from "@/lib/auth";

export function AccountCard() {
    const user = pb.authStore.record as unknown as UsersRecord | null;

    if (!user)
        return null;

    const [open, setOpen] = useState(false);

    return (<AnimateSize
        lockWidth
    >
        <div className="bg-bg rounded-lg p-2 w-full">
            <div className="flex justify-between items-center cursor-pointer w-full" onClick={() => setOpen(o => !o)}>
                <div className="flex gap-2 items-center w-full overflow-x-hidden">
                    <img src={user.avatar && pb.files.getURL(user, user.avatar)} className="w-7 rounded-full" />
                    <p className="overflow-x-hidden text-ellipsis text-nowrap">{user.name}</p>
                </div>

                <ChevronDown size={24} className={`min-w-6 transition-all ${open && "rotate-180"}`} />
            </div>

            {open && <div>
                <Divider />
                <button
                    className="w-full flex items-center gap-1 hover:bg-bg-light p-1 rounded-lg cursor-pointer transition-all"
                    onClick={logout}
                >
                    <LogOut /> Log Out
                </button>
            </div>}
        </div>
    </AnimateSize>);
}
