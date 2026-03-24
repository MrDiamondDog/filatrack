import { FilamentRecord } from "@/types/pb";
import FilamentIcon from "./FilamentIcon";
import { HoverCardContent, HoverCardRoot, HoverCardTrigger } from "../base/HoverCard";
import FilamentCard from "./FilamentCard";
import Link from "next/link";

export default function FilamentTinyCard({ filament }: { filament: FilamentRecord }) {
    return <HoverCardRoot>
        <HoverCardTrigger asChild>
            <Link className="unstyled block" href={`/app/filament/${filament.id}`}>
                <FilamentIcon filament={filament} size={32} />
            </Link>
        </HoverCardTrigger>
        <HoverCardContent>
            <FilamentCard filament={filament} noninteractable storagesList={[]} />
        </HoverCardContent>
    </HoverCardRoot>;
}
