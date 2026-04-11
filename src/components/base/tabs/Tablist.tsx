"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

import TabButton from "./TabButton";
import { LayoutGroup, motion } from "motion/react";

type Props = {
    tabs: Record<string, React.ReactNode>;
    activeTab?: string;
    onTabChange?: (v: string) => void;
    className?: string;
} & React.PropsWithChildren;

export default function Tablist({ tabs, activeTab, onTabChange, className, children }: Props) {
    const params = useParams();

    if (!activeTab)
        activeTab = Object.keys(tabs)[0];

    const [currentTab, setCurrentTab] = useState(activeTab);

    useEffect(() => {
        if (!window.location.hash)
            return;
        const hash = window.location.hash.slice(1);
        if (Object.keys(tabs).find(tab => tab.toLowerCase() === hash.toLowerCase())) {
            setCurrentTab(Object.keys(tabs).find(tab => tab.toLowerCase() === hash.toLowerCase())!);
        }
    }, [params]);

    return (<>
        <motion.div
            className={`flex gap-1 overflow-x-auto bg-bg-light px-2 py-1 rounded-lg ${className} overflow-hidden`}
            layout
        >
            <LayoutGroup id={Object.keys(tabs).join("-")}>
                {Object.entries(tabs).map(tab => (
                    <TabButton
                        key={tab[0]}
                        active={currentTab === tab[0]}
                        onClick={() => {
                            setCurrentTab(tab[0]);
                            onTabChange?.(tab[0]);
                        }}
                    >{tab[1]}</TabButton>
                ))}
            </LayoutGroup>
        </motion.div>

        {React.Children.map(children, child => {
            if (React.isValidElement(child)) {
                const childElement = child as React.ReactElement<any>;
                const props = childElement.props as { [key: string]: any };
                if (props["data-tab"] === currentTab || props.name === currentTab) {
                    return child;
                }
            }
        })}
    </>);
}
