import React from "react";
import { Link } from "../../components";

export default function Welcome() {
  return (
    <>
      <p style={{ textAlign: "justify", fontSize: "10px" }}>
        UBI Burner Contract
      </p>
      <br />
      <div className="container-fluid boots">
        <div className="row">
          <div className="col boots">
            <div
              className="nes-container is-dark with-title"
              style={{
                wordBreak: "break-word",
                width: "-webkit-fill-available",
                textAlign: "justify",
                minHeight: "100px",
                marginBottom: "25px"
              }}
            >
              <p className="title">Contract logic</p>
              <div className="lists">
                <ul className="nes-list is-circle">
                  <li>The contract receives ETH.</li>
                  <li>That ETH is used to buy UBI from Uniswap.</li>
                  <li>
                    UBI that is purchased, is trapped in the contract forever.
                  </li>
                  <li>Therefore those UBIs are considered burned.</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-6 boots">
            <div
              className="nes-container is-dark with-title"
              style={{
                wordBreak: "break-word",
                width: "-webkit-fill-available",
                textAlign: "justify",
                minHeight: "100px",
              }}
            >
              <p className="title">Mechanism reasoning</p>
              <p
                style={{
                  fontSize: "10px",
                }}
              >
                If a contract does not have a built-in way to send funds from it
                (like a function that could transfer a token), there is no way
                to retrieve that token from the contract. You can check it in{" "}
                <Link
                  href="https://ethereum.stackexchange.com/questions/34559/i-accidentally-sent-a-token-to-a-token-contract-can-i-get-it-back"
                  style={{ fontSize: "10px" }}
                >
                  this
                </Link>{" "}
                and other StackExchange questions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
