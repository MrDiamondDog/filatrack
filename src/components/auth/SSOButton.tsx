"use client";

import React from "react";
import Button from "../base/Button";
import { pb } from "@/api/pb";
import { login } from "@/lib/auth";
import { toastError } from "@/lib/util/error";

type Props = {
    provider: string;
    icon: React.ReactNode;
    redirect?: string;
} & React.PropsWithChildren;

export default function SSOButton({ provider, icon, redirect, children }: Props) {
    return <Button
        className="flex gap-1 items-center justify-center"
        onClick={() => pb.collection("users").authWithOAuth2({
            provider,
            createData: {
                filamentSort: "name",
                tempUnit: "c",
                massUnit: "g",
                lengthUnit: "mm",
                defaultQrSettings: { fields: ["mass", "nozzleTemperature", "bedTemperature", "note"], format: "SVG" },
            },
        })
            .then(res => login(res, redirect))
            .catch(e => toastError("Could not authenticate", e))
        }
    >
        {icon}
        {children}
    </Button>;
}
