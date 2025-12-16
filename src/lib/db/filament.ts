"use server";

import { DBObjectParams, ApiRes } from "./types";
import { db } from "@/db/drizzle";
import { filamentLogTable, filamentTable } from "@/db/schema/filament";
import { eq, inArray, and } from "drizzle-orm";
import { Filament, FilamentLog } from "@/db/types";
import { addOrUpdateAnalyticEntry } from "./analytics";
import { apiAuth } from "./helpers";
import { ApiError } from "../errors";
import { app } from ".";
import { boxesTable } from "@/db/schema/boxes";

/**
 * Gets all of the filament a user has created.
 * @returns The list of filament
 */
export async function getAllFilaments(boxId?: string): Promise<ApiRes<Filament[]>> {
    const session = await apiAuth();

    if (!session)
        return ApiError("NotAuthenticated");

    if (boxId)
        return {
            data: await db.select().from(filamentTable)
                .where(and(eq(filamentTable.userId, session.user.id!), eq(filamentTable.box, boxId))),
        };

    return {
        data: await db.select().from(filamentTable)
            .where(eq(filamentTable.userId, session.user.id!)),
    };
};

/**
 * Gets the specific filament a user owns.
 * @param id Filament ID
 * @returns The filament with given ID
 */
export async function getFilament(id: string): Promise<ApiRes<Filament>> {
    const session = await apiAuth();

    if (!session)
        return ApiError("NotAuthenticated");

    let filament = (await db.select().from(filamentTable)
        .where(eq(filamentTable.id, id)))[0];

    if (!filament)
        return ApiError("NotFound");

    if (filament.userId !== session.user.id)
        return ApiError("NotAuthorized");

    if (!filament.shortId)
        filament = (await db.update(filamentTable).set({ shortId: crypto.randomUUID().slice(0, 8) })
            .where(eq(filamentTable.id, filament.id))
            .returning())[0];

    return {
        data: filament,
    };
}

/**
 * Gets a filament by its shortId
 * @param shortId The shortId of the filament
 * @returns The filament or null if not found
 */
export async function getFilamentByShortId(shortId: string): Promise<ApiRes<Filament | null>> {
    const session = await apiAuth();

    if (!session)
        return ApiError("NotAuthenticated");

    const filament = (await db.select().from(filamentTable)
        .where(eq(filamentTable.shortId, shortId)))[0];

    if (filament.userId !== session.user.id!)
        return ApiError("NotAuthorized");

    return {
        data: filament,
    };
}

/**
 * Creates a filament with the specified parameters.
 * @param filament The data for the filament, not including auto-generated values such as IDs.
 * @returns The new filament.
 */
export async function createFilament(filament: DBObjectParams<Omit<Filament, "shortId">>): Promise<ApiRes<Filament>> {
    const session = await apiAuth();

    if (!session)
        return ApiError("NotAuthenticated");

    if (filament.name.length > 32)
        return ApiError("InvalidField", "Filament name too long");

    if (filament.brand.length > 32)
        return ApiError("InvalidField", "Brand name too long");

    addOrUpdateAnalyticEntry(new Date(), {
        filamentCreated: 1,
    });

    // very hacky fix for duplicating filament
    if ((filament as Filament).id)
        delete (filament as Partial<Filament>).id;

    if ((filament as Filament).shortId)
        delete (filament as Partial<Filament>).shortId;

    const newFilament = (await db.insert(filamentTable).values({
        ...filament,
        userId: session.user.id!,
        updatedAt: new Date(),
    })
        .returning())[0];

    if (filament.box)
        await app.boxes.addFilament(filament.box, newFilament.id);

    return {
        data: newFilament,
    };
}

/**
 * Create multiple of the same filament at once
 * @param filament The data for the filament, not including auto-generated values such as IDs.
 * @param amount The amount of this filament to create.
 * @returns The new filament rolls.
 */
export async function createMultipleFilament(filament: DBObjectParams<Omit<Filament, "shortId">>, amount: number)
: Promise<ApiRes<Filament[]>> {
    const session = await apiAuth();

    if (!session)
        return ApiError("NotAuthenticated");

    if (filament.name.length > 32)
        return ApiError("InvalidField", "Filament name too long");

    if (filament.brand.length > 32)
        return ApiError("InvalidField", "Brand name too long");

    if (amount > 50)
        return ApiError("InvalidField", "Too many copies. (max 50)");

    if (amount <= 0)
        return ApiError("InvalidField", "You can't make 0 filament");

    addOrUpdateAnalyticEntry(new Date(), {
        filamentCreated: amount,
    });

    const newFilament: Filament[] = [];

    for (let i = 0; i < amount; i++) {
        newFilament.push((await db.insert(filamentTable).values({
            ...filament,
            userId: session.user.id!,
            updatedAt: new Date(),
        })
            .returning())[0]);
    }

    if (filament.box) {
        const box = (await app.boxes.getBox(filament.box)).data!;

        await db.update(boxesTable).set({
            filamentIds: [...box.filamentIds, ...newFilament.map(f => f.id)],
        })
            .where(eq(boxesTable.id, box.id));
    }

    return {
        data: newFilament,
    };
}

/**
 * Edits an existing filament.
 * @param filamentId The ID of the filament to edit.
 * @param newData The edited data. If a field is not specified in this data, it will not be modified.
 * @returns The modified filament.
 */
export async function editFilament(filamentId: string, newData: Partial<DBObjectParams<Filament>>): Promise<ApiRes<Filament>> {
    const session = await apiAuth();

    if (!session)
        return ApiError("NotAuthenticated");

    if (newData.name && newData.name.length > 32)
        return ApiError("InvalidField", "Filament name too long");

    if (newData.brand && newData.brand.length > 32)
        return ApiError("InvalidField", "Brand name too long");

    const oldFilament = (await db.select().from(filamentTable)
        .where(eq(filamentTable.id, filamentId)))[0];

    if (!oldFilament)
        return ApiError("NotFound");

    if (oldFilament.userId !== session.user.id)
        return ApiError("NotAuthorized");

    return {
        data: (await db.update(filamentTable).set({
            ...newData,
            updatedAt: new Date(),
        })
            .where(eq(filamentTable.id, filamentId))
            .returning())[0],
    };
}

/**
 * Deletes a filament.
 * @param filamentId The filament to delete
 * @returns Nothing if successful
 */
export async function deleteFilament(filamentId: string): Promise<ApiRes<null>> {
    const session = await apiAuth();

    if (!session)
        return ApiError("NotAuthenticated");

    const filament = (await db.select().from(filamentTable)
        .where(eq(filamentTable.id, filamentId)))[0];

    if (!filament)
        return ApiError("NotFound");

    if (filament.userId !== session.user.id)
        return ApiError("NotAuthorized");

    await db.delete(filamentTable).where(eq(filamentTable.id, filamentId));

    if (filament.box) {
        const box = (await app.boxes.getBox(filament.box)).data!;

        await db.update(boxesTable).set({
            filamentIds: [...box.filamentIds.filter(id => id !== filamentId)],
        })
            .where(eq(boxesTable.id, box.id));
    }

    return { data: null };
}

/**
 * Delete multiple filament at once.
 * @param filamentIds The IDs of the filament to delete.
 * @returns Nothing if successful.
 */
export async function deleteFilaments(filamentIds: string[]): Promise<ApiRes<null>> {
    const session = await apiAuth();

    if (!session)
        return ApiError("NotAuthenticated");

    const filaments = await db.select().from(filamentTable)
        .where(inArray(filamentTable.id, filamentIds));

    for (const filament of filaments) {
        if (filament.userId !== session.user.id)
            return ApiError("NotAuthorized");
    }

    await db.delete(filamentTable).where(inArray(filamentTable.id, filamentIds));

    const boxIds = filaments.map(f => f.box).filter(Boolean);

    if (boxIds.length > 0) {
        for (const boxId of boxIds) {
            if (!boxId)
                continue;

            const box = (await app.boxes.getBox(boxId)).data!;

            await db.update(boxesTable).set({
                filamentIds: [...box.filamentIds.filter(id => !filamentIds.includes(id))],
            })
                .where(eq(boxesTable.id, box.id));
        }
    }

    return { data: null };
}

/**
 * Changes the `index` key of a list of filament to match the order of the array.
 * @param newFilamentList The new list of filament in the new order.
 * @returns The new filament list with `index` updated.
 */
export async function reorderFilament(newFilamentList: Filament[]): Promise<ApiRes<Filament[]>> {
    const session = await apiAuth();

    if (!session)
        return ApiError("NotAuthenticated");

    for (const f of newFilamentList)
        if (f.userId !== session.user.id)
            return ApiError("NotAuthorized");

    const res = await Promise.all(newFilamentList.map(async f => (await db.update(filamentTable).set({
        index: f.index,
    })
        .where(eq(filamentTable.id, f.id))
        .returning())[0]));

    return {
        data: res,
    };
}

/**
 * Gets all logs for specified filament
 * @param filamentId The filament to get logs for
 * @returns The logs
 */
export async function getFilamentLogs(filamentId: string): Promise<ApiRes<FilamentLog[]>> {
    const session = await apiAuth();

    if (!session)
        return ApiError("NotAuthenticated");

    const filament = (await db.select().from(filamentTable)
        .where(eq(filamentTable.id, filamentId)))[0];

    if (!filament)
        return ApiError("NotFound");

    if (filament.userId !== session.user.id)
        return ApiError("NotAuthorized");

    return {
        data: await db.select().from(filamentLogTable)
            .where(eq(filamentLogTable.filamentId, filamentId)),
    };
}

/**
 * Creates a log for a filament.
 * @param log The data to create the log with. Must include filamentId.
 * @returns The new log.
 */
export async function createFilamentLog(log: DBObjectParams<FilamentLog>): Promise<ApiRes<{ log: FilamentLog, filament: Filament }>> {
    const session = await apiAuth();

    if (!session)
        return ApiError("NotAuthenticated");

    const filament = (await db.select().from(filamentTable)
        .where(eq(filamentTable.id, log.filamentId)))[0];

    if (!filament)
        return ApiError("NotFound");

    if (filament.userId !== session.user.id)
        return ApiError("NotAuthorized");

    if (log.note && log.note.length > 45)
        return ApiError("InvalidField", "Note too long");

    if (Number.isNaN(log.filamentUsed))
        return ApiError("InvalidField", "Invalid filament used");

    const editRes = await editFilament(filament.id, {
        currentMass: filament.currentMass - log.filamentUsed,
        lastUsed: new Date(),
    });

    if (editRes.error)
        return ApiError("ServerError", `Could not edit specified filament: ${editRes.error.code}, ${editRes.error.info}`);

    addOrUpdateAnalyticEntry(new Date(), {
        logsCreated: 1,
    });

    return {
        data: {
            log: (await db.insert(filamentLogTable).values({
                ...log,
            })
                .returning())[0],
            filament: editRes.data,
        },
    };
}

/**
 * Deletes a filament log.
 * @param log The log to delete.
 * @returns Nothing if successful.
 */
export async function deleteFilamentLog(log: FilamentLog): Promise<ApiRes<null>> {
    const session = await apiAuth();

    if (!session)
        return ApiError("NotAuthenticated");

    const filament = (await db.select().from(filamentTable)
        .where(eq(filamentTable.id, log.filamentId)))[0];

    if (!filament)
        return ApiError("NotFound");

    if (filament.userId !== session.user.id)
        return ApiError("NotAuthorized");

    await db.delete(filamentLogTable).where(eq(filamentLogTable.id, log.id));
    await db.update(filamentTable).set({ currentMass: filament.currentMass + log.filamentUsed })
        .where(eq(filamentTable.id, filament.id));

    return { data: null };
}

/**
 * Edits an existing filament log.
 * @param newLog The modified log data. If a key isn't specified, it will not be modified.
 * @param prevLog The previous log data. filamentUsed must be specified.
 * @returns The modified log.
 */
export async function editFilamentLog(newLog: Partial<FilamentLog>, prevLog: Partial<FilamentLog>)
    : Promise<ApiRes<{ log: FilamentLog, filament?: Filament }>> {
    const session = await apiAuth();

    if (!session)
        return ApiError("NotAuthenticated");

    const filament = (await db.select().from(filamentTable)
        .where(eq(filamentTable.id, newLog.filamentId!)))[0];

    if (!filament)
        return ApiError("NotFound");

    if (filament.userId !== session.user.id)
        return ApiError("NotAuthorized");

    if (newLog.note && newLog.note.length > 45)
        return ApiError("InvalidField", "Note too long");

    if (newLog.filamentUsed && Number.isNaN(newLog.filamentUsed))
        return ApiError("InvalidField", "Invalid filament used");

    let editRes: ApiRes<Filament> | null = null;
    if (newLog.filamentUsed) {
        if (!prevLog.filamentUsed)
            return ApiError("InvalidField", "Previous log must contain filamentUsed.");

        editRes = await editFilament(filament.id, {
            currentMass: filament.currentMass + prevLog.filamentUsed - newLog.filamentUsed,
        });

        if (editRes.error)
            return ApiError("ServerError", `Could not edit specified filament: ${editRes.error.code}, ${editRes.error.info}`);
    }

    return {
        data: {
            log: (await db.update(filamentLogTable).set({ ...newLog })
                .where(eq(filamentLogTable.id, newLog.id!))
                .returning())[0],
            filament: editRes?.data ?? undefined,
        },
    };
}
