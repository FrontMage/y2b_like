import Web3 from "web3";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { abi } from "../abi/abi";
import React, { useState } from "react";
import { createRoot } from "react-dom/client";
const container = document.getElementById("root");
const root = createRoot(container);
import { Input, Button, message, InputNumber, Divider } from "antd";
import "antd/dist/antd.css";

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      rpc: {
        1: "https://mainnet-dev.deeper.network/rpc",
      },
      chainId: 518,
    },
  },
};

const web3Modal = new Web3Modal({
  cacheProvider: false,
  providerOptions,
});

async function connectWallet() {
  const provider = await web3Modal.connect();
  window.provider = provider;
  const web3 = new Web3(provider);
  return web3;
}

async function publishY2bTask(web3, tiktokURL, taskCount) {
  message.loading("Publishing task");
  const accounts = await web3.eth.getAccounts();
  const contract = new web3.eth.Contract(
    abi,
    "0x60eF94dbbe8E80024Eff0693976Be26d27aEA746"
  );
  try {
    const job = contract.methods.nNodespecifiedAddressTask(
      "shan3275/puppeteer-headful:latest",
      `--tiktok --url ${tiktokURL}`,
      taskCount,
      ["0xce83e968cd92588aa7d93409400e165c0149f13f"]
    );
    const gas = await job.estimateGas({
      from: accounts[0],
    });
    const result = await job
      .send({
        from: accounts[0],
        gas: gas,
      })
      .on("error", (err) => {
        message.error(`Failed to publish task: ${err}`);
      })
      .on("transactionHash", (tx) => {
        message.loading(`Tx submitted: ${tx}`);
      });
    message.info(
      `Successfully published task: ${result.events.TaskPublished.returnValues.taskId}`
    );
  } catch (e) {
    console.log(e);
  }
}

const App = () => {
  const [account, setAccount] = useState("Wallet not connected");
  const [web3, setWeb3] = useState(null);
  const [tiktokURL, setTiktokURL] = useState("");
  const [tiktokLikeCount, setTiktokLikeCount] = useState(1);
  return (
    <div>
      <header className="header">
        <div className="logoBox">Get your Tiktok video more likes</div>
      </header>
      <main className="mainContainer">
        <div className="mainBox">
          <div className="mainRow">
            <div className="rowItem">{account}</div>
            <div className="rowItem">
              <Button
                ghost
                type="primary"
                onClick={async () => {
                  const web3Instance = await connectWallet();
                  setWeb3(web3Instance);
                  const accounts = await web3Instance.eth.getAccounts();
                  setAccount(`Connected: ${accounts[0]}`);
                }}
              >
                Connect to wallet
              </Button>
            </div>
          </div>

          <Divider></Divider>
          <div className="contentRow">
            <Input
              allowClear={true}
              placeholder={"Tiktok video url"}
              onChange={(e) => {
                setTiktokURL(e.target.value);
              }}
              size="large"
            ></Input>
          </div>
          <div className="contentRow">
            <span style={{ marginRight: 20 }}>Count:</span>

            <InputNumber
              defaultValue={1}
              min={1}
              onChange={(value) => {
                setTiktokLikeCount(value);
              }}
            ></InputNumber>
          </div>
          <div className="contentRow">
            <Button
              block
              size="large"
              shape="round"
              disabled={account == "Wallet not connected"}
              type="primary"
              onClick={async () => {
                await publishY2bTask(web3, tiktokURL, tiktokLikeCount);
              }}
            >
              Get likes!
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

root.render(<App />);
