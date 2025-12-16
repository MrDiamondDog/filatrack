"use client";

import { useState } from "react";
import Input from "../Input";
import { UserSettings } from "@/db/types";

export default function MaterialPicker({ value, onChange, userSettings }:
    { value: string, onChange: (val: string) => void, userSettings: UserSettings }) {
    const [otherMat, setOtherMat] = useState(false);

    return (<div className="max-w-[400px]">
        <div className="flex flex-wrap max-w-[400px] gap-1 my-2">
            {userSettings.materialPickerOptions.map(f => <MaterialEntry
                key={f}
                selected={!otherMat && value === f}
                onClick={() => {
                    setOtherMat(false);
                    onChange(f);
                }}
            >
                {f}
            </MaterialEntry>)}
        </div>

        <Input
            placeholder="Other..."
            className={!otherMat && userSettings.materialPickerOptions.includes(value) ? "" : "!border-primary"}
            value={!otherMat && userSettings.materialPickerOptions.includes(value) ? "" : value}
            onChange={e => {
                setOtherMat(true);
                onChange(e.target.value);
            }}
            maxLength={32}
        />
    </div>);
}

export function MaterialEntry({ children, selected, onClick }:
    { selected?: boolean, onClick?: () => void } & React.PropsWithChildren) {
    return (
        <div className={`rounded-full bg-bg-lighter px-4 py-1 text-center cursor-pointer transition-all
            border-2 border-transparent hover:border-primary ${selected && "!border-primary"} select-none`}
        onClick={onClick}
        >
            {children}
        </div>
    );
}
