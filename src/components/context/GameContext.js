import React, { createContext, useEffect, useState, useRef } from "react";
import useForceUpdate from "../hooks/useForceUpdate";

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

const initProfile = {
  gameId: "",
  playerId: "",
  playerHandle: "",
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

// export const MessageContext = createContext(null);
export const eNotificationContext = createContext(null);
export const GameAndPlayerContext = createContext(null);
// export const GameProfileContext = createContext(null);
// export const GameStateContext = createContext(null);
// export const PlayerColourContext = createContext(null);
// export const GamePlayersContext = createContext(null);
// export const PlayersVCAvailContext = createContext(null);
export const GameDetailsContext = createContext(null);
// export const ChatRegisterContext = createContext(false);

const GlobalState = ({ children }) => {
  const [gameAndPlayer, setGameAndPlayer] = useState({
    game: initGame,
    player: initPlayer,
  });
  const gameProfile = useRef(initProfile);
  const gameState = useRef("waiting");
  const playerColour = useRef("red");
  const gamePlayers = useRef([]);
  const playersVCAvail = useRef([]);
  const [timeoutId, setTimeoutId] = useState(null);
  const [eNotification, setENotification] = useState({ msg: "No Noti" });
  const forceUpdate = useForceUpdate();

  const eNotificationHandler = (noti) => {
    clearTimeout(timeoutId);
    setTimeoutId(null);

    // if (noti && noti.msg !== eNotification.msg) {
    setENotification(noti);
    const tId = setTimeout(() => setENotification({ msg: "No Noti" }), 3000);
    setTimeoutId(tId);
    // }
  };

  // useEffect(() => console.log("zigi za"), [playerColour]);

  // console.log(gamePlayers.current);
  const handleSettingStates = (data, fromHomePage = false) => {
    if (fromHomePage) {
      gameProfile.current = data;
      return;
    }

    const game = data;
    const player = game.players.filter(
      (playerObject) => playerObject.id === gameAndPlayer.player.id
    )[0];

    handleGameProfile(game, player);
    if (playersHaveChanged(game)) {
      gamePlayers.current = game.players;
    }
    if (playersVCAvailChanged(game)) {
      playersVCAvail.current = game.players.filter(
        (playerObj) => playerObj.voiceChatAvail
      );
    }
    if (player.colour !== playerColour.current) {
      playerColour.current = player.colour;
    }
    if (gameState.current !== game.state) {
      gameState.current = game.state;
    }
    setGameAndPlayer({ game, player });
  };

  const handleGameProfile = (game, player) => {
    const { gameId, playerId, playerHandle } = gameProfile.current;
    if (
      game.id !== gameId ||
      player.id !== playerId ||
      player.handle !== playerHandle
    ) {
      gameProfile.current = {
        gameId: game.id,
        playerId: player.id,
        playerHandle: player.handle,
      };
    }
  };

  const playersHaveChanged = (game) => {
    let playersChanged = false;
    const newPlayerIds = game.players.map((playerObj) => playerObj.id);
    const currentPlayerIds = gamePlayers.current.map(
      (playerObj) => playerObj.id
    );
    if (newPlayerIds.length !== currentPlayerIds.length) return true;

    newPlayerIds.forEach((id) => {
      if (!currentPlayerIds.includes(id)) playersChanged = true;
    });
    return playersChanged;
  };

  const playersVCAvailChanged = (game) => {
    let playersChanged = false;
    const newPlayerIds = game.players
      .filter((playerObj) => playerObj.voiceChatAvail)
      .map((playerObj) => playerObj.id);
    const currentPlayerIds = playersVCAvail.current
      .filter((playerObj) => playerObj.voiceChatAvail)
      .map((playerObj) => playerObj.id);
    if (newPlayerIds.length !== currentPlayerIds.length) return true;

    newPlayerIds.forEach((id) => {
      if (!currentPlayerIds.includes(id)) playersChanged = true;
    });
    return playersChanged;
  };

  const getId = () => {
    return gameAndPlayer.game.id;
  };

  return (
    <eNotificationContext.Provider
      value={[eNotification, eNotificationHandler]}
    >
      <GameDetailsContext.Provider
        value={{
          gameId: gameProfile.current.gameId || getId(),
          playerId: gameProfile.current.playerId,
          playerHandle: gameProfile.current.playerHandle,
          gamePlayers: gamePlayers.current,
          playerColour: playerColour.current,
          playersVCAvail: playersVCAvail.current,
          gameState: gameState.current,
        }}
      >
        <GameAndPlayerContext.Provider
          value={[gameAndPlayer, setGameAndPlayer, handleSettingStates]}
        >
          {children}
        </GameAndPlayerContext.Provider>
      </GameDetailsContext.Provider>
    </eNotificationContext.Provider>
  );
};

export default GlobalState;
