"use server";

import { db } from "@/db/drizzle";
import { ApiError } from "../errors";
import { apiAuth } from "./helpers";
import { ApiRes } from "./types";
import { usersTable } from "@/db/schema/user";
import { eq } from "drizzle-orm";
import { User } from "@/db/types";

export async function setUserAccessed(): Promise<ApiRes<Date>> {
    const session = await apiAuth();

    if (!session)
        return ApiError("NotAuthenticated");

    const res = (await db.update(usersTable).set({ lastAccessed: new Date() })
        .where(eq(usersTable.id, session.user.id))
        .returning())[0];

    return { data: res.lastAccessed || new Date() };
}

export async function getUser(): Promise<ApiRes<User>> {
    const session = await apiAuth();

    if (!session)
        return ApiError("NotAuthenticated");

    return {
        data: (await db.select().from(usersTable)
            .where(eq(usersTable.id, session.user.id)))[0],
    };
}
