"use client";

import React from "react";
import Button from "../base/Button";
import { pb } from "@/api/pb";
import { login } from "@/lib/auth";

export default function SSOButton({ provider, icon, children }:
    { provider: string, icon: React.ReactNode } & React.PropsWithChildren) {
    return <Button
        className="flex gap-1 items-center justify-center"
        onClick={() => pb.collection("users").authWithOAuth2({ provider })
            .then(login)
        }
    >
        {icon}
        {children}
    </Button>;
}
