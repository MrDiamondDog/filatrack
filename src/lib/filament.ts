import { pb } from "@/api/pb";
import { FilamentRecord } from "@/types/pb";
import { StorageWithFilament } from "@/types/storage";
import { modifyArrayItem } from "./util/array";
import { toastError } from "./util/error";

export async function addFilament(filament: FilamentRecord, destinationId: string, storages: StorageWithFilament[])
    : Promise<{ newStorages: StorageWithFilament[], newFilament: FilamentRecord } | undefined> {
    return await Promise.all([
        // Add to storage
        pb.collection("storage").update<StorageWithFilament>(destinationId, {
            "filament+": filament.id,
        }, { expand: "filament" }),
        // Update storage field
        pb.collection("filament").update(filament.id, {
            storage: destinationId,
        }),
    ])
        .then(([newStorage, newFilament]) => ({ newStorages: modifyArrayItem(storages, newStorage, "id"), newFilament }))
        .catch(e => toastError("Could not move filament", e));
}

export async function moveOrRemoveFilament(filament: FilamentRecord, destinationId: string, storages: StorageWithFilament[])
    : Promise<{ newStorages: StorageWithFilament[], newFilament: FilamentRecord } | undefined> {
    if (destinationId === filament.storage)
        return removeFilament(filament, destinationId, storages);
    return moveFilament(filament, destinationId, storages);
}

export async function removeFilament(filament: FilamentRecord, destinationId: string, storages: StorageWithFilament[])
    : Promise<{ newStorages: StorageWithFilament[], newFilament: FilamentRecord } | undefined> {
    return await Promise.all([
        // Remove from storage
        pb.collection("storage").update<StorageWithFilament>(destinationId, {
            "filament-": filament.id,
        }, { expand: "filament" }),
        // Update storage field
        pb.collection("filament").update(filament.id, {
            storage: null,
        }),
    ])
        .then(([newStorage, newFilament]) => ({ newStorages: modifyArrayItem(storages, newStorage, "id"), newFilament }))
        .catch(e => toastError("Could not move filament", e));
}

export async function moveFilament(filament: FilamentRecord, destinationId: string, storages: StorageWithFilament[])
    : Promise<{ newStorages: StorageWithFilament[], newFilament: FilamentRecord } | undefined> {
    console.log(filament.storage);
    return await Promise.all([
        // Add to new storage
        pb.collection("storage").update<StorageWithFilament>(destinationId, {
            "filament+": filament.id,
        }, { expand: "filament" }),
        // Update filament storage field
        pb.collection("filament").update(filament.id, {
            storage: destinationId,
        }),
        // Remove from previous storage, if necessary
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
