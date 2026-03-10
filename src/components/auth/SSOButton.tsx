"use client";

import React from "react";
import Button from "../base/Button";
import { pb } from "@/api/pb";
import { login } from "@/lib/auth";
import { toast } from "sonner";

export default function SSOButton({ provider, icon, children }:
    { provider: string, icon: React.ReactNode } & React.PropsWithChildren) {
    return <Button
        className="flex gap-1 items-center justify-center"
        onClick={() => pb.collection("users").authWithOAuth2({ provider })
            .then(login)
            .catch(e => e.message !== "NEXT_REDIRECT" &&
                toast.error(`${e.message} Please try again later or report this to the Discord server.`))
        }
    >
        {icon}
        {children}
    </Button>;
}
