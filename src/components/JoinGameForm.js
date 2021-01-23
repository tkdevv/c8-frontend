import React, { useContext, useState, useEffect } from "react";
import { PlayerContext, GameContext } from "./context/GameContext";
import { Redirect } from "react-router-dom";
import { useForm } from "react-hook-form";
import { titleCase } from "./utils/utils";

const JoinGameForm = ({ socket, gameCode }) => {
  const { register, handleSubmit, errors } = useForm();
  const [player, setPlayer] = useContext(PlayerContext);
  const [game, setGame] = useContext(GameContext);
  const [gameCodeError, setGameCodeError] = useState(false);

  const [redirect, setRedirect] = useState(false);

  // THIS JUST CHECKS IF GAME EXISTS
  useEffect(() => {
    setGameCodeError(false);
    setRedirect(false);

    socket.emit("check game exists", gameCode);
  }, []);

  socket.on("game 404", () => {
    console.log("4000004");
    setGameCodeError(() => true);
    setRedirect(() => true);
  });

  socket.on("join game error", (msg) => {
    console.log("Caution. Rouge Robots");
  });

  // socket.on("game update", (gameObj) => {
  //   setGame(() => gameObj.game);
  //   setPlayer(() => gameObj.player);
  //   setRedirect(true);
  // });

  socket.on("game update", (gameObject) => {
    setGame(gameObject);
    gameObject.players.forEach((playerObject) => {
      if (playerObject.id === player.id) {
        setPlayer(() => playerObject);
      }
    });
  });

  const joinGameHandler = ({ handle, justWatch }) => {
    setGameCodeError(() => false);
    setPlayer((prevPlayer) => {
      prevPlayer.handle = titleCase(handle);
      prevPlayer.status = justWatch ? "watching" : "waiting";
      return prevPlayer;
    });

    socket.emit("join game", {
      gameCode,
      player,
    });
  };
  return (
    <div>
      {redirect && !gameCodeError && player.handle && <Redirect to="arena" />}
      {redirect && gameCodeError && <Redirect to="" />}
      <form className="join-game-form" onSubmit={handleSubmit(joinGameHandler)}>
        <label className="input-label">Handle</label>
        <input
          className="handle-input"
          name="handle"
          ref={register({ required: true, minLength: 3, maxLength: 9 })}
        />
        {errors.handle && <p>Handle between 3 and 9 characters required</p>}

        {/* <label className="input-label">Game Code</label>
        <input
          className="handle-input"
          name="gameCode"
          ref={register({ required: true, minLength: 10, maxLength: 60 })}
        />
        {(errors.gameCode || gameCodeError) && <p>Enter a valid Game Code</p>} */}
        <hr />

        <label className="input-label">Just Watch</label>
        <input
          type="checkbox"
          className="home-checkbox"
          name="justWatch"
          ref={register}
        />

        <button className="home-submit-btn">Join Game</button>
      </form>
    </div>
  );
};

export default JoinGameForm;
