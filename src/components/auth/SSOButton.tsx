"use client";

import React from "react";
import Button from "../base/Button";
import { pb } from "@/api/pb";
import { login } from "@/lib/auth";
import { toastError } from "@/lib/util/error";
import { useSearchParams } from "next/navigation";

type Props = {
    provider: string;
    icon: React.ReactNode;
} & React.PropsWithChildren;

export default function SSOButton({ provider, icon, children }: Props) {
    const searchParams = useSearchParams();

    return <Button
        className="flex gap-1 items-center justify-center"
        onClick={() => pb.collection("users").authWithOAuth2({
            provider,
            createData: {
                filamentSort: "name",
                tempUnit: "c",
                massUnit: "g",
                lengthUnit: "mm",
                shownFilamentCardKeys: ["storage", "brand", "material", "mass"],
                shownFilamentTableKeys: [
                    "storage",
                    "color",
                    "brand",
                    "material",
                    "mass",
                    "initialMass",
                    "nozzleTemperature",
                    "bedTemperature",
                ],
                defaultQrSettings: { fields: ["mass", "nozzleTemperature", "bedTemperature", "note"], format: "SVG" },
            },
        })
            .then(res => login(res, searchParams.get("to") ?? undefined))
            .catch(e => toastError("Could not authenticate", e))
        }
    >
        {icon}
        {children}
    </Button>;
}
