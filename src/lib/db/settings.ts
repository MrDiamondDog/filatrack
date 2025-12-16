"use server";

import { ApiRes } from "./types";
import { userSettingsTable } from "@/db/schema/settings";
import { db } from "@/db/drizzle";
import { eq } from "drizzle-orm";
import { usersTable } from "@/db/schema/user";
import { UserSettings } from "@/db/types";
import { apiAuth } from "./helpers";
import { ApiError } from "../errors";

/**
 * Sets the user's username.
 * @param username The new username.
 * @returns Nothing if successful.
 */
export async function setUsername(username: string): Promise<ApiRes<null>> {
    const session = await apiAuth();

    if (!session)
        return ApiError("NotAuthenticated");

    if (username.length > 12)
        return ApiError("InvalidField", "Username too long");

    await db.update(usersTable).set({ name: username })
        .where(eq(usersTable.id, session.user.id!));

    return { data: null };
}

/**
 * Creates userSettings for a user.
 * @returns The new userSettings.
 */
export async function createUserSettings(): Promise<ApiRes<UserSettings>> {
    const session = await apiAuth();

    if (!session)
        return ApiError("NotAuthenticated");

    return {
        data: (await db.insert(userSettingsTable).values({
            userId: session.user.id!,
        })
            .returning())[0],
    };
}

/**
 * Gets the user's userSettings.
 * @returns The user's userSettings.
 */
export async function getUserSettings(): Promise<ApiRes<UserSettings>> {
    const session = await apiAuth();

    if (!session)
        return ApiError("NotAuthenticated");

    let settings = (await db.select().from(userSettingsTable)
        .where(eq(userSettingsTable.userId, session.user.id!)))[0];

    if (!settings)
        settings = (await createUserSettings()).data!;

    return {
        data: settings,
    };
}

/**
 * Updates a user's userSettings.
 * @param newSettings The modified settings data. If a key isn't specified, it won't be modified.
 * @returns The modified settings data.
 */
export async function updateUserSettings(newSettings: Partial<UserSettings>): Promise<ApiRes<UserSettings>> {
    const session = await apiAuth();

    if (!session)
        return ApiError("NotAuthenticated");

    const userSettings = (await db.select().from(userSettingsTable)
        .where(eq(userSettingsTable.userId, session.user.id!)))[0];

    if (!userSettings) {
        return ApiError("ServerError", "No user settings found");
    }

    if (userSettings.userId !== session.user.id)
        return ApiError("NotAuthorized");

    return {
        data: (await db.update(userSettingsTable).set(newSettings)
            .where(eq(userSettingsTable.userId, session.user.id!))
            .returning())[0],
    };
}

/**
 * Deletes a user and all of it's data from Filatrack.
 * @returns Nothing if successful.
 */
export async function deleteUser(): Promise<ApiRes<null>> {
    const session = await apiAuth();

    if (!session)
        return ApiError("NotAuthenticated");

    await db.delete(usersTable).where(eq(usersTable.id, session.user.id!));

    return { data: null };
}
