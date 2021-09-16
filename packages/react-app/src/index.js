import React from "react";
import ReactDOM from "react-dom";
import MyErrorBoundary from "./Errors/MyErrorBoundary";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import ApolloClient from "apollo-boost";
// import { ApolloProvider } from "@apollo/react-hooks";
import "./index.css";
import "nes.css/css/nes.min.css";
import "nes.icons/css/nes-icons.min.css";
import "@fontsource/press-start-2p";
import "./custom.css";
import App from "./App";

// You should replace this url with your own and put it into a .env file
// See all subgraphs: https://thegraph.com/explorer/
// const client = new ApolloClient({
//   uri: "https://api.thegraph.com/subgraphs/name/paulrberg/create-eth-app",
// });

ReactDOM.render(
  // <ApolloProvider client={client}>
  <MyErrorBoundary>
    <ToastContainer />
    <App />
  </MyErrorBoundary>,
  // </ApolloProvider>,
  document.getElementById("root")
);
