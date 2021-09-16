import React from "react";

export default function UBI(props) {
  return (
    <div style={{marginTop: "-15px"}}>
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
        }}
      >
        <p className="title">UBIs burned</p>
        <p>{props.children}</p>
      </div>
    </div>
  );
}
