import { StorageRecord } from "@/types/pb";
import StorageCard from "./StorageCard";

export default function StorageList({ storage }: { storage: StorageRecord[] }) {
    return <div className="grid grid-cols-1 md:flex flex-row flex-wrap w-full h-fit gap-2">
        {storage.map(s => <StorageCard storage={s} key={s.id} />)}
    </div>;
}
