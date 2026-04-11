import { FilamentRecord, StorageResponse } from "./pb";

export type StorageWithFilament = StorageResponse<{ filament: FilamentRecord[] }>;
