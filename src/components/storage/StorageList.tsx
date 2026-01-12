import { Storage } from "@/types/storage";
import StorageCard from "./StorageCard";

export default function StorageList({ storage }: { storage: Storage[] }) {
    return <div className="flex flex-row flex-wrap w-full h-fit gap-2">
        {storage.map(s => <StorageCard storage={s} key={s.id} />)}
    </div>;
}
