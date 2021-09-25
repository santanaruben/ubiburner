import React from "react";
import { Link } from "../../components";
import "./Cabinet.css";

export default function Cabinet() {
  return (
    <div className="container">
      <div className="arcade-machine">
        <div className="shadow"></div>
        <div className="top">
          <div className="stripes"></div>
        </div>
        <div className="screen-container">
          <div className="shadow"></div>
          <div className="screen">
            <div className="screen-display"></div>
            <h2>THE UBI BURNER</h2>
            <img src="/UBI.png" alt="UBI" className="UBI" />
            <img
              src="/flame.png"
              alt="flame"
              className="alien-container"
              style={{ left: "-10%" }}
            />
            <img
              src="/flame.png"
              alt="flame"
              className="alien-container"
              style={{ left: "5%" }}
            />
            <img
              src="/flame.png"
              alt="flame"
              className="alien-container"
              style={{ left: "20%" }}
            />
            <img
              src="/flame.png"
              alt="flame"
              className="alien-container"
              style={{ left: "35%" }}
            />
            <img
              src="/flame.png"
              alt="flame"
              className="alien-container"
              style={{ left: "50%" }}
            />
            <img
              src="/flame.png"
              alt="flame"
              className="alien-container"
              style={{ left: "65%" }}
            />
            <img
              src="/flame.png"
              alt="flame"
              className="alien-container"
              style={{ left: "80%" }}
            />
          </div>
          <div className="joystick">
            <div className="stick"></div>
          </div>
        </div>
        <div className="board">
          <div className="button button-a"></div>
          <div className="button button-b"></div>
          <div className="button button-c"></div>
        </div>
        <div className="bottom">
          <div className="stripes"></div>
        </div>
      </div>
      <footer>
        <h3>
          Connect your wallet and{" "}
          <span style={{ fontSize: "unset" }}>help humanity</span>
        </h3>
        <h4>
          Contribute sending ETH to{" "}
          <Link
            href="https://etherscan.io/address/0x481b24ed5feacb37e282729b9815e27529cf9ae2#code"
            target="blank"
          >
            this contract
          </Link>
        </h4>
        <p>
          The <span title="Universal Basic Income">UBI</span> token is a{" "}
          <span title="Fair Airdrop">fairdrop</span> protocol, built on top of{" "}
          <a target="blank" href="https://proofofhumanity.id">
            Proof of Humanity
          </a>
        </p>
      </footer>
    </div>
  );
}
