import { pb } from "@/api/pb";
import FilamentIcon from "./FilamentIcon";
import { FilamentRecord, UsersRecord } from "@/types/pb";
import { getFilamentCardKey } from "@/lib/filamentKeys";
import { EmptyCell } from "../base/Table";

export default function FilamentRow({ filament }: { filament: FilamentRecord }) {
    const user = pb.authStore.record as UsersRecord | null;

    if (!user)
        return null;

    return <tr>
        <td><FilamentIcon filament={filament} size={36} /></td>
        <td>{filament.name}</td>
        <td className="relative">
            <div style={{ backgroundColor: filament.color }} className="rounded-lg absolute inset-2" />
        </td>

        {((user.shownFilamentCardKeys as string[]) ?? []).map(key => {
            const filamentKey = getFilamentCardKey(key);
            if (!filamentKey)
                return null;

            return <td key={key}>
                {filamentKey.render ?
                    (filamentKey.render(filament) ?? <EmptyCell />) :
                    (filament[filamentKey.key] ? `${filament[filamentKey.key]}` : <EmptyCell />)
                }
            </td>;
        })}
    </tr>;
}
