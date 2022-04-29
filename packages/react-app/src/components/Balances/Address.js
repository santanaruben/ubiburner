import React from "react";
import { Link } from "../../components";
import { addresses } from "@project/contracts";

export default function Address(props) {
  return (
    <>
      <center>
        <i className="nes-icon withoutBorder star"></i>
      </center>
      <div
        className="nes-container is-dark with-title"
        style={{
          wordBreak: "break-word",
          width: "-webkit-fill-available",
          textAlign: "center",
          minHeight: "195px",
        }}
      >
        <p
          className="title"
          title="If you want to contribute, send only ETH to this address"
        >
          Contract address
        </p>
        <p style={{ marginBottom: "0px" }}>{props.children}</p>
        <br />
        <p style={{ marginBottom: "0px" }}>
          If you want to contribute, you can orient some smart contract fees
          here or just send ETH to this address{" "}
          <span role="img" aria-label="up" style={{ fontSize: "16px" }}>
            👆🏻
          </span>
        </p>
        <br />
        <Link
          href={
            "https://etherscan.io/address/" +
            addresses.contractUBIburner +
            "#code"
          }
        >
          see the code in etherscan
        </Link>
      </div>
    </>
  );
}
