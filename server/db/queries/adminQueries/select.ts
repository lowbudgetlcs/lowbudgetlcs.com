import { and, eq } from "drizzle-orm";
import { db } from "../..";
import { adminUsersInWebsite } from "../../schema";
export const getUser = async (username: string, password: string) => {
  const user = await db
    .select()
    .from(adminUsersInWebsite)
    .where(and(eq(adminUsersInWebsite.userName, username), eq(adminUsersInWebsite.password, password)))
    .limit(1)
    .then((res) => res[0]);
  return user;
};
