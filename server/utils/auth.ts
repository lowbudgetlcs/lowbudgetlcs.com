import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db";
import * as schema from "../db/schema";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
        schema: {
            user: schema.authUserInWebsite,
            session: schema.authSessionInWebsite,
            account: schema.authAccountInWebsite,
            verification: schema.authVerificationInWebsite,
        },
    }),
    emailAndPassword: {
        enabled: true,
    },
});

