import { SelectMultiple } from "../base/Select";
import { useEffect, useState } from "react";
import FilamentMiniRow from "./FilamentMiniRow";
import { FilamentRecord, UsersRecord } from "@/types/pb";
import { pb } from "@/api/pb";

// TODO: make single picker work
export default function FilamentPicker({ values, onChange, multiple }:
    { values: FilamentRecord[], onChange: (f: FilamentRecord[]) => void, multiple?: boolean }) {
    const user = pb.authStore.record as unknown as UsersRecord;

    const [allFilament, setAllFilament] = useState<FilamentRecord[]>([]);

    useEffect(() => {
        pb.collection("filament").getFullList({ filter: `user.id = "${user.id}"` })
            .then(setAllFilament);
    }, []);

    return <SelectMultiple
        searchable
        options={allFilament.reduce((prev, curr) => ({
            ...prev,
            [`${curr.name} ${curr.id}`]: <FilamentMiniRow filament={curr} />,
        }), {})}
        values={values.map(v => `${v.name} ${v.id}`)}
        onChange={vals => onChange(allFilament.filter(f => vals.includes(`${f.name} ${f.id}`)))}
        className="w-full"
        placeholder="Select one or more filament"
    />;
}
