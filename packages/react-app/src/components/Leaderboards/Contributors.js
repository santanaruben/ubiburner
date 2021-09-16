import React from "react";
import { ethers } from "ethers";

export default function Contributors(props) {
  return (
    <>
      <div>
        <i className="nes-icon withoutBorder trophy"></i>
      </div>
      <div
        className="nes-container is-dark with-title"
        style={{
          wordBreak: "break-word",
          width: "-webkit-fill-available",
          textAlign: "center",
        }}
      >
        <p className="title">Contributors' Leaderboard</p>
        <div
          className="nes-table-responsive"
          style={{
            wordBreak: "break-word",
            width: "-webkit-fill-available",
            display: "grid",
          }}
        >
          <table className="nes-table is-bordered is-dark">
            <thead>
              <tr>
                <th>Address</th>
                <th style={{ minWidth: "100px" }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {props.items.slice(0, 10).map((b, i) => {
                return (
                  <tr key={i}>
                    <td>{b.from}</td>
                    <td>{ethers.utils.formatEther(b.amount)} ETH</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
