import React, { useState, useEffect } from "react";
import TApp from "./TApp";
const msgJSON = require("./tutorial.json");

export default function Tutorial() {
  function openDial() {
    document.getElementById("dialog-default").showModal();
  }

  const [msg, setMsg] = useState("Hello");
  const [counterMsg, setCounterMsg] = useState(0);

  useEffect(() => {
    setMsg(msgJSON[counterMsg].text);
  }, [counterMsg]);

  const lastMsg = msgJSON.length - 1;

  useEffect(() => {
    if (counterMsg === 0 || counterMsg === lastMsg) {
      if (counterMsg === 0) {
        setHideP("hide");
        setSpace("flex-end");
      } else setHideP(null);
      if (counterMsg === lastMsg) {
        setHideN("hide");
        setSpace("flex-start");
      } else setHideN(null);
    } else {
      setSpace("space-between");
      setHideP(null);
      setHideN(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [counterMsg]);

  function nextMsg() {
    if (counterMsg < lastMsg) setCounterMsg(counterMsg + 1);
  }

  function prevMsg() {
    if (counterMsg > 0) setCounterMsg(counterMsg - 1);
  }

  const [hideP, setHideP] = useState(null);
  const [hideN, setHideN] = useState(null);
  const [space, setSpace] = useState("flex-end");

  function handleSelectChange(event) {
    var selectElement = event.target;
    var value = selectElement.value;
    setCounterMsg(Number(value));
  }

  return (
    <>
      <button
        type="button"
        className="nes-btn nes-pointer"
        onClick={openDial}
        style={{ height: "30px" }}
      >
        Tutorial
      </button>

      <section>
        <dialog
          className="nes-dialog is-rounded"
          id="dialog-default"
          style={{ width: "auto", height: "auto", backgroundColor: "inherit" }}
        >
          <form method="dialog">
            <p className="title" style={{ color: "white" }}>
              Tutorial
            </p>
            <section className="message-list">
              <section
                className="message -left"
                style={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <img
                  src="/Santi.png"
                  alt="Santi"
                  width="100px"
                  style={{ marginTop: "150px", objectFit: "contain" }}
                  className="transitionImage"
                />
                <div className="nes-balloon from-left transitionText bubbleTextTutorial">
                  <div>
                    <p className="textTutorial">
                      <TApp speed={70} msg={msg} />
                    </p>
                    <div
                      style={{
                        textAlign: "center",
                        display: "flex",
                        justifyContent: space,
                        bottom: "0px",
                      }}
                    >
                      <i
                        className={"nes-icon caret-left nes-pointer " + hideP}
                        onClick={prevMsg}
                      ></i>
                      <i
                        className={
                          "nes-icon caret-right nes-pointer blink " + hideN
                        }
                        onClick={nextMsg}
                      ></i>
                    </div>
                  </div>
                </div>
              </section>
            </section>
            <menu
              className="dialog-menu"
              style={{
                marginTop: "70px",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <div>
                <div
                  className="nes-select"
                  style={{
                    position: "unset",
                    width: "unset",
                    margin: "unset",
                    marginRight: "90px",
                  }}
                >
                  <select
                    required
                    id="dark_select"
                    style={{
                      height: "20px",
                    }}
                    onChange={handleSelectChange}
                  >
                    <option value="0">Select...</option>
                    <option value="3">What is UBI?</option>
                    <option value="6">What is Proof of Humanity?</option>
                    <option value="9">What is the UBI Burner?</option>
                    <option value="14">Why Burn UBIs?</option>
                    <option value="18">How to burn UBIs?</option>
                  </select>
                </div>
              </div>
              <button className="nes-btn">close</button>
            </menu>
          </form>
        </dialog>
      </section>
    </>
  );
}
