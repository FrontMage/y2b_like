import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
const container = document.getElementById("root");
const root = createRoot(container);

import { Button, message, Card } from "antd";
import "antd/dist/antd.css";

const apiEntry = "http://shan.i234.me:8000/";

let timer = null;

function CardTitle({ task }) {
  return (
    <div className="cardTitleBox">
      <div>{task["task_id"]}</div>
      <div>{task["image_url"]}</div>
    </div>
  );
}

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
      <header className="header">
        <div className="logoBox">Tasks</div>
        <div className="taskInfoBox">
          <div>
            <div className="taskInfoTitle">Account:</div>
            <div className="taskInfoValue">{account}</div>
          </div>
          <div>
            <div className="taskInfoTitle">Daily earnings:</div>
            <div style={{ fontSize: 18 }} className="taskInfoValue">
              {dailyEarnings} <span style={{ color: "#000" }}>Work proof</span>{" "}
            </div>
          </div>
        </div>
      </header>
      <main className="mainContainer">
        {tasks.map((task) => {
          return (
            <div className="taskItemBox" key={task["task_id"]}>
              <Card
                title={<CardTitle task={task}></CardTitle>}
                bordered={false}
              >
                <div className="taskContentBox">
                  <div>Params</div>
                  <div>{task["args"]}</div>
                </div>
                <div className="taskContentBox">
                  <div>Reward</div>
                  <div>1 Work proof</div>
                </div>
                <div className="btnBox">
                  {task["image_url"].lastIndexOf(
                    "shan3275/puppeteer-headful:latest"
                  ) !== -1 || task["image_url"].lastIndexOf("github") !== -1 ? (
                    <Button block type="primary">
                      Extra interaction required
                    </Button>
                  ) : (
                    <Button ghost type="primary" block>
                      Auto race for complete
                    </Button>
                  )}
                </div>
              </Card>
            </div>
          );
        })}
      </main>
    </div>
  );
};

root.render(<App />);
