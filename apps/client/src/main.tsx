import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import { GridBackground } from "./components/ui/GridBackground.tsx";
import "./index.css";

const client = new ApolloClient({
  uri:
    String(import.meta.env.VITE_BACKEND_URI + "/graphql") ??
    "http://localhost:4000/graphql",
  cache: new InMemoryCache(),
  credentials: "include",
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <BrowserRouter>
        <GridBackground>
          <App />
        </GridBackground>
      </BrowserRouter>
    </ApolloProvider>
  </React.StrictMode>,
);
