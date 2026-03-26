import { Check } from "lucide-react";
import React from "react";

type Props = {
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
} & React.PropsWithChildren;

export default function Checkbox({ checked, onCheckedChange, children }: Props) {
    return <div className="flex gap-1 items-center cursor-pointer" onClick={() => onCheckedChange(!checked)}>
        <div className={`size-5 rounded-sm border-3 border-bg-lighter ${checked && "bg-primary border-primary"}
            transition-colors`}>
            {checked && <Check size={20} />}
        </div>
        {children}
    </div>;
}
