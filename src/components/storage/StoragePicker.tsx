import { StorageWithFilament } from "@/types/storage";
import { Select } from "../base/Select";
import StorageMiniCard from "./StorageMiniCard";

type Props = {
    storages: StorageWithFilament[];
    value: string;
    onChange: (v: (StorageWithFilament | undefined)) => void;
};

export default function StoragePicker({ storages, value, onChange }: Props) {
    return (
        <Select
            options={storages.reduce((prev, curr) => ({
                ...prev,
                [curr.id]: <StorageMiniCard storage={curr} />,
            }), { "": <p>No Storage</p> })}
            disabledOptions={storages.filter(s => s.filament.length >= s.capacity).map(s => s.id)}
            value={value}
            onChange={s => onChange(storages.find(v => v.id === s))}
            placeholder="Select storage..."
        />
    );
}
