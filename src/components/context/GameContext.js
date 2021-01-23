import React, { createContext, useEffect, useState } from "react";

const initGameRules = {
  id: "",
  cardsToShare: 4,
  aceCheck: false,
  aceBlock: true,
  antiCheat: true,
  jokerTally: 4,
};
// jhkh
const initPlayer = {
  id: "",
  handle: "",
  hand: [],
  isGameMaster: false,
  status: "",
  warnings: 0,
  voiceChatAvail: false,
};

const initGame = {
  id: "",
  players: [],
  // activePlayers: [],
  rules: initGameRules,
  state: "waiting",
  deck: [],
  order: [],
  cardsPlayed: [],
  numOfCards: 4,
  totalPickUp: 0,
  eightPlayed: { eightPlayed: false, symbol: "" },
  pile: [],
  startingLineUp: [],
  isTournament: false,
};

export const GameContext = createContext(null);
export const PlayerContext = createContext(null);
export const MessageContext = createContext(null);
export const eNotificationContext = createContext(null);
export const GameAndPlayerContext = createContext(null);
// export const ChatRegisterContext = createContext(false);

const GlobalState = ({ children }) => {
  const [gameAndPlayer, setGameAndPlayer] = useState({
    game: initGame,
    player: initPlayer,
  });
  const [messages, setMessages] = useState([]);
  const [timeoutId, setTimeoutId] = useState(null);
  const [eNotification, setENotification] = useState("No Noti");

  const eNotificationHandler = (noti) => {
    console.log("IM BEING CALLED", noti);
    if (timeoutId) {
      console.log("THERE'S A TIMEOUT ID");
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    if (noti & (noti.msg !== eNotification.msg)) {
      setENotification(noti);
      setTimeoutId(setTimeout(() => setENotification("No Noti"), 3000));
    }
  };

  console.log("FUUUCK");

  return (
    <MessageContext.Provider value={[messages, setMessages]}>
      <eNotificationContext.Provider
        value={[eNotification, eNotificationHandler]}
      >
        <GameAndPlayerContext.Provider
          value={[gameAndPlayer, setGameAndPlayer]}
        >
          {children}
        </GameAndPlayerContext.Provider>
      </eNotificationContext.Provider>
    </MessageContext.Provider>
  );
};

export default GlobalState;
