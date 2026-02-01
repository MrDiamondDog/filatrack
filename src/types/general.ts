export type DBDates = {
    created: Date,
    updated: Date,
}

export type Create<T> = Omit<T, "id" | "user" | "created" | "updated">;
