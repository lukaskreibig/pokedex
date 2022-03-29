import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { Route, BrowserRouter, Routes } from "react-router-dom";

const client = new ApolloClient({
  uri: "https://graphql-pokeapi.graphcdn.app/",
  cache: new InMemoryCache(),
});

ReactDOM.render(
    <ApolloProvider client={client}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App favourite={false} />} />
          <Route path="favourites" element={<App favourite={true} />} />
        </Routes>
      </BrowserRouter>
      ,
    </ApolloProvider>,
  document.getElementById("root")
);
