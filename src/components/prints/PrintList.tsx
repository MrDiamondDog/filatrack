"use client";

import { toDateString, toTimeString } from "@/lib/date";
import { grams } from "@/lib/units";
import { Print } from "@/types/print";
import Table from "../base/Table";

export default function PrintList({ prints }: { prints: Print[] }) {
    return <>
        {/* TODO: Filament Previews */}
        <Table
            columns={[
                { label: "Name", key: "name" },
                { label: "Filament Used", key: "totalFilament", render: data => grams(data.totalFilamentUsed) },
                { label: "Rolls Used", key: "totalRolls" },
                {
                    label: "Date", key: "created",
                    render: data => `${toDateString(data.created)} ${toTimeString(data.created)}`,
                    sort: (a, b) => (a as Date).getTime() - (b as Date).getTime(),
                },
            ]}
            data={prints}
            sort="created"
            sortType="asc"
        />
    </>;
}
