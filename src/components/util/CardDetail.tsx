import React from "react";
import Subtext from "../base/Subtext";

export default function CardDetail({ children, icon }:
    { icon: React.ReactNode, children: Exclude<React.ReactNode, null | undefined> }) {
    return (<Subtext className="flex items-center gap-1 w-full">
        {icon}
        <span className="overflow-x-hidden text-nowrap text-ellipsis">{children}</span>
    </Subtext>);
}
