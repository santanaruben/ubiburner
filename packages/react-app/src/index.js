import React from "react";
import ReactDOM from "react-dom";
import MyErrorBoundary from "./Errors/MyErrorBoundary";
import { DAppProvider, Mainnet } from "@usedapp/core";
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

const INFURA_PROJECT_ID = "defba93b47f748f09fcead8282b9e58e";
const config = {
  readOnlyChainId: Mainnet.chainId,
  readOnlyUrls: {
    [Mainnet.chainId]: "https://mainnet.infura.io/v3/" + INFURA_PROJECT_ID,
  },
}

ReactDOM.render(
  // <ApolloProvider client={client}>
  <MyErrorBoundary>
    <ToastContainer />
    <DAppProvider config={config}>
      <App />
    </DAppProvider>
  </MyErrorBoundary>,
  // </ApolloProvider>,
  document.getElementById("root")
);
