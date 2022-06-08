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
  ButtonGroup,
  Row,
  Col,
  Divider,
  Statistic,
  Card,
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

async function publishY2bTask(web3, videoId, taskCount) {
  message.loading("Publishing task");
  const accounts = await web3.eth.getAccounts();
  const contract = new web3.eth.Contract(
    abi,
    "0xcEEF423825F019e768Ecf5da059ae87848df91b4"
  );
  try {
    const job = contract.methods.publishTask(
      "shan3275/puppeteer-headful:latest",
      `--youtube --tag ${videoId}`,
      taskCount,
      ["0x5b77c32b7a3abfff05f6bc8da11231dfcfd0887f"]
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
  const [account, setAccount] = useState(
    "0x27FdDEF298618B512Fa6D281DB0e32E0F38D15D3"
  );
  const [dailyEarnings, setDailyEarnings] = useState(1235);
  return (
    <div>
      <Divider>Tasks</Divider>
      <Row gutter={[16, 16]}>
        <Col span={4}></Col>
        <Col span={8}>
          <Statistic title="Account" value={account}></Statistic>
        </Col>
        <Col span={8}>
          <Statistic
            title="Daily earnings"
            value={`${dailyEarnings} EZC`}
          ></Statistic>
        </Col>
      </Row>
      <Divider></Divider>
      <Row gutter={[16, 16]}>
        <Col span={4}></Col>
        <Col span={8}>
          <Card title="busybox:latest" bordered={true}>
            <Space>
              <Button type="primary">Auto race for completion</Button>
              <Button type="primary">No interaction</Button>
            </Space>
            <Statistic title="Params" value={"sleep 100"}></Statistic>
            <Statistic title="Reward" value={"1 EZC"}></Statistic>
          </Card>
        </Col>
      </Row>
      <Row gutter={[16, 16]} style={{ marginTop: "20px" }}>
        <Col span={4}></Col>
        <Col span={8}>
          <Card title="shan3275/puppeteer-headful:latest" bordered={true}>
            <Space>
              <Button type="primary" danger>
                Comfirmation required to race for completion
              </Button>
              <Button type="primary" danger>
                Interaction required
              </Button>
            </Space>
            <Statistic
              title="Params"
              value={"--tiktok --url https://tiktok.com"}
            ></Statistic>
            <Statistic title="Reward" value={"1 EZC"}></Statistic>
            <Button type="primary">Extra interaction required</Button>
          </Card>
        </Col>
      </Row>
      <Row gutter={[16, 16]} style={{ marginTop: "20px" }}>
        <Col span={4}></Col>
        <Col span={8}>
          <Card title="shan3275/puppeteer-headful:latest" bordered={true}>
            <Space>
              <Button type="primary" danger>
                Comfirmation required to race for completion
              </Button>
              <Button type="primary" danger>
                Interaction required
              </Button>
            </Space>
            <Statistic
              title="Params"
              value={"--tiktok --url https://tiktok.com"}
            ></Statistic>
            <Statistic title="Reward" value={"1 EZC"}></Statistic>
            <Button type="primary">Extra interaction required</Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

render(<App />, document.getElementById("root"));
