"use client";

import { toDateString, toTimeString } from "@/lib/util/date";
import { grams } from "@/lib/util/units";
import Table from "../base/Table";
import { PrintsRecord, UsersRecord } from "@/types/pb";
import { pb } from "@/api/pb";
import { useState, useEffect } from "react";

export default function PrintList() {
    const user = pb.authStore.record as unknown as UsersRecord;

    if (!user)
        return null;

    const [prints, setPrints] = useState<PrintsRecord[]>([]);

    useEffect(() => {
        pb.collection("prints").getFullList({ filter: `user.id = "${user.id}"` })
            .then(setPrints);
    }, []);

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
                    sort: (a, b) => new Date(a as string).getTime() - new Date(b as string).getTime(),
                },
            ]}
            data={prints}
            sort="created"
            sortType="asc"
        />
    </>;
}
