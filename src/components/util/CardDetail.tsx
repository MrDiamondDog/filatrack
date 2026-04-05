import React from "react";
import Subtext from "../base/Subtext";

type Props = {
    icon: React.ReactNode;
    children: Exclude<React.ReactNode, null | undefined>;
};

export default function CardDetail({ children, icon }: Props) {
    return (<Subtext className="flex items-center gap-1 w-full">
        {icon}
        <span className="overflow-x-hidden text-nowrap text-ellipsis md:text-md text-xs">{children}</span>
    </Subtext>);
}
