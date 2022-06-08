import Web3 from "web3";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { abi } from "./abi";
import React, { useState } from "react";
import { render } from "react-dom";
import {
  Space,
  Input,
  Button,
  message,
  InputNumber,
  Row,
  Col,
  Divider,
} from "antd";
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
    "0xcEEF423825F019e768Ecf5da059ae87848df91b4"
  );
  try {
    const job = contract.methods.publishTask(
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
      })
      .on("receipt", (receipt) => {
        message.loading(`Reciept got: ${receipt}`);
      });
    message.info(
      `Successfully published task: ${result.events.TaskPublished.returnValues.TaskId}`
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
      <Divider>Get your Tiktok video more likes</Divider>
      <Row gutter={[16, 16]}>
        <Col span={6}></Col>
        <Col span={6}>
          <Space align="center" size="large">
            <div>{account}</div>
          </Space>
        </Col>
        <Col span={6}>
          <Space align="center">
            <Button
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
          </Space>
        </Col>
        <Col span={6}></Col>
      </Row>
      <Divider></Divider>
      <Row gutter={[16, 16]}>
        <Col span={6} offset={6}>
          <Input
            allowClear={true}
            placeholder={"Tiktok video url"}
            onChange={(e) => {
              setTiktokURL(e.target.value);
            }}
          ></Input>
        </Col>
        <Col span={3}>
          <InputNumber
            defaultValue={1}
            min={1}
            onChange={(e) => {
              setTiktokLikeCount(parseInt(e.target.value));
            }}
          ></InputNumber>
        </Col>
        <Col span={6}>
          <Button
            disabled={account == "Wallet not connected"}
            type="primary"
            onClick={async () => {
              await publishY2bTask(web3, tiktokURL, tiktokLikeCount);
            }}
          >
            Get likes!
          </Button>
        </Col>
      </Row>
    </div>
  );
};

render(<App />, document.getElementById("root"));
