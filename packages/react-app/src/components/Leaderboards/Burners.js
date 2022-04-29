import React from "react";

export default function Burners(props) {
  return (
    <>
      <div>
        <i className="nes-icon withoutBorder heart"></i>
      </div>
      <div
        className="nes-container is-dark with-title"
        style={{
          wordBreak: "break-word",
          width: "-webkit-fill-available",
          textAlign: "center",
        }}
      >
        <p className="title">Burners' Leaderboard</p>
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
                <th style={{ minWidth: "100px" }}>Times</th>
              </tr>
            </thead>
            <tbody>
              {
                // pushers &&
                props.items.slice(0, 10).map((b, i) => {
                  return (
                    <tr key={i}>
                      <td>{b.from}</td>
                      <td>{b.quantity}</td>
                    </tr>
                  );
                })
              }
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
