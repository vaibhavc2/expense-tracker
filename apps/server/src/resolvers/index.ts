import { BaseContext } from "@apollo/server";
import { mergeResolvers } from "@graphql-tools/merge";
import transactionResolver from "./transaction.resolver";
import userResolver from "./user.resolver";

const resolvers = mergeResolvers<unknown, BaseContext>([
  userResolver,
  transactionResolver,
]);

export default resolvers;
