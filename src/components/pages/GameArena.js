import React, { useEffect, useContext, useState } from "react";
import ChatAndViews from "../ChatAndViews";
import GameArenaWaiting from "../GameArenaWaiting";
import GameArenaActive from "../GameArenaActive";
import {
  GameContext,
  PlayerContext,
  MessageContext,
  eNotificationContext,
} from "../context/GameContext";
import { Redirect } from "react-router-dom";
import ENotification from "../ENotification";
import VoiceChat from "../VoiceChat";

const GameArena = ({
  socket,
  chatSocket,
  handleChatRegister,
  peer,
  chatRegistered,
}) => {
  // const [chatRegistered, setChatRegistered] = useState(false);

  const [game] = useContext(GameContext);
  const [player] = useContext(PlayerContext);
  const noNotification = "No Noti";
  const [eNotification] = useContext(eNotificationContext);

  useEffect(() => {
    !chatRegistered &&
      player.colour &&
      handleChatRegister(game.id, player.handle);
  }, [player]);

  return (
    <div className="game-arena-container">
      {!game.id && <Redirect to="" />}
      <ChatAndViews chatSocket={chatSocket} />
      <VoiceChat peer={peer} socket={socket} />
      <div className="game-area">
        {game.state === "waiting" || game.state === "waitingNewRound" ? (
          <GameArenaWaiting socket={socket} />
        ) : (
          <GameArenaActive socket={socket} chatSocket={chatSocket} />
        )}
        {eNotification && eNotification !== noNotification && <ENotification />}
      </div>
    </div>
  );
};

export default GameArena;