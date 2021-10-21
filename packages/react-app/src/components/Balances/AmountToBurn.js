import React from "react";

export default function AmountToBurn(props) {
  return (
    <div style={{ marginTop: "-15px" }}>
      <img
        src="/flame2.png"
        alt="flame2"
        // style={{ left: "65%" }}
        width="50px"
      />
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
          The protocol can burn
        </p>
        {/* <p style={{ marginBottom: "0px" }}>{props.children}</p> */}
        <br />
        <p style={{ marginBottom: "0px" }}>With this contract balance</p>
        <br />
        <br />
        <p style={{ marginBottom: "0px" }}>{props.data} UBIs</p>
      </div>
    </div>
  );
}
