import React, { useEffect, useContext, useState } from "react";
import HomePage from "./components/pages/HomePage";
import io from "socket.io-client";
import Nav from "./components/Nav";
import {
  eNotificationContext,
  GameAndPlayerContext,
  GameDetailsContext,
} from "./components/context/GameContext";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import GameArena from "./components/pages/GameArena";

const App = () => {
  // | CONTEXT VARIABLES
  const [gameAndPlayer, setGameAndPlayer, handleSettingStates] = useContext(
    GameAndPlayerContext
  );
  const { playerId } = useContext(GameDetailsContext);
  const [eNotification, eNotificationHandler] = useContext(
    eNotificationContext
  );
  const socket = io("https://crazy-8.herokuapp.com/");
  // const socket = io("http://localhost:8001/");

  // | SOCKET EVENTS
  socket.on("game error", () => window.location.reload());
  socket.on("start error", (msg) => {
    eNotificationHandler({ msg });
  });
  // socket.on("connect", () => console.log("connection back"));
  // chatSocket.on("connect ", () => console.log("chat connection back"));

  socket.on("checked notification", (playerObj) => {
    const msg = `${
      playerObj.id === playerId ? "You" : playerObj.handle
    } just checked. Congrats`;
    eNotificationHandler({ msg, colour: "green" });
  });
  socket.on("game update", (gameObject) => {
    handleSettingStates(gameObject);
  });

  // Player Quit Notification
  socket.on("quit notification", (playerObj) => {
    const msg = `${
      playerObj.id === playerId ? "You" : playerObj.handle
    } just quit the game.`;
    eNotificationHandler({ msg, colour: "red" });
  });

  // const handleErrors = (code) => {
  //   console.log("Caution. Rouge Robots", code);
  // };

  // socket.on("connect_error", () => handleErrors("c1"));
  // socket.on("connect_failed", () => handleErrors("c2"));
  // socket.on("disconnect", () => handleErrors("c3"));
  // chatSocket.on("connect_error", () => handleErrors("chat c1"));
  // chatSocket.on("connect_failed", () => handleErrors("chat c2"));
  // chatSocket.on("disconnect", () => handleErrors("chat c3"));

  return (
    <div>
      {/* <GlobalState socket={socket}> */}
      {/* <Router basename={process.env.PUBLIC_URL}> */}
      <Router>
        <Nav />
        <Switch>
          <Route
            exact
            path="/arena"
            render={(props) => <GameArena socket={socket} />}
          />
          <Route
            exact
            path="/:id"
            render={(props) => <HomePage {...props} socket={socket} />}
          />
          <Route
            path=""
            render={(props) => <HomePage {...props} socket={socket} />}
          />
        </Switch>
      </Router>
      {/* </GlobalState> */}
    </div>
  );
};

export default App;
