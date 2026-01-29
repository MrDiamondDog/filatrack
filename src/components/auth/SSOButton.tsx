"use client";

import React from "react";
import Button from "../base/Button";

export default function SSOButton({ provider, icon, children }:
    { provider: string, icon: React.ReactNode } & React.PropsWithChildren) {
    return <Button className="flex gap-1 items-center justify-center">
        {icon}
        {children}
    </Button>;
}
