import { randomFilament } from "@/lib/util/random";
import { SelectMultiple } from "../base/Select";
import { useState } from "react";
import FilamentMiniRow from "./FilamentMiniRow";
import { FilamentRecord } from "@/types/pb";

// TODO: make single picker work
export default function FilamentPicker({ values, onChange, multiple }:
    { values: FilamentRecord[], onChange: (f: FilamentRecord[]) => void, multiple?: boolean }) {
    // TODO: backend
    const [allFilament, setAllFilament] =
        useState([randomFilament(), randomFilament(), randomFilament(), randomFilament(), randomFilament(), randomFilament()]);

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
