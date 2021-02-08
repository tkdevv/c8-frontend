import React, { useRef, useState, useContext } from "react";
import StartGameForm from "../StartGameForm";
import JoinGameForm from "../JoinGameForm";
import { Redirect } from "react-router-dom";
import {
  eNotificationContext,
  GameAndPlayerContext,
} from "../context/GameContext";
import { useForm } from "react-hook-form";
import { v4 as uuid } from "uuid";
import { getGameId, titleCase, removeStrSpaces } from "../utils/utils";
import ENotification from "../ENotification";

const HomePage = ({ socket }) => {
  //React Hook Form
  const { register, handleSubmit, errors } = useForm();

  const gameCode = getGameId(window.location.pathname);

  // Context
  const [{ game, player }, setGameAndPlayer, handleSettingStates] = useContext(
    GameAndPlayerContext
  );
  const [eNotification, eNotificationHandler] = useContext(
    eNotificationContext
  );

  !player.id && socket.emit("get id");

  socket.on("your id", (my_id) => {
    setGameAndPlayer((prev) => {
      prev.player.id = my_id;
      return prev;
    });
  });

  // Form Submission
  const startGameHandler = (data) => {
    if (!socket.connected) {
      let msg = "Sorry. The server seems to be down. Try again later.";
      eNotificationHandler({ msg, colour: "red" });
      return;
    }
    if (data.gameCode) {
      return;
    }
    const {
      handle,
      numOfCards,
      aceBlock,
      justWatch,
      aceCheck,
      isTournament,
      jokerTally,
    } = data;

    // Set Player
    setGameAndPlayer((prev) => {
      prev.player.handle = titleCase(handle);
      prev.player.isGameMaster = true;
      prev.player.status = justWatch ? "watching" : "waiting";

      // Generate Game ID
      prev.game.id = `${removeStrSpaces(
        player.handle
      )}-${Math.random().toString(36).substr(2, 5)}`;
      prev.game.players = [player];
      // prevGame.activePlayers = player.status === "waiting" ? [player] : [];
      // prevGame.rules.cardsToShare = numOfCards;
      // prevGame.rules.aceBlock = aceBlock;
      // prevGame.rules.aceCheck = aceCheck;
      // prevGame.rules.isTournament = isTournament;
      // prevGame.rules.antiCheat = true;
      prev.game.rules.jokerTally = jokerTally;

      handleSettingStates(
        {
          gameId: prev.game.id,
          playerId: prev.player.id,
          playerHandle: prev.player.handle,
        },
        true
      );
      return prev;
    });

    socket.emit("create game", { game });
  };

  return (
    <div className="homepage-container">
      {game.id && player.handle && <Redirect to="arena" />}
      <h1>C8</h1>
      <div className="home-forms-container">
        {gameCode ? (
          <div className="join-game-form">
            <JoinGameForm gameCode={gameCode} socket={socket} />
          </div>
        ) : (
          <div className="start-game-form">
            <StartGameForm
              register={register}
              handleSubmit={handleSubmit}
              startGameHandler={startGameHandler}
              errors={errors}
            />
          </div>
        )}
      </div>
      <ENotification />
    </div>
  );
};

export default HomePage;
