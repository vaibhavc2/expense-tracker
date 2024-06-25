import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import resolvers from "./resolvers/index.js";
import typeDefs from "./typeDefs/index.js";

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  // context: async ({ req }) => ({ token: req.headers.token })
  context: async ({ req }) => ({}) as any,
  listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);
