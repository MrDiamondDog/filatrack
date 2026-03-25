import { pb } from "@/api/pb";
import { FilamentRecord } from "@/types/pb";
import { StorageWithFilament } from "@/types/storage";
import { modifyArrayItem } from "./util/array";
import { toastError } from "./util/error";

export async function deleteFilament(filament: FilamentRecord) {
    // for (const print of filament.prints ?? [])
    //     await pb.collection("prints").update(print, {
    //         "filamentRolls-": filament.id,
    //     });

    await pb.collection("filament").delete(filament.id);
}

export async function moveFilament(filament: FilamentRecord, destinationId: string, storages: StorageWithFilament[])
    : Promise<{ newStorages: StorageWithFilament[], newFilament: FilamentRecord } | undefined> {
    if (destinationId === filament.storage) {
        // remove it from storage
        return await Promise.all([
            pb.collection("storage").update<StorageWithFilament>(destinationId, {
                "filament-": filament.id,
            }, { expand: "filament" }),
            pb.collection("filament").update(filament.id, {
                storage: null,
            }),
        ])
            .then(([newStorage, newFilament]) => ({ newStorages: modifyArrayItem(storages, newStorage, "id"), newFilament }))
            .catch(e => toastError("Could not move filament", e));
    }

    return await Promise.all([
        pb.collection("storage").update<StorageWithFilament>(destinationId, {
            "filament+": filament.id,
        }, { expand: "filament" }),
        pb.collection("filament").update(filament.id, {
            storage: destinationId,
        }),
        (filament.storage && pb.collection("storage").update<StorageWithFilament>(filament.storage, {
            "filament-": filament.id,
        }, { expand: "filament" })),
    ])
        .then(([storage, newFilament, prevStorage]) => {
            let newStorages = modifyArrayItem(storages, storage, "id");

            if (prevStorage)
                newStorages = modifyArrayItem(newStorages, prevStorage, "id");

            return { newStorages, newFilament };
        })
        .catch(e => toastError("Could not move filament", e));
}
