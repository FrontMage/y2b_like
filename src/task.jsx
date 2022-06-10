import React, { useState, useEffect } from "react";
import { render } from "react-dom";
import { Button, message, Row, Col, Divider, Statistic, Card } from "antd";
import "antd/dist/antd.css";

const apiEntry = "http://localhost:8000";

let timer = null;

const App = () => {
  const [account, setAccount] = useState("No account");
  const [dailyEarnings, setDailyEarnings] = useState(0);
  const [tasks, setTasks] = useState([]);
  useEffect(() => {
    // Get once immediately
    fetch(`${apiEntry}/tasks`, {
      mode: "cors",
    })
      .then((response) => response.json())
      .then((data) => {
        setTasks(data);
      })
      .catch((e) => {
        console.error(e);
        message.error("Failed to get account info");
      });
    // Get every 60s
    if (!timer) {
      timer = setInterval(() => {
        fetch(`${apiEntry}/tasks`, {
          mode: "cors",
        })
          .then((response) => response.json())
          .then((data) => {
            setTasks(data);
          })
          .catch((e) => {
            console.error(e);
            message.error("Failed to get account info");
          });
      }, 60 * 1000);
    }
    fetch(`${apiEntry}/work_proof`, {
      mode: "cors",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data["error"]) {
          throw data["error"];
        }
        setDailyEarnings(data["work_proof"]);
      })
      .catch((e) => {
        console.error(e);
        message.error("Failed to get account info");
      });
    fetch(`${apiEntry}/eth_address`, {
      mode: "cors",
    })
      .then((response) => response.json())
      .then((data) => {
        setAccount(data["eth_address"]);
      })
      .catch((e) => {
        console.error(e);
        message.error("Failed to get account info");
      });
  }, []);
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
            value={`${dailyEarnings} Work proof`}
          ></Statistic>
        </Col>
      </Row>
      <Divider></Divider>
      {tasks.map((task) => {
        return (
          <Row
            gutter={[16, 16]}
            style={{ marginTop: "20px" }}
            key={task["task_id"]}
          >
            <Col span={4}></Col>
            <Col span={8}>
              <Card
                title={`${task["task_id"]} ${task["image_url"]}`}
                bordered={true}
              >
                <Statistic title="Params" value={task["args"]}></Statistic>
                <Statistic title="Reward" value={"1 Work proof"}></Statistic>
                {task["image_url"].lastIndexOf(
                  "shan3275/puppeteer-headful:latest"
                ) !== -1 || task["image_url"].lastIndexOf("github") !== -1 ? (
                  <Button type="primary">Extra interaction required</Button>
                ) : (
                  <Button>Auto race for complete</Button>
                )}
              </Card>
            </Col>
          </Row>
        );
      })}
    </div>
  );
};

render(<App />, document.getElementById("root"));
