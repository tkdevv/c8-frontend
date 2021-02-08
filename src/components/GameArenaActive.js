import React, { useContext, useState } from "react";
import {
  eNotificationContext,
  GameAndPlayerContext,
} from "./context/GameContext";
import { motion, AnimatePresence } from "framer-motion";
import EightModal from "./EightModal";
import {
  cardSymbol,
  cardNumber,
  cardStyle,
  gameOrderStyle,
  symbolReq,
} from "./utils/utils";
import { Redirect } from "react-router-dom";
import CardSymbol from "./CardSymbol";

const GameArenaActive = ({ socket }) => {
  const [{ game, player }] = useContext(GameAndPlayerContext);
  const [eNotification, eNotificationHandler] = useContext(
    eNotificationContext
  );
  const [eightEvent, setEightEvent] = useState(null);
  const playersPlaying = game.players.filter(
    (playerObj) =>
      playerObj.status === "waiting" || playerObj.status === "active"
  );

  // GAME LOGIC
  const playCard = (card) => {
    window.scrollTo(0, 0);

    if (isValid(card, "play")) {
      if (card.number === 8) {
        setEightEvent({ card });
      } else {
        socket.emit("card played", {
          card,
          gameId: game.id,
          playerId: player.id,
        });

        if (player.hand.length === 1 && !card.isSpecial) {
          socket.emit("player checked", {
            gameId: game.id,
            playerId: player.id,
          });
        }
      }
    }
  };

  const drawCard = (toChangeOrder = true) => {
    if (isValid({}, "draw")) {
      socket.emit("card drawn", {
        gameId: game.id,
        playerId: player.id,
        totalPickUp: game.totalPickUp ? game.totalPickUp : 1,
        toChangeOrder,
      });
    }
  };

  const isPlayerTurn = () => {
    let currentPlayerId = game.order[0].id;

    if (game.order[0].status !== "active") {
      return game.order.filter((playerObj) => playerObj.status === "active")[0]
        .id;
    }
    return currentPlayerId;
  };

  const isValid = (card, action) => {
    if (player.id === isPlayerTurn()) {
      if (action === "draw") {
        return true;
      } else {
        const topCard = game.eightPlayed.eightPlayed
          ? { symbol: game.eightPlayed.symbol, number: 15 }
          : game.cardsPlayed[0];
        const samesLaw =
          topCard.symbol === card.symbol || topCard.number === card.number;
        const aceOrJokerPlayed = card.number === 1 || card.number === 14;
        const aceOrJokerTopCard = topCard.number === 1 || topCard.number === 14;

        const condition1 =
          game.totalPickUp > 0 &&
          topCard.isGun &&
          (card.isGun || aceOrJokerPlayed);

        const condition2 = game.totalPickUp === 0 && card.number === 8;

        const condition3 =
          game.totalPickUp === 0 && (samesLaw || aceOrJokerPlayed);

        const condition4 =
          game.totalPickUp === 0 && (aceOrJokerPlayed || aceOrJokerTopCard);

        if (condition1 || condition2 || condition3 || condition4) {
          player.hand.length === 1 &&
            card.isSpecial &&
            (samesLaw || aceOrJokerPlayed || card.number === 8) &&
            drawCard(false);
          return true;
        } else {
          eNotificationHandler({ msg: "You cannot play that card." });
          return false;
        }
      }
    } else {
      eNotificationHandler({ msg: "It isn't your turn yet." });
      return false;
    }
  };

  const handleQuitGame = () => {
    socket.emit("player quit", {
      gameId: game.id,
      playerId: player.id,
    });
  };

  const notifications = () => {
    const eightNotification = game.eightPlayed.eightPlayed
      ? `bacela i ${symbolReq(game.eightPlayed.symbol)}`
      : "";

    const currentPlayerHandle =
      game.order[0].id === player.id ? "You" : game.order[0].handle;
    const pickUpNotification =
      game.totalPickUp > 0
        ? `${currentPlayerHandle} must pick up ${game.totalPickUp}`
        : "";

    const generalNotification =
      pickUpNotification === "" && eightNotification === ""
        ? `It's ${game.order[0].handle}'s turn`
        : "";

    return `${eightNotification}${pickUpNotification}${generalNotification}`;
  };
  return game.order.length === 0 ? (
    <h1>LOADING</h1>
  ) : (
    <div className="game-container">
      <div className="views-container">
        <div className="players-count">
          <h3>{playersPlaying.length} P</h3>
        </div>
        {game.players.length - playersPlaying.length > 0 && (
          <div className="viewers-count">
            <h3>{game.players.length - playersPlaying.length} V</h3>
          </div>
        )}
      </div>
      {game.order <= 1 && <Redirect to="arena" />}
      {eightEvent && (
        <EightModal
          socket={socket}
          card={eightEvent.card}
          setEightEvent={setEightEvent}
        />
      )}
      <div className="game-wrapper">
        <div className="table-top-and-notifications">
          <h3 className="table-top-notification">{notifications()}</h3>

          <div className="game-order-container">
            {game.startingLineUp.map((playa, index) => (
              <div className="game-order-player" key={playa.id + "gorrr"}>
                <h3 key={index} style={gameOrderStyle(playa, game)}>
                  {playa.handle}
                </h3>
                {playa.hand.length <= 3 && playa.status === "active" && (
                  <div className="game-order-player-cards">
                    {playa.hand.length}
                  </div>
                )}
                {playa.status === "waiting" && (
                  <h6
                    style={{
                      ...gameOrderStyle(playa, game),
                      margin: 0,
                      marginLeft: "-5px",
                    }}
                  >
                    ✔️
                  </h6>
                )}
                {playa.status === "watching" && (
                  <h6
                    style={{
                      ...gameOrderStyle(playa, game),
                      margin: 0,
                      marginLeft: "-5px",
                    }}
                  >
                    ❌
                  </h6>
                )}
              </div>
            ))}
          </div>

          <div className="table-top">
            <div className="top-facing-card">
              <div className="top-facing-num-sym">
                <h3
                  style={cardStyle(game.cardsPlayed[0].symbol)}
                  className="card-top"
                >
                  {cardNumber(game.cardsPlayed[0])}
                </h3>
                <CardSymbol symbol={cardSymbol(game.cardsPlayed[0])} />
              </div>

              <div className="top-facing-num-sym num-sym-bot">
                <h3
                  style={cardStyle(game.cardsPlayed[0].symbol)}
                  className="card-bottom"
                >
                  {cardNumber(game.cardsPlayed[0])}
                </h3>
                <CardSymbol symbol={cardSymbol(game.cardsPlayed[0])} />
              </div>
            </div>
            <div onClick={() => drawCard()} className="deck">
              <div className="card-back">PICK UP</div>
            </div>
          </div>
        </div>

        <div className="cards-container">
          <AnimatePresence>
            {player.hand.map((card) => (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                onClick={() => playCard(card)}
                style={cardStyle(card.symbol)}
                className="card"
                key={`${card.number}${card.symbol}`}
              >
                <motion.div
                  style={{ display: "flex", alignItems: "center" }}
                  initial={{ y: -80 }}
                  animate={{ y: 0 }}
                  exit={{ y: -80 }}
                  transition={{ duration: 0.4 }}
                >
                  <h2>{cardNumber(card)}</h2>
                  <CardSymbol symbol={cardSymbol(card)} />
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        {game.order.filter((playerObj) => playerObj.id === player.id).length >
          0 && (
          <button onClick={handleQuitGame} className="quit-button">
            Quit Game
          </button>
        )}
      </div>
    </div>
  );
};

export default GameArenaActive;
