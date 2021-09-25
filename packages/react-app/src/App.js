import React, { useState, useEffect, useRef } from "react";
import { ethers } from "ethers";
import { Body, Header } from "./components";
import useWeb3Modal from "./hooks/useWeb3Modal";
import { addresses, abis } from "@project/contracts";
import Cabinet from "./components/Cabinet";
import Notify from "bnc-notify";
import delay from "delay";
import Tutorial from "./components/Tutorial";
import Welcome from "./components/Others/Welcome";
import Address from "./components/Balances/Address";
import UBI from "./components/Balances/UBI";
import ETH from "./components/Balances/ETH";
import NoETH from "./components/Balances/NoETH";
import Contributors from "./components/Leaderboards/Contributors";
import Burners from "./components/Leaderboards/Burners";
import Acknowledgments from "./components/Others/Acknowledgments";
import Social from "./components/Others/Social";
import { toast, Bounce } from "react-toastify";
import AmountToBurn from "./components/Balances/AmountToBurn";
import CurrentBurnRequest from "./components/Balances/CurrentBurnRequest";

var notify = Notify({
  dappId: process.env.REACT_APP_BLOCKNATIVE, // [String] Blocknative API key
  networkId: 1, // [Integer] The Ethereum network ID your Dapp uses.
});

const CONTRACT_BLOCK = 13293731;

function WalletButton({ provider, loadWeb3Modal, logoutOfWeb3Modal }) {
  return (
    <button
      type="button"
      className="nes-btn nes-pointer"
      onClick={() => {
        if (!provider) {
          loadWeb3Modal();
        } else {
          logoutOfWeb3Modal();
        }
      }}
      style={{ height: "30px" }}
    >
      {!provider ? "Connect Wallet" : "Disconnect Wallet"}
    </button>
  );
}

function App() {
  // const { loading, error, data } = useQuery(GET_TRANSFERS);
  const ETHERSCAN_API = process.env.ETHERSCAN_API;
  const INFURA_ID = process.env.REACT_APP_INFURA_ID;
  const ALCHEMY_API = process.env.REACT_APP_ALCHEMY_API;
  const defaultProvider = ethers.getDefaultProvider("mainnet", {
    etherscan: ETHERSCAN_API,
    infura: INFURA_ID,
    alchemy: ALCHEMY_API,
  });

  const toastNotification = (msg, time) =>
    toast(msg, {
      position: "top-left",
      autoClose: { time },
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      transition: Bounce,
    });

  const [contractUBIburner] = useState(
    new ethers.Contract(
      addresses.contractUBIburner,
      abis.UBIburner,
      defaultProvider
    )
  );
  const [provider, loadWeb3Modal, logoutOfWeb3Modal] = useWeb3Modal();
  const [balances, setBalances] = useState({
    UBI: null,
    ETH: null,
    AmountOutMin: null,
  });
  const UBIb = useRef(null);
  const bal = useRef(null);
  const minOut = useRef(null);
  const [isBurner, setIsBurner] = useState(false);
  const [currentBurnRequest, setCurrentBurnRequest] = useState({
    amount: null,
    requester: null,
  });
  const requestAmountOutMin = useRef(null);
  const burnRequester = useRef(null);

  async function IsBurner(address) {
    let isABurner = await contractUBIburner.isBurner(address);
    setIsBurner(isABurner);
  }

  async function getCurrentRequest() {
    requestAmountOutMin.current = await contractUBIburner.currentAmountOutMin();
    burnRequester.current = await contractUBIburner.currentBurnRequester();
    let amount = await ethers.utils.formatEther(requestAmountOutMin.current);
    return [amount, burnRequester.current];
  }

  async function updateUBIburned() {
    UBIb.current = await contractUBIburner.UBIburned();
    let UBIbalance = await ethers.utils.formatEther(UBIb.current);
    return UBIbalance;
  }

  async function updateContractBalance() {
    bal.current = await provider.getBalance(addresses.contractUBIburner);
    let ETHbalance = await ethers.utils.formatEther(bal.current);
    return ETHbalance;
  }

  async function updateAmountOutMin() {
    minOut.current = await contractUBIburner.getAmountOutMin();
    let min = await ethers.utils.formatEther(minOut.current);
    return min;
  }

  const [signer, setSigner] = useState();

  async function getSigner() {
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    let signerAddress = await signer.getAddress();
    console.log("Account:", signerAddress);
    setSigner(signer);
    await IsBurner(signerAddress);
  }

  const [contributorsEvent, setContributorsEvent] = useState([]);
  const [burnersEvent, setBurnersEvent] = useState([]);
  const [contributors, setContributors] = useState();
  const [burners, setBurners] = useState();

  async function getContributors() {
    let eventFilter = contractUBIburner.filters.Received();
    let events = await contractUBIburner.queryFilter(
      eventFilter,
      CONTRACT_BLOCK
    );
    setContributorsEvent(events);
  }
  async function getBurners() {
    let eventFilter = contractUBIburner.filters.Burned();
    let events = await contractUBIburner.queryFilter(
      eventFilter,
      CONTRACT_BLOCK
    );
    setBurnersEvent(events);
  }

  useEffect(() => {
    if (!provider) return;
    async function start() {
      let arr = await contributorsEvent.map((e) => {
        return {
          from: e.args.from,
          amount: parseInt(e.args.amount, 10),
        };
      });
      var holder = {};
      arr.forEach(function (d) {
        if (holder.hasOwnProperty(d.from)) {
          holder[d.from] = holder[d.from] + d.amount;
        } else {
          holder[d.from] = d.amount;
        }
      });
      var obj2 = [];
      for (var prop in holder) {
        obj2.push({ from: prop, amount: holder[prop] });
      }
      obj2.sort((a, b) => Number(b.amount) - Number(a.amount));
      setContributors(obj2);
    }
    start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contributorsEvent]);

  useEffect(() => {
    if (!provider) return;
    async function start() {
      let arr = await burnersEvent.map((e) => {
        return {
          burner: e.args.burner,
          // amount: parseInt(e.args.amount, 10),
        };
      });
      let result = {};
      // eslint-disable-next-line array-callback-return
      arr.map((el) => {
        result[el.burner] = (result[el.burner] || 0) + 1;
      });
      var res = Object.keys(result).map((key) => {
        return { from: String(key), quantity: result[key] };
      });
      res.sort((a, b) => Number(b.quantity) - Number(a.quantity));
      setBurners(res);
    }
    start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [burnersEvent]);

  useEffect(() => {
    if (!provider) return;
    async function start() {
      await getSigner();
      let ETHbalance = await updateContractBalance();
      let UBIbalance = await updateUBIburned();
      let AmountOut = await updateAmountOutMin();
      let values = await getCurrentRequest();
      setBalances({
        UBI: UBIbalance,
        ETH: ETHbalance,
        AmountOutMin: AmountOut,
      });
      setCurrentBurnRequest({ amount: values[0], requester: values[1] });
    }
    start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [provider]);

  const [entryEv, setEntryEv] = useState(false);
  useEffect(() => {
    if (!provider) return;
    if (entryEv) return;
    async function start() {
      await getContributors();
      await getBurners();
    }
    start();
    setEntryEv(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [provider]);

  async function requestBurnUBI() {
    const contractWithSigner = await contractUBIburner.connect(signer);
    const tx = await contractWithSigner.requestBurnUBI();
    console.log(tx);
    const { emitter } = notify.hash(tx.hash);
    emitter.on("all", (transaction) => {
      console.log(transaction);
    });
  }

  async function burnUBI() {
    const contractWithSigner = await contractUBIburner.connect(signer);
    let deadline = Math.round(Date.now() / 1000) + 1800; //30 minutes
    const tx = await contractWithSigner.burnUBI(deadline);
    console.log(tx);
    const { emitter } = notify.hash(tx.hash);
    // emitter.on("txConfirmed", async () => {
    //   await updateContractBalance();
    //   await updateUBIburned();
    // });
    emitter.on("all", (transaction) => {
      // 'all' handler gets called for every transaction event that you haven't registered a handler for
      console.log(transaction);
    });
  }

  const [isloaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!provider) return;
    if (!contractUBIburner) return;
    if (balances.UBI === null || balances.ETH === null) return;
    if (!isloaded) {
      contractUBIburner.on("Received", async (from, amount) => {
        console.log(
          "Received.\nFrom: " +
            from +
            ".\nAmount: " +
            ethers.utils.formatEther(amount) +
            "ETH"
        );
        toastNotification(
          "Received.\nFrom: " +
            from +
            ".\nAmount: " +
            ethers.utils.formatEther(amount) +
            "ETH",
          5000
        );
        await delay(10000);
        let ETHbalance = await updateContractBalance();
        let AmountOut = await updateAmountOutMin();
        setBalances({ ...balances, ETH: ETHbalance, AmountOutMin: AmountOut });
      });
      contractUBIburner.on("Burned", async (from, amount) => {
        console.log(
          "Burned.\nFrom: " +
            from +
            ".\nAmount: " +
            ethers.utils.formatEther(amount)
        );
        toastNotification(
          "Burned.\nFrom: " +
            from +
            ".\nAmount: " +
            ethers.utils.formatEther(amount) +
            "ETH",
          5000
        );
        await delay(10000);
        let ETHbalance = await updateContractBalance();
        let UBIbalance = await updateUBIburned();
        let AmountOut = await updateAmountOutMin();
        setBalances({
          UBI: UBIbalance,
          ETH: ETHbalance,
          AmountOutMin: AmountOut,
        });
        let values = await getCurrentRequest();
        setCurrentBurnRequest({ amount: values[0], requester: values[1] });
      });

      contractUBIburner.on("BurnUBIRequested", async (requester, UBIAmount) => {
        console.log(
          "UBI Burn Requested\n" +
            "Requester.\n" +
            requester +
            "\nUBI Amount: " +
            ethers.utils.formatEther(UBIAmount) +
            "ETH"
        );
        toastNotification(
          "UBI Burn Requested\n" +
            "Requester.\n" +
            requester +
            "\nUBI Amount: " +
            ethers.utils.formatEther(UBIAmount) +
            "ETH",
          5000
        );
        await delay(10000);
        let values = await getCurrentRequest();
        setCurrentBurnRequest({ amount: values[0], requester: values[1] });
      });

      // return () => {
      //   window.removeEventListener("Received");
      //   window.removeEventListener("Burned");
      // };
      setLoaded(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [provider, contractUBIburner, balances]);

  return (
    <div>
      <Header>
        <Tutorial />
        <WalletButton
          provider={provider}
          loadWeb3Modal={loadWeb3Modal}
          logoutOfWeb3Modal={logoutOfWeb3Modal}
        />
      </Header>
      <Body>
        <center>
          {provider ? (
            balances.UBI ? (
              <>
                <br />
                <Welcome />
                <br />
                <div className="container-fluid boots">
                  <UBI>{balances.UBI}</UBI>
                </div>
                <br />
                <div className="container-fluid boots">
                  <div
                    className="row justify-content-md-center"
                    style={{ textAlign: "center" }}
                  >
                    <div className="col boots" style={{ marginBottom: "25px" }}>
                      <Address>{addresses.contractUBIburner}</Address>
                    </div>
                    {/* <br /> */}

                    {balances.ETH !== "0.0" ? (
                      <div className="col-12 boots">
                        <ETH>{balances.ETH}</ETH>
                      </div>
                    ) : (
                      <div className="col-12 col-md-6 boots">
                        <NoETH />
                      </div>
                    )}
                  </div>
                </div>

                {/* Burner zone */}

                {isBurner && currentBurnRequest && (
                  <>
                    <br />
                    <div className="container-fluid boots">
                      <div
                        className="row justify-content-md-center"
                        style={{ textAlign: "center" }}
                      >
                        <div
                          className="col-12 col-md-6 boots"
                          style={{ marginBottom: "25px" }}
                        >
                          <AmountToBurn data={balances.AmountOutMin} />
                        </div>

                        <div className="col-12 col-md-6 boots">
                          <CurrentBurnRequest data={currentBurnRequest}>
                            {balances.ETH !== "0.0" ? (
                              <button
                                type="button"
                                className="nes-btn nes-pointer"
                                onClick={() => requestBurnUBI()}
                              >
                                Make or Update a Burn Request
                              </button>
                            ) : (
                              <>
                                Come back when the contract has ETH to make a
                                burn request.
                              </>
                            )}
                          </CurrentBurnRequest>
                        </div>

                        {currentBurnRequest.amount !== "0.0" && (
                          <center>
                            <br />
                            <button
                              className="push--skeuo nes-pointer"
                              onClick={() => burnUBI()}
                            ></button>
                            <p style={{ textAlign: "center" }}>
                              If you're not the requester press the button to
                              burn UBIs{" "}
                              <span role="img" aria-label="emoji">
                                🔥
                              </span>
                            </p>
                            <br />
                          </center>
                        )}
                      </div>
                    </div>
                  </>
                )}

                <br />
                {contributors && (
                  <div className="container-fluid boots">
                    <Contributors items={contributors} />
                  </div>
                )}
                <br />
                {burners && (
                  <div className="container-fluid boots">
                    <Burners items={burners} />
                  </div>
                )}
                <br />
                <Social />
                <br />
                <Acknowledgments />
              </>
            ) : (
              <p style={{ textAlign: "center" }}>
                Reading contract balances...
              </p>
            )
          ) : (
            <Cabinet />
          )}
        </center>
      </Body>
    </div>
  );
}

export default App;
