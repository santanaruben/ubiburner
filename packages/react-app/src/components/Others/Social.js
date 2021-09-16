import React from "react";
import { Link } from "../../components";

export default function Social() {
  return (
    <center>
      <section className="icon-list">
        <Link href="https://twitter.com/ubiburner">
          <i className="nes-icon twitter is-medium withoutBorder "></i>
        </Link>
        <Link
          href="https://github.com/santanaruben/ubiburner"
          style={{ marginLeft: "15px", marginRight: "15px" }}
        >
          <i className="nes-icon github is-medium withoutBorder"></i>
        </Link>
        <Link href="https://t.me/ubiburner">
          <img
            src="telegram-8bit.png"
            alt="telegram"
            style={{ width: "48px", verticalAlign: "unset" }}
          ></img>
        </Link>
      </section>
    </center>
  );
}
