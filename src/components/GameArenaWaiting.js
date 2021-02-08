import React, { useContext, useEffect } from "react";
import { GameAndPlayerContext } from "./context/GameContext";
import { numOfCardsOptionStyle } from "./utils/utils";

const GameArenaWaiting = ({ socket }) => {
  const [{ game, player }, setGameAndPlayer] = useContext(GameAndPlayerContext);

  const allPlayers = game.players.length;
  const playersPlaying = game.players.filter(
    (player) => player.status === "waiting" || player.status === "active"
  );
  const playersWatching = game.players.filter(
    (player) => player.status !== "waiting" && player.status !== "active"
  );
  const isTournamentWinner =
    game.players.filter((playerObj) => playerObj.status === "winner").length > 0
      ? true
      : false;
  const playersSorted = [...playersPlaying, ...playersWatching];

  const StartButtonText =
    game.state === "waiting" ||
    (game.state === "waitingNewRound" && playersPlaying.length < 2)
      ? "Start Game"
      : game.state === "waitingNewRound" && isTournamentWinner
      ? "Play Again"
      : game.state === "waitingNewRound" && playersPlaying.length > 2
      ? "Start Next Round"
      : "Start Final";

  const playerContainerStyles = (status) => {
    return {
      backgroundColor:
        status === "waiting" || status === "winner"
          ? "rgba(255, 255, 255, 0.856)"
          : " rgba(161, 161, 161, 0.856)",
    };
  };

  const toggleStatusButtonText =
    (game.state === "waiting" || game.state === "eliminated") &&
    (player.status === "waiting" || player.status === "winner")
      ? "Just Watch"
      : game.state === "waitingNewRound" && player.status === "waiting"
      ? "Quit Tournament"
      : "Join Match";

  useEffect(() => {}, []);

  const handleGameLaunch = () => {
    socket.emit("start game", game.id);
  };

  const joinGame = () => {
    socket.emit("join game", {
      gameCode: game.id,
      player,
    });
  };

  if (game.state === "waitingNewRound" && playersPlaying.length < 2) {
    socket.emit("game restart", {
      gameCode: game.id,
      player,
    });
  }

  const numOfCardOptions = [3, 4, 5, 6, 7, 8];
  const changeNumCards = (numOfCards) => {
    socket.emit("num of cards", {
      gameId: game.id,
      numOfCards,
    });
  };

  return (
    <div className="game-arena-waiting">
      <h1 className="game-waiting-heading">
        Share game link below to invite players.
      </h1>
      {/* <a
        href={`http://localhost:3000/${game.id}`}
      >{`http://localhost:3000/${game.id}`}</a> */}
      <h3 className="share-link">{`https://tkdev.co.za/${game.id}`}</h3>

      {player.isGameMaster && (
        <div className="num-cards-select-container">
          <h3 className="num-cards-select-text">
            Choose the number of cards to dish.
          </h3>
          <div className="num-cards-options">
            {numOfCardOptions.map((option, index) => (
              <div
                style={
                  option === game.numOfCards
                    ? { backgroundColor: "#ff9292" }
                    : {}
                }
                onClick={() => changeNumCards(option)}
                key={index + option}
                className="num-cards-option"
              >
                {option}
              </div>
            ))}
          </div>
        </div>
      )}

      <h2 className="stream-count">{`${game.players.length} ${
        game.players.length > 1 ? "people" : "person"
      } in stream`}</h2>

      <div className="players-waiting-container">
        {game.players.map((player, index) => (
          <div
            key={index}
            style={playerContainerStyles(player.status)}
            className="player-waiting"
          >
            <h2 className="player-waiting-handle">{player.handle}</h2>
            <h2 className="player-waiting-status">{player.status}</h2>
          </div>
        ))}
      </div>

      <div className="waiting-btns-container">
        {player.isGameMaster && (
          <button className="start-game-btn" onClick={handleGameLaunch}>
            {StartButtonText}
          </button>
        )}
        {(game.state === "waiting" ||
          (game.state === "waitingNewRound" && player.state === "waiting")) && (
          <button onClick={joinGame} className="join-game-btn">
            {toggleStatusButtonText}
          </button>
        )}
      </div>

      {!player.isGameMaster && (
        <div className="game-start-notice">
          Waiting for game master to start
        </div>
      )}
    </div>
  );
};

export default GameArenaWaiting;
