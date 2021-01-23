import React, { useEffect, useContext, useState } from "react";
import HomePage from "./components/pages/HomePage";
import io from "socket.io-client";
import Nav from "./components/Nav";
import {
  eNotificationContext,
  GameContext,
  PlayerContext,
  MessageContext,
} from "./components/context/GameContext";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import GameArena from "./components/pages/GameArena";
import Peer from "peerjs";
import { removeDuplicates } from "./components/utils/utils";

const App = () => {
  const [chatRegistered, setChatRegistered] = useState(false);
  const [peer, setPeer] = useState(null);

  // | CONTEXT VARIABLES
  const [game, setGame] = useContext(GameContext);
  const [messages, setMessages] = useContext(MessageContext);
  const [player, setPlayer] = useContext(PlayerContext);
  const [eNotification, eNotificationHandler] = useContext(
    eNotificationContext
  );

  // const socket = io("https://crazy-8.herokuapp.com/");
  // const chatSocket = io("https://crazy-8.herokuapp.com/chat");
  const socket = io("http://localhost:8001/");
  const chatSocket = io("http://localhost:8001/chat");

  const handleChatRegister = (gameId, handle) => {
    // console.log("EMITING JOIN EVENT");
    chatSocket.emit("join chat", { gameId, chatRegistered, handle });
  };

  // PEER
  !peer &&
    player &&
    game.players.length > 0 &&
    setPeer(
      new Peer(undefined, {
        host: "/",
        port: "9000",
      })
    );

  peer &&
    peer.on("open", (id) => {
      console.log(id);
      const credentials = { gameId: game.id, playerId: player.id, vcid: id };
      socket.emit("vcid", credentials);
    });

  // | SOCKET EVENTS
  socket.on("game error", () => window.location.reload());
  socket.on("start error", (msg) => {
    console.log("IS IT YOU?");
    // console.log("FIXT");
    eNotificationHandler({ msg });
  });
  socket.on("checked notification", (playerObj) => {
    const msg = `${
      playerObj.id === player.id ? "You" : playerObj.handle
    } just checked. Congrats`;
    eNotificationHandler({ msg, colour: "#11ff11" });
  });
  socket.on("game update", (gameObject) => {
    setGame(gameObject);
    gameObject.players.forEach((playerObject) => {
      if (playerObject.id === player.id) {
        setPlayer(() => playerObject);
      }
    });
  });

  const handleErrors = (code) => {
    // console.log("Caution. Rouge Robots", code);
  };

  socket.on("connect_error", () => handleErrors("c1"));
  socket.on("connect_failed", () => handleErrors("c2"));
  socket.on("disconnect", () => handleErrors("c3"));

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
                peer={peer}
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
