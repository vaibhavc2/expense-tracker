import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import cors from "cors";
import express from "express";
import http from "http";
import { connectDb } from "./db/connectDb.js";
import resolvers from "./resolvers/index.js";
import typeDefs from "./typeDefs/index.js";

const app = express();

const httpServer = http.createServer(app);

// Create an instance of ApolloServer
const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

const port = process.env.PORT || 4000;

// Start the server
(async () => {
  try {
    await server.start();

    app.use(
      "/",
      cors(),
      express.json(),
      expressMiddleware(server, {
        context: async ({ req }) => ({ req }),
      }),
    );

    await new Promise((resolve) =>
      httpServer.listen({ port }, resolve as () => void),
    );

    // Connect the Database
    await connectDb();
  } catch (error) {
    console.error(`Error starting server!\nError: ${error}`);
  }
})();

const url = `http://localhost:${port}`;

console.log(`🚀  Server ready at: ${url}`);
