import { mergeTypeDefs } from "@graphql-tools/merge";
import transactionTypeDef from "./transaction.typeDef";
import userTypeDef from "./user.typeDef";

const typeDefs = mergeTypeDefs([userTypeDef, transactionTypeDef]);

export default typeDefs;
