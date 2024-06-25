import { users } from "@/dummyData/data";

const userResolver = {
  Query: {
    users: async () => {
      return users;
    },
    user: async (_: any, { userId }: { userId: string }) => {
      return users.find((user) => user._id === userId);
    },
  },
  Mutation: {},
};

export default userResolver;
