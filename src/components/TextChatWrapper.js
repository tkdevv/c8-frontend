import React, { useEffect, useState, useContext } from "react";
import ChatAndViews from "./ChatAndViews";
import io from "socket.io-client";
import { GameDetailsContext } from "./context/GameContext";

const TextChatWrapper = () => {
  const [chatSocket, setChatSocket] = useState(null);
  const [chatRegistered, setChatRegistered] = useState(null);

  const { playerHandle, gameId } = useContext(GameDetailsContext);

  !chatSocket && setChatSocket(io("https://crazy-8.herokuapp.com/chat"));
  // !chatSocket && setChatSocket(io("http://localhost:8001/chat"));

  // | Chat Socket Events
  chatSocket &&
    chatSocket.on("chat joined", () => {
      !chatRegistered && setChatRegistered(true);
    });

  useEffect(() => {
    const handle = playerHandle;

    // chatSocket &&
    //   chatSocket.on("connect", () => {});

    chatSocket &&
      !chatRegistered &&
      playerHandle &&
      chatSocket.emit("join chat", { gameId, handle });
  }, [chatSocket, playerHandle]);

  return (
    <div>
      {chatSocket && chatRegistered && <ChatAndViews chatSocket={chatSocket} />}
    </div>
  );
};

export default TextChatWrapper;
