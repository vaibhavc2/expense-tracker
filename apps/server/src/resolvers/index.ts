import { mergeResolvers } from "@graphql-tools/merge";
import transactionResolver from "./transaction.resolver.js";
import userResolver from "./user.resolver.js";

const resolvers = mergeResolvers([userResolver, transactionResolver]);

export default resolvers;
