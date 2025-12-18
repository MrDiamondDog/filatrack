import { boxesTable } from "./schema/boxes";
import { filamentLogTable, filamentTable } from "./schema/filament";
import { printsTable } from "./schema/prints";
import { userSettingsTable } from "./schema/settings";
import { usersTable } from "./schema/user";

export type Filament = typeof filamentTable.$inferSelect;
export type FilamentLog = typeof filamentLogTable.$inferSelect;

export type User = typeof usersTable.$inferSelect;
export type UserSettings = typeof userSettingsTable.$inferSelect;

export type Print = typeof printsTable.$inferSelect;

export type Box = typeof boxesTable.$inferSelect;
