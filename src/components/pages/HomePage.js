import React, { useRef, useState, useContext } from "react";
import StartGameForm from "../StartGameForm";
import JoinGameForm from "../JoinGameForm";
import { Redirect } from "react-router-dom";
import { GameContext } from "../context/GameContext";
import { PlayerContext } from "../context/GameContext";
import { useForm } from "react-hook-form";
import { v4 as uuid } from "uuid";
import { getGameId, titleCase, removeStrSpaces } from "../utils/utils";

const HomePage = ({ socket }) => {
  //React Hook Form
  const { register, handleSubmit, errors } = useForm();

  const gameCode = getGameId(window.location.pathname);

  // Context
  const [game, setGame] = useContext(GameContext);
  const [player, setPlayer] = useContext(PlayerContext);

  !player.id && socket.emit("get id");

  socket.on("your id", (my_id) => {
    !player.id &&
      setPlayer((prevPlayer) => {
        // console.log("setting player ID");
        prevPlayer.id = my_id;
        return prevPlayer;
      });
  });

  // Form Submission
  const startGameHandler = (data) => {
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
    setPlayer((prevPlayer) => {
      prevPlayer.handle = titleCase(handle);
      prevPlayer.isGameMaster = true;
      prevPlayer.status = justWatch ? "watching" : "waiting";
      return prevPlayer;
    });

    // Set Game
    setGame((prevGame) => {
      // Generate Game ID
      prevGame.id = `${removeStrSpaces(player.handle)}-${Math.random()
        .toString(36)
        .substr(2, 5)}`;
      prevGame.players = [player];
      // prevGame.activePlayers = player.status === "waiting" ? [player] : [];
      // prevGame.rules.cardsToShare = numOfCards;
      // prevGame.rules.aceBlock = aceBlock;
      // prevGame.rules.aceCheck = aceCheck;
      // prevGame.rules.isTournament = isTournament;
      // prevGame.rules.antiCheat = true;
      prevGame.rules.jokerTally = jokerTally;
      return prevGame;
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
    </div>
  );
};

export default HomePage;
