import { getPublicEnv } from "@/public-env";
import { TypedPocketBase } from "@/types/pb";
import PocketBase from "pocketbase";

export const pb = new PocketBase(getPublicEnv().PB_URL) as TypedPocketBase;
