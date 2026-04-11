import React from "react";
import { FilamentRecord, PrintsRecord } from "./pb";

export type FilamentWithPrints = FilamentRecord & { expand: { prints: PrintsRecord[] }};

export type FilamentKey = {
    key: keyof FilamentRecord;
    title: string;
    icon: React.ReactNode;
    customRender?: boolean;
    render?: (filament: FilamentRecord) => React.ReactNode | undefined;
}
