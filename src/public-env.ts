import { createPublicEnv } from "next-public-env";

// This is necessary for the docker container to find the Pocketbase URL at runtime, since it can't be baked into the build.
export const { getPublicEnv, PublicEnv } = createPublicEnv({
    NODE_ENV: process.env.NODE_ENV,
    PRODUCTION: process.env.PRODUCTION === "true",
    APP_URL: process.env.APP_URL,
    PB_URL: process.env.PB_URL,
    SWETRIX_URL: process.env.SWETRIX_URL,
    SWETRIX_ID: process.env.SWETRIX_ID,
});
