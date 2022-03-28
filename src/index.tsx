import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import {
  BrowserRouter as Router,
  Route,
  BrowserRouter,
  Routes
} from "react-router-dom";

const client = new ApolloClient({
  uri: "https://graphql-pokeapi.graphcdn.app/",
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<App favourite={false} />} />
      <Route path="favourites" element={<App favourite={true} />} />
    </Routes>
  </BrowserRouter>,
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
