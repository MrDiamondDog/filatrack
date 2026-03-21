import React from "react";
import Subtext from "../base/Subtext";

export default function CardDetail({ children, icon }:
    { icon: React.ReactNode, children: Exclude<React.ReactNode, null | undefined> }) {
    return (<Subtext className="flex items-center gap-1">
        {icon}
        {/* There is no good way to truncate this damn string with css. If you know how, please make a PR */}
        <span>{children.toString().length > 12 ? `${children.toString().slice(0, 12)}...` : children}</span>
    </Subtext>);
}
