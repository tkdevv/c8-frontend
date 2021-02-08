import React, { useEffect, useContext, useState } from "react";
import ChatAndViews from "../ChatAndViews";
import GameArenaWaiting from "../GameArenaWaiting";
import GameArenaActive from "../GameArenaActive";
import {
  GameDetailsContext,
  eNotificationContext,
  GameAndPlayerContext,
} from "../context/GameContext";
import { Redirect } from "react-router-dom";
import ENotification from "../ENotification";
import VoiceChat from "../VoiceChat";
import TextChatWrapper from "../TextChatWrapper";

const GameArena = ({ socket }) => {
  // const [chatRegistered, setChatRegistered] = useState(false);

  const [{ game }] = useContext(GameAndPlayerContext);
  const { gameId, gameState, playerColour } = useContext(GameDetailsContext);
  const [eNotification] = useContext(eNotificationContext);

  return (
    <div className="game-arena-container">
      {!game.id && <Redirect to="" />}
      <TextChatWrapper />
      <VoiceChat socket={socket} />
      <div className="game-area">
        {gameState === "waiting" || gameState === "waitingNewRound" ? (
          <GameArenaWaiting socket={socket} />
        ) : (
          <GameArenaActive socket={socket} />
        )}
        <ENotification />
      </div>
    </div>
  );
};

export default GameArena;
