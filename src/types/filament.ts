import { FilamentRecord, PrintsRecord } from "./pb";

export type FilamentWithPrints = FilamentRecord & { expand: { prints: PrintsRecord[] }};
