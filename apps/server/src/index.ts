import { passportConfig } from "@/auth/passport.config";
import { connectDb } from "@/db/connectDb";
import resolvers from "@/resolvers";
import typeDefs from "@/typeDefs";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import ConnectMongoDBSession from "connect-mongodb-session";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import session from "express-session";
import { buildContext } from "graphql-passport";
import http from "http";
import passport from "passport";

// Load the environment variables
dotenv.config();

// Configure the Passport Auth
passportConfig();

// Create an instance of Express and HTTP Server
const app = express();
const httpServer = http.createServer(app);
const port = (process.env.PORT || 4000) as number;

// Create an instance of ApolloServer
const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

// Set up the session store
const MongoDBStore = ConnectMongoDBSession(session);
const store = new MongoDBStore({
  uri: process.env.MONGO_URI as string,
  collection: "sessions",
});

store.on("error", (error) => {
  console.error(
    `Something went wrong!\nError at MongoDBStore from ConnectMongoDBSession: ${error}`,
  );
});

// Set up the session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
    store,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
    },
  }),
  passport.initialize(),
  passport.session(),
);

// Start the server
(async () => {
  try {
    await server.start();

    app.use(
      "/",
      cors({
        origin: process.env.FRONTEND_URI || "http://localhost:3000",
        credentials: true,
      }),
      express.json(),
      expressMiddleware(server, {
        context: async ({ req, res }) => buildContext({ req, res }),
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
