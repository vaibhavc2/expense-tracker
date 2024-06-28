import { User } from "@/models";
import { LoginInput, SignUpInput, UserContext } from "@/types/global";
import { hashPassword } from "@/utils/password.util";

const avatarUrl = process.env.AVATAR_URL as string;

const userResolver = {
  Query: {
    // users: async (parent: unknown, data: unknown, context: UserContext) => {
    //   return context.getUser(); //! to be implemented
    // },
    authUser: async (parent: unknown, data: unknown, context: UserContext) => {
      try {
        return await context.getUser();
      } catch (error) {
        console.error("Error getting authenticated user: ", error);

        if (error instanceof Error) {
          throw new Error(
            error.message ||
              "Something went wrong getting the authenticated user. Please try again.",
          );
        } else {
          throw new Error(
            "An unknown error occurred getting the authenticated user. Please try again.",
          );
        }
      }
    },
    user: async (
      parent: unknown,
      { userId }: { userId: string },
      context: UserContext,
    ) => {
      try {
        return await User.findById(userId);
      } catch (error) {
        console.error("Error getting user by ID: ", error);

        if (error instanceof Error) {
          throw new Error(
            error.message ||
              "Something went wrong getting the user by ID. Please try again.",
          );
        } else {
          throw new Error(
            "An unknown error occurred getting the user by ID. Please try again.",
          );
        }
      }
    },
  },
  Mutation: {
    signUp: async (
      parent: unknown,
      { input }: { input: SignUpInput },
      context: UserContext,
    ) => {
      try {
        const { username, name, password, gender } = input;

        if (!username || !name || !password || !gender) {
          throw new Error("Please fill in all fields");
        }

        const existingUser = await User.findOne({ username });

        if (existingUser) {
          throw new Error("User already exists");
        }

        const hashedPassword = await hashPassword(password);

        const profilePicture = `${avatarUrl}/${gender === "male" ? "boy" : "girl"}/?username=${username}`;

        const user = await new User({
          username,
          name,
          gender,
          password: hashedPassword,
          profilePicture,
        }).save();

        await context.login(user);

        return user;
      } catch (error) {
        console.error("Error signing up user: ", error);

        // Type guard to check if error is an instance of Error
        if (error instanceof Error) {
          throw new Error(
            error.message ||
              "Something went wrong during sign up. Please try again.",
          );
        } else {
          // Fallback error message if the error is not an instance of Error
          throw new Error(
            "An unknown error occurred during sign up. Please try again.",
          );
        }
      }
    },

    login: async (
      parent: unknown,
      { input }: { input: LoginInput },
      context: UserContext,
    ) => {
      try {
        const { username, password } = input;

        if (!username || !password) {
          throw new Error("Please fill in all fields");
        }

        const { user, info } = await context.authenticate("graphql-local", {
          username,
          password,
        } as any);

        if (!user) {
          throw new Error("Invalid credentials!");
        }

        await context.login(user);

        return user;
      } catch (error) {
        console.error("Error logging in user: ", error);

        // Type guard to check if error is an instance of Error
        if (error instanceof Error) {
          throw new Error(
            error.message ||
              "Something went wrong during login. Please try again.",
          );
        } else {
          // Fallback error message if the error is not an instance of Error
          throw new Error(
            "An unknown error occurred during login. Please try again.",
          );
        }
      }
    },

    logout: async (parent: unknown, data: unknown, context: any) => {
      try {
        await context.logout();

        context.req.session?.destroy((err: unknown) => {
          if (err) {
            console.error("Error destroying session: ", err);
            throw new Error("Error destroying session");
          }
        });

        context.res.clearCookie("connect.sid");

        return { message: "Logged out successfully" };
      } catch (error) {
        console.error("Error logging out user: ", error);

        // Type guard to check if error is an instance of Error
        if (error instanceof Error) {
          throw new Error(
            error.message ||
              "Something went wrong during logout. Please try again.",
          );
        } else {
          // Fallback error message if the error is not an instance of Error
          throw new Error(
            "An unknown error occurred during logout. Please try again.",
          );
        }
      }
    },
  },
};

export default userResolver;
