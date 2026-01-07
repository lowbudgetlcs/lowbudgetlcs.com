import passport from "passport";
import { Strategy } from "passport-local";
import { getUser } from "../../../db/queries/adminQueries/select";

passport.use(
  new Strategy(async (username: string, password: string, done: Function) => {
    try {
      const user = await getUser(username, password);
      if (!user) {
        throw new Error("Invalid username or password");
      };
      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  })
);

