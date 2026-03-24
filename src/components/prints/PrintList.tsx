"use client";

import { toDateString, toTimeString } from "@/lib/util/date";
import { grams } from "@/lib/util/units";
import Table from "../base/Table";
import { FilamentRecord, PrintsRecord, UsersRecord } from "@/types/pb";
import { pb } from "@/api/pb";
import FilamentTinyCard from "../filament/FilamentTinyCard";
import Subtext from "../base/Subtext";
import { PrintFilamentUsage } from "@/types/prints";

export default function PrintList({ prints, filament }: { prints: PrintsRecord[], filament: FilamentRecord[] }) {
    const user = pb.authStore.record as unknown as UsersRecord;

    if (!user)
        return null;

    return <>
        <Table
            columns={[
                { label: "Name", key: "label" },
                { label: "Filament Used", key: "totalFilamentUsed", render: data => grams(data.totalFilamentUsed) },
                {
                    label: "Rolls Used", key: "filamentRolls",
                    render: data => <div className="flex gap-1">
                        {data.filamentRolls
                            .map(f => <div className="text-center" key={f}>
                                <FilamentTinyCard filament={filament.find(l => l.id === f)!} />
                                <Subtext className="text-xs">{grams((data.filamentUsage as PrintFilamentUsage)[f])}</Subtext>
                            </div>)
                        }
                    </div>,
                },
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
