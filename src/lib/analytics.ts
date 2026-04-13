import { pb } from "@/api/pb";
import { getPublicEnv } from "@/public-env";
import { UsersRecord } from "@/types/pb";
import * as Swetrix from "swetrix";

type AnalyticsEvent =
    "FILAMENT_CREATE" |
    "STORAGE_CREATE" |
    "PRINT_CREATE" |
    "PRESET_CREATE" |
    "DELETE_USER" |
    "QR_CREATE" |
    "SCAN_QR" |
    "OUTBOUND_CLICK";

export function analyticsEvent(event: AnalyticsEvent, meta: any) {
    const user = pb.authStore.record as UsersRecord | null;

    if (!user || !user.allowAnalytics)
        return;

    if (!getPublicEnv().SWETRIX_ID)
        return;

    Swetrix.track({
        ev: event,
        meta,
    });
}
