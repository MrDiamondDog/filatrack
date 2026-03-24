import { pb } from "@/api/pb";
import { RecordOptions } from "pocketbase";

export async function getOrCreateSettings<T>(userId: string, options?: RecordOptions): Promise<T> {
    try {
        return await pb.collection("userSettings").getFirstListItem<T>(`user.id = "${userId}"`, options);
    } catch {
        return await pb.collection("userSettings").create<T>({
            user: userId,
            tempUnit: "c",
            massUnit: "g",
            lengthUnit: "mm",
        }, options);
    }
}
