import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { GameDetailsContext } from "./context/GameContext";
import useForceUpdate from "./hooks/useForceUpdate";
import { removeDuplicates } from "./utils/utils";

const ChatAndViews = ({ chatSocket }) => {
  const mobileChatWidth = 1050;
  const chatOpenInit = window.innerWidth >= mobileChatWidth ? true : false;
  const messageTyped = useRef([]);
  const {
    playerId,
    gameId,
    playerHandle,
    playerColour,
    gamePlayers,
    playersVCAvail,
  } = useContext(GameDetailsContext);
  const forceUpdate = useForceUpdate();
  const messages = useRef([]);
  const [chatOpen, setChatOpen] = useState(chatOpenInit);
  const [newMessages, setNewMessages] = useState(messages.current.length);
  const [liveChatMode, setLiveChatMode] = useState(false);
  const [textareaHeight, setTextareaHeight] = useState(20);
  const textAreaRef = useRef();

  const toggleButtonText = chatOpen ? "Close Chat" : "Open Chat";
  const chatOpenClass = liveChatMode
    ? " live-chat-open"
    : !chatOpen
    ? " toggle-closed"
    : "";
  const handleStyle = (colour) => {
    return { color: colour ? colour : "#fd7362" };
  };

  chatSocket.on("new message", (msg) => {
    const handle = msg.handle;
    const messagesAlreadySent = messages.current.map((msg_) => msg_.id);
    if (!messagesAlreadySent.includes(msg.id)) {
      const unSortedMessages = [msg, ...messages.current];
      messages.current = removeDuplicates(unSortedMessages, { handle });
      (chatOpen || liveChatMode) && setNewMessages(messages.current.length);
      !chatOpen && forceUpdate();
    }
  });

  // useEffect(() => {
  //   console.log("Messages changed.");
  // }, [messages.current]);

  useEffect(() => {
    window.addEventListener("resize", () => {
      window.innerWidth >= mobileChatWidth && setChatOpen(true);
      window.innerWidth >= mobileChatWidth && setLiveChatMode(false);
    });
  }, []);

  const handleMsgSubmit = (e) => {
    e.preventDefault();
    const msg = messageTyped.current.value;

    if (msg) {
      chatSocket.emit("message", {
        gameId,
        playerId,
        message: msg,
        colour: playerColour,
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

    messages.current.forEach((message) => {
      message.handle = message.handle === playerHandle ? "you" : message.handle;
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
    messages.current.length !== newMessages &&
      setNewMessages(messages.current.length);
    setChatOpen((prev) => !prev);
  };

  const indicatorStyles = (vcAvail) =>
    vcAvail ? { backgroundColor: "#ff7c11" } : { backgroundColor: "#11ff11" };

  const handleLiveChat = () => {
    setLiveChatMode((prev) => !prev);
    messages.current.length !== newMessages &&
      setNewMessages(messages.current.length);
  };

  return (
    <div>
      <div className={`chat-container${chatOpenClass}`}>
        <div className="chat-toggle-container">
          {!liveChatMode && (
            <button
              className="toggle-full-chat-btn"
              onClick={() => handleChatToggle()}
            >
              {toggleButtonText}
            </button>
          )}
          {!chatOpen && (
            <button
              className="toggle-full-chat-btn"
              onClick={() => handleLiveChat()}
              style={{ marginLeft: !chatOpen && !liveChatMode ? "10px" : "" }}
            >
              {liveChatMode ? "Close Small Chat" : "Open Small Chat"}
            </button>
          )}
          {messages.current.length - newMessages > 0 &&
            !liveChatMode &&
            !chatOpen && (
              <div className="unread-messages-container">
                {messages.current.length - newMessages}
              </div>
            )}
        </div>
        <div
          style={!liveChatMode && !chatOpen ? { display: "none" } : {}}
          className="msg-output-container"
        >
          {messages.current
            .sort((a, b) => b.timestamp - a.timestamp)
            .map((msg, index) =>
              !msg.action ? (
                <div
                  key={index}
                  className={
                    "user-msg-container" +
                    (liveChatMode ? " live-chat-msg-container" : "")
                  }
                >
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
          {gamePlayers.map((playerObj) => (
            <div
              key={playerObj.id + "chatdhsgks"}
              className="chat-online-players"
            >
              <div
                style={indicatorStyles(
                  playersVCAvail.map((obj) => obj.id).includes(playerObj.id)
                )}
                className="indicator-circle"
              ></div>
              <h3 className="online-player-handle">{playerObj.handle}</h3>
            </div>
          ))}
        </div>

        <div className="chat-form-container">
          <form className="chat-form" onSubmit={handleMsgSubmit}>
            <input
              ref={messageTyped}
              className="msg-input"
              // style={{ height: `${textareaHeight}px` }}
              type="text"
              // onInput={(e) => {
              //   setTextareaHeight(e.)
              //   // if(e.currentTarget.scrollHeight !== textareaHeight){
              //   // }
              // }}
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
