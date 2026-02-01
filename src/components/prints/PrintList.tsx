"use client";

import { toDateString, toTimeString } from "@/lib/util/date";
import { grams } from "@/lib/util/units";
import Table from "../base/Table";
import { PrintsRecord } from "@/types/pb";

export default function PrintList({ prints }: { prints: PrintsRecord[] }) {
    return <>
        {/* TODO: Filament Previews */}
        <Table
            columns={[
                { label: "Name", key: "label" },
                { label: "Filament Used", key: "totalFilamentUsed", render: data => grams(data.totalFilamentUsed) },
                { label: "Rolls Used", key: "totalRollsUsed" },
                {
                    label: "Date", key: "created",
                    render: data => `${toDateString(new Date(data.created))} ${toTimeString(new Date(data.created))}`,
                    sort: (a, b) => (a as Date).getTime() - (b as Date).getTime(),
                },
            ]}
            data={prints}
            sort="created"
            sortType="asc"
        />
    </>;
}
