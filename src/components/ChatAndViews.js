import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { GameAndPlayerContext, MessageContext } from "./context/GameContext";

const ChatAndViews = ({ chatSocket }) => {
  const mobileChatWidth = 1050;
  const chatOpenInit = window.innerWidth >= mobileChatWidth ? true : false;
  const messageTyped = useRef();
  const [{ player, game }] = useContext(GameAndPlayerContext);
  const [messages, setMessages] = useContext(MessageContext);
  const [chatOpen, setChatOpen] = useState(chatOpenInit);
  const [newMessages, setNewMessages] = useState(messages.length);

  // socket.on("new message", (msg) => {
  //   console.log("IM UPDATING MESSAGES");
  //   setMessages((prevMsgs) => [msg, ...prevMsgs]);
  // });
  // xxx - FIX REMOVE EVENT LISTENER
  // xxx - FIX REMOVE EVENT LISTENER
  // xxx - FIX REMOVE EVENT LISTENER
  const toggleButtonText = chatOpen ? "Close Chat" : "Open Chat";
  const chatOpenClass = !chatOpen ? " toggle-closed" : "";
  const handleStyle = (colour) => {
    return { color: colour ? colour : "#fd7362" };
  };

  useEffect(() => {
    // console.log("Messages Changed");

    chatOpen && setNewMessages(messages.length);
  }, [messages]);

  useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= mobileChatWidth && setChatOpen(true)
    );
  }, []);

  const handleMsgSubmit = (e) => {
    e.preventDefault();
    const gameId = game.id;
    const playerId = player.id;
    const message = messageTyped.current.value;
    if (message) {
      chatSocket.emit("message", {
        gameId,
        playerId,
        message,
        colour: player.colour,
      });
      messageTyped.current.value = "";
    }
  };

  const getConnectionText = (msg) => {
    return msg.action === "connected"
      ? `${msg.handle} just joined.`
      : `${msg.handle} just left.`;
  };

  const sortedMessages = () => {
    let sortedMessages = [];
    let prevMessage = { handle: "" };

    messages.forEach((message) => {
      message.handle =
        message.handle === player.handle ? "you" : message.handle;
      if (
        (message.action === "connected" || message.action === "disconnected") &&
        prevMessage.action === message.action
      ) {
        sortedMessages.splice(sortedMessages.length - 1, 1);
        message.handle = !message.handle.includes(prevMessage.handle)
          ? `${prevMessage.handle}, ${message.handle}`
          : message.handle;
      }
      // console.log(
      //   prevMessage.handle,
      //   message.handle.includes(prevMessage.handle),
      //   message.handle
      // );
      sortedMessages = [...sortedMessages, message];
      prevMessage = message;
    });
    return sortedMessages;
  };

  const handleChatToggle = () => {
    setNewMessages(messages.length);
    setChatOpen((prev) => !prev);
  };

  const indicatorStyles = (vcAvail) =>
    vcAvail ? { backgroundColor: "#ff00ff" } : { backgroundColor: "#11ff11" };

  return (
    <div>
      <div className={`chat-container${chatOpenClass}`}>
        <div className="chat-toggle-container">
          <button onClick={() => handleChatToggle()}>{toggleButtonText}</button>
          {messages.length - newMessages > 0 && (
            <div className="unread-messages-container">
              {messages.length - newMessages}
            </div>
          )}
        </div>
        <div className="msg-output-container">
          {messages
            .sort((a, b) => b.timestamp - a.timestamp)
            .map((msg, index) =>
              !msg.action ? (
                <div key={index} className="user-msg-container">
                  <h4 style={handleStyle(msg.colour)} className="msg-handle">
                    {msg.handle}
                  </h4>
                  <h4 className="msg-msg">{msg.msg}</h4>
                </div>
              ) : (
                <div key={index} className="connection-text">
                  {getConnectionText(msg)}
                </div>
              )
            )}

          <div className="messeges"></div>
        </div>

        <div className="chat-online-players-container">
          {game.players.map((player) => (
            <div key={player.id + "chatdhsgks"} className="chat-online-players">
              <div
                style={indicatorStyles(player.voiceChatAvail)}
                className="indicator-circle"
              ></div>
              <h3 className="online-player-handle">{player.handle}</h3>
            </div>
          ))}
        </div>

        <div className="chat-form-container">
          <form className="chat-form" onSubmit={handleMsgSubmit}>
            <input
              ref={messageTyped}
              className="msg-input"
              type="text"
              placeholder="say your chat"
            />
            <button type="submit" className="chat-submit">
              send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatAndViews;
