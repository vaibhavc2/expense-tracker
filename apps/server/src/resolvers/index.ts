import { mergeResolvers } from "@graphql-tools/merge";
import transactionResolver from "./transaction.resolver";
import userResolver from "./user.resolver";

const resolvers = mergeResolvers([userResolver, transactionResolver]);

export default resolvers;
