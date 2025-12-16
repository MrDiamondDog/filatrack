import { integer, pgTable, primaryKey, text, timestamp } from "drizzle-orm/pg-core";
import { AdapterAccountType } from "next-auth/adapters";
import { id, timestamps } from "./columns.helpers";

export const usersTable = pgTable("user", {
    ...id,

    name: text("name"),
    email: text("email").unique(),
    emailVerified: timestamp("emailVerified", { mode: "date" }),
    image: text("image"),

    lastAccessed: timestamp("lastAccessed", { mode: "date" }),

    ...timestamps,
});

export const accountsTable = pgTable(
    "account",
    {
        userId: text("userId")
            .notNull()
            .references(() => usersTable.id, { onDelete: "cascade" }),
        type: text("type").$type<AdapterAccountType>()
            .notNull(),
        provider: text("provider").notNull(),
        providerAccountId: text("providerAccountId").notNull(),
        refresh_token: text("refresh_token"),
        access_token: text("access_token"),
        expires_at: integer("expires_at"),
        token_type: text("token_type"),
        scope: text("scope"),
        id_token: text("id_token"),
        session_state: text("session_state"),

        ...timestamps,
    },
    account => [
        {
            compoundKey: primaryKey({
                columns: [account.provider, account.providerAccountId],
            }),
        },
    ]
);

export const sessionsTable = pgTable("session", {
    sessionToken: text("sessionToken").primaryKey(),
    userId: text("userId")
        .notNull()
        .references(() => usersTable.id, { onDelete: "cascade" }),
    expires: timestamp("expires", { mode: "date" }).notNull(),

    ...timestamps,
});

export const verificationTokensTable = pgTable(
    "verificationToken",
    {
        identifier: text("identifier").notNull(),
        token: text("token").notNull(),
        expires: timestamp("expires", { mode: "date" }).notNull(),

        ...timestamps,
    },
    verificationToken => [
        {
            compositePk: primaryKey({
                columns: [verificationToken.identifier, verificationToken.token],
            }),
        },
    ]
);
