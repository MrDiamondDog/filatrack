import { hexToRgb } from "@/lib/util/colors";
import React from "react";

export default function UserTag({ hexColor, children }: { hexColor: string } & React.PropsWithChildren) {
    const colorRGB = hexToRgb(hexColor)!;

    return (
        <div style={{
            backgroundColor: `rgba(${colorRGB.r},${colorRGB.g},${colorRGB.b},.15)`,
            color: hexColor,
        }} className="rounded-full px-2 py-1 flex items-center gap-1 text-xs">
            {children}
        </div>
    );
}
