import React from "react";
import { Link } from "../../components";

export default function Acknowledgments() {
  function acknowledgments() {
    document.getElementById("dialog-acknowledgments").showModal();
  }

  return (
    <>
      <span
        className="nes-pointer"
        onClick={() => acknowledgments()}
        style={{ textAlign: "center", color: "#2995aa", fontSize: "10px" }}
      >
        Acknowledgments
      </span>

      <section>
        <dialog
          className="nes-dialog is-dark is-rounded"
          id="dialog-acknowledgments"
        >
          <form method="dialog" style={{ color: "white" }}>
            <p className="title">Acknowledgments</p>
            <br />
            <section
              className="message-list acknowledgments"
              style={{ wordBreak: "break-word" }}
            >
              <p>
                Proof of Humanity,{" "}
                <Link href="https://proofofhumanity.id">
                  https://proofofhumanity.id
                </Link>
              </p>
              <p>
                UBI,{" "}
                <Link href="https://Democracy.Earth">
                  https://Democracy.Earth
                </Link>
              </p>
              <p>
                Kleros, <Link href="https://kleros.io">https://kleros.io</Link>
              </p>
              <p>
                NES.css (8bit-like) style framework{" "}
                <Link href="https://github.com/nostalgic-css/NES.css">
                  https://github.com/nostalgic-css/NES.css
                </Link>
              </p>
              <p>
                Arcade Cabinet Pure CSS by Jhonny Gil{" "}
                <Link href="https://codepen.io/gilsjhonny">
                  https://codepen.io/gilsjhonny
                </Link>
              </p>
              <p>
                CSS arcade button by Thierry Michel{" "}
                <Link href="https://codepen.io/thierrymichel">
                  https://codepen.io/thierrymichel
                </Link>
              </p>
              <p>
                Pixel nerd character:{" "}
                <Link href="https://pixlr.com/stock/creator/stockunlimited">
                  https://pixlr.com/stock/creator/stockunlimited
                </Link>
              </p>
              <p>
                Scratch Studio - Fire PNG Gif{" "}
                <Link href="https://flyclipart.com/scratch-studio-fire-png-gif-760324">
                  https://flyclipart.com/scratch-studio-fire-png-gif-760324
                </Link>
              </p>
              <p>
                Atari - Enduro game{" "}
                <Link href="https://codepen.io/rafaelcastrocouto/pen/obQJwb">
                  https://codepen.io/rafaelcastrocouto/pen/obQJwb
                </Link>
              </p>
              <p>And the Crypto Random telegram group, wgmi.</p>
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
      <br />
      <p style={{ textAlign: "center", fontSize: "10px" }}>
        made with{" "}
        <span role="img" aria-label="heart">
          ❤️
        </span>{" "}
        by{" "}
        <Link href="https://ruben.to" style={{ fontSize: "10px" }}>
          Ruben Santana
        </Link>
      </p>
    </>
  );
}
