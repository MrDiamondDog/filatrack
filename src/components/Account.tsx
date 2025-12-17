"use client";

import { LogOut } from "lucide-react";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";

function AccountOption({ open, onClick, children }: { open: boolean, onClick?: () => void } & React.PropsWithChildren) {
    return (
        <div
            className={`flex flex-row items-center gap-2 p-1 cursor-pointer hover:bg-bg-light transition-all rounded-lg
                ${open ? "fade-in" : "fade-out"}`}
            onClick={onClick}
        >
            {children}
        </div>
    );
}

export default function AccountCard({ session }: { session: Session }) {
    const [open, setOpen] = useState(false);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (open)
            setVisible(true);
    }, [open]);

    return (
        <div className="md:w-full flex flex-col">
            <div
                className={`md:w-full md:bg-bg md:p-1 flex flex-row rounded-lg items-center 
                    justify-between cursor-pointer transition-all ${visible && "rounded-b-none"}`}
                onClick={() => setOpen(!open)}
            >
                <div className="flex flex-row gap-2 items-center w-full">
                    <img src={session.user!.image!} className="rounded-full md:w-7 w-[48px] a-hide" />
                    <p className="text-nowrap truncate hidden md:block text-sm a-hide">{session.user!.name!}</p>
                </div>
            </div>
            {visible && <div
                className={`md:w-full bg-bg-lighter md:bg-bg p-1 flex flex-col gap-2 
                    rounded-lg md:rounded-t-none md:rounded-b-lg transition-all overflow-hidden
                    ${open ? "expand-down" : "expand-up"} md:static absolute top-[-50px] right-0`}
                onAnimationEnd={() => {
                    if (!open)
                        setVisible(false);
                }}
            >
                {visible && <>
                    <AccountOption open={open} onClick={signOut}><LogOut /> Log Out</AccountOption>
                </>}
            </div>}
        </div>
    );
}
