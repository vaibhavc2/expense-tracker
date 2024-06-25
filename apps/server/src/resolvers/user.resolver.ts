import { users } from "@/dummyData/data.js";

const userResolver = {
  Query: {
    users: async () => {
      return users;
    },
  },
  Mutation: {},
};

export default userResolver;
