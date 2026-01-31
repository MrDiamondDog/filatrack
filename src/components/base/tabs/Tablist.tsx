"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

import TabButton from "./TabButton";
import { LayoutGroup, motion } from "motion/react";

interface Props {
    tabs: Record<string, React.ReactNode>;
    activeTab?: string;
    onTabChange?: (v: string) => void;
    children?: React.ReactNode;
    className?: string;
}

export default function Tablist(props: Props) {
    const params = useParams();

    if (!props.activeTab)
        props.activeTab = Object.keys(props.tabs)[0];

    const [activeTab, setActiveTab] = useState(props.activeTab);

    useEffect(() => {
        if (!window.location.hash)
            return;
        const hash = window.location.hash.slice(1);
        if (Object.keys(props.tabs).find(tab => tab.toLowerCase() === hash.toLowerCase())) {
            setActiveTab(Object.keys(props.tabs).find(tab => tab.toLowerCase() === hash.toLowerCase())!);
        }
    }, [params]);

    return (<>
        <motion.div
            className={`flex gap-1 overflow-x-auto bg-bg-light px-2 py-1 rounded-lg ${props.className} overflow-hidden`}
            layout
        >
            <LayoutGroup id={Object.keys(props.tabs).join("-")}>
                {Object.entries(props.tabs).map(tab => (
                    <TabButton
                        key={tab[0]}
                        active={activeTab === tab[0]}
                        onClick={() => {
                            setActiveTab(tab[0]);
                            props.onTabChange?.(tab[0]);
                        }}
                    >{tab[1]}</TabButton>
                ))}
            </LayoutGroup>
        </motion.div>

        {React.Children.map(props.children, child => {
            if (React.isValidElement(child)) {
                const childElement = child as React.ReactElement<any>;
                const props = childElement.props as { [key: string]: any };
                if (props["data-tab"] === activeTab || props.name === activeTab) {
                    return child;
                }
            }
        })}
    </>);
}
