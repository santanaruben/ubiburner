import React from "react";

export default function NoETH(props) {
  function play() {
    document.getElementById("dialog-play").showModal();
  }

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
          minHeight: "195px",
        }}
      >
        <p className="title">ETH contract balance</p>
        <p>
          The ETH contract balance is empty{" "}
          <span role="img" aria-label="emoji">
            ♻️
          </span>
          <br />
          come back later to check balances{" "}
          <span role="img" aria-label="emoji">
            😀
          </span>
          <br />
          <br />
          Meanwhile, you could play a game
          <br />
          <button
            type="button"
            className="nes-btn"
            style={{ marginTop: "20px" }}
            onClick={play}
          >
            Play
          </button>
        </p>
      </div>

      <section>
        <dialog
          className="nes-dialog is-rounded is-dark"
          id="dialog-play"
          style={{ width: "auto", height: "auto", backgroundColor: "#111" }}
        >
          <form method="dialog">
            <p className="title" style={{ color: "white" }}>
              Play
            </p>
            <section className="message-list">
              <object
                type="text/html"
                aria-label="game"
                data="https://santanaruben.github.io/enduro"
                style={{
                  width: "90vw",
                  height: "91vh",
                  transform: "scale(.8)",
                  marginLeft: "-20px",
                }}
              />
            </section>
            <menu
              className="dialog-menu"
              style={{
                textAlign: "end",
              }}
            >
              <button className="nes-btn">close</button>
            </menu>
          </form>
        </dialog>
      </section>
    </>
  );
}
