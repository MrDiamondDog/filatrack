import { pb } from "@/api/pb";
import { FilamentRecord } from "@/types/pb";

export async function deleteFilament(filament: FilamentRecord) {
    // for (const print of filament.prints ?? [])
    //     await pb.collection("prints").update(print, {
    //         "filamentRolls-": filament.id,
    //     });

    await pb.collection("filament").delete(filament.id);
}
