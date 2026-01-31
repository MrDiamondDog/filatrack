import { TypedPocketBase } from "@/types/pb";
import PocketBase from "pocketbase";

export const pb = new PocketBase(process.env.NEXT_PUBLIC_PB_URL) as TypedPocketBase;
