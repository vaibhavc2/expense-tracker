import { User } from "@/models";
import { verifyPassword } from "@/utils/password.util";
import { GraphQLLocalStrategy } from "graphql-passport";
import passport from "passport";

export const passportConfig = async () => {
  passport.serializeUser((user: any, done) => {
    console.log("Serializing user...");
    done(null, user._id);
  });

  passport.deserializeUser(async (id: string, done) => {
    console.log("Deserializing user...");
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      console.error("Error deserializing user!\nError: ", err);
      return done(err);
    }
  });

  passport.use(
    new GraphQLLocalStrategy(async (_username, _password, done) => {
      try {
        const username = _username as string;
        const password = _password as string;

        const user = await User.findOne({ username });
        if (!user || !(await verifyPassword(password, user.password))) {
          throw new Error("Invalid username or password!");
        }

        done(null, user);
      } catch (error) {
        console.error("Error authenticating user!\nError: ", error);
        return done(error);
      }
    }),
  );
};
