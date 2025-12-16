import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "./db/drizzle";
import { app } from "./lib/db";

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: DrizzleAdapter(db),
    providers: [
        GitHub({
            clientId: process.env.AUTH_GITHUB_ID!,
            clientSecret: process.env.AUTH_GITHUB_SECRET!,
            allowDangerousEmailAccountLinking: true,
        }),
        Google({
            clientId: process.env.AUTH_GOOGLE_ID!,
            clientSecret: process.env.AUTH_GOOGLE_SECRET!,
            allowDangerousEmailAccountLinking: true,
        }),
    ],
    secret: process.env.AUTH_SECRET!,
    trustHost: true,
    // debug: process.env.NODE_ENV !== "production",
    pages: {
        signIn: "/login",
        error: "/login",
    },
    events: {
        async signIn({ user, account, profile, isNewUser }) {
            if (isNewUser) {
                await app.analytics.addOrUpdateAnalyticEntry(new Date(), {
                    signUps: 1,
                });
            }
        },
        session() {
            app.users.setUserAccessed();
        },
    },
});
