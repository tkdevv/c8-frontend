import React, { useEffect, useContext, useState } from "react";
import HomePage from "./components/pages/HomePage";
import io from "socket.io-client";
import Nav from "./components/Nav";
import {
  eNotificationContext,
  MessageContext,
  GameAndPlayerContext,
} from "./components/context/GameContext";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import GameArena from "./components/pages/GameArena";
import { removeDuplicates } from "./components/utils/utils";

const App = () => {
  const [chatRegistered, setChatRegistered] = useState(false);

  // | CONTEXT VARIABLES
  const [messages, setMessages] = useContext(MessageContext);
  const [{ player }, setGameAndPlayer] = useContext(GameAndPlayerContext);
  const [eNotification, eNotificationHandler] = useContext(
    eNotificationContext
  );

  // const socket = io("https://crazy-8.herokuapp.com/");
  // const chatSocket = io("https://crazy-8.herokuapp.com/chat");
  const socket = io("http://localhost:8001/");
  const chatSocket = io("http://localhost:8001/chat");

  const handleChatRegister = (gameId, handle) => {
    chatSocket.emit("join chat", { gameId, chatRegistered, handle });
  };

  // | SOCKET EVENTS
  socket.on("game error", () => window.location.reload());
  socket.on("start error", (msg) => {
    eNotificationHandler({ msg });
  });
  // socket.on("connect", () => console.log("connection back"));
  // chatSocket.on("connect ", () => console.log("chat connection back"));

  socket.on("checked notification", (playerObj) => {
    const msg = `${
      playerObj.id === player.id ? "You" : playerObj.handle
    } just checked. Congrats`;
    eNotificationHandler({ msg, colour: "#11ff11" });
  });
  socket.on("game update", (gameObject) => {
    const playerObj = gameObject.players.filter(
      (playerObject) => playerObject.id === player.id
    )[0];
    setGameAndPlayer({ game: gameObject, player: playerObj });
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

  // | Chat Socket Events
  chatSocket.on("new message", (msg) => {
    setMessages((prevMsgs) => {
      const unSortedMessages = [msg, ...prevMsgs];
      return removeDuplicates(unSortedMessages, player);
    });
  });

  chatSocket.on("chat joined", () => {
    setChatRegistered(true);
  });

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
            render={(props) => (
              <GameArena
                {...props}
                socket={socket}
                chatSocket={chatSocket}
                handleChatRegister={handleChatRegister}
                chatRegistered={chatRegistered}
                setChatRegistered={setChatRegistered}
              />
            )}
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
