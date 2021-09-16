import React from "react";

export default function ETH(props) {
  return (
    <>
      <center>
        <i className="nes-icon withoutBorder coin"></i>
      </center>

      <div
        className="nes-container is-dark with-title"
        style={{
          wordBreak: "break-word",
          width: "-webkit-fill-available",
          textAlign: "center",
        }}
      >
        <p className="title">ETH contract balance</p>
        <p>{props.children}</p>
      </div>
    </>
  );
}
