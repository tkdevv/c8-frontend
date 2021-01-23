import React from "react";
import ReactDOM from "react-dom";
import "./scss/index.css";
import App from "./App";
import GlobalState from "./components/context/GameContext";

ReactDOM.render(
  <React.StrictMode>
    <GlobalState>
      <App />
    </GlobalState>
  </React.StrictMode>,
  document.getElementById("root")
);
