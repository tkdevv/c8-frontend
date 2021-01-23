import React, { useContext } from "react";
// import { cardStyle } from "./utils/utils";
import { GameAndPlayerContext } from "./context/GameContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  cardSymbol,
  cardNumber,
  cardStyle,
  gameOrderStyle,
} from "./utils/utils";
import CardSymbol from "./CardSymbol";

const EightModal = ({ socket, card, setEightEvent }) => {
  const [{ game, player }] = useContext(GameAndPlayerContext);

  const launch8 = (symbol) => {
    socket.emit("card played", {
      card,
      gameId: game.id,
      playerId: player.id,
      eightSymbol: symbol,
    });
    setEightEvent(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="eight-container"
    >
      <div onClick={() => setEightEvent(null)} className="modal-overlay"></div>
      <h1>uCelani?</h1>
      <div className="symbol-selection-container">
        <div onClick={() => launch8("H")} style={cardStyle("H")}>
          <CardSymbol symbol="H" />
        </div>
        <div onClick={() => launch8("S")} style={cardStyle("S")}>
          <CardSymbol symbol="S" />
        </div>
        <div onClick={() => launch8("C")} style={cardStyle("C")}>
          <CardSymbol symbol="C" />
        </div>
        <div onClick={() => launch8("D")} style={cardStyle("D")}>
          <CardSymbol symbol="D" />
        </div>
      </div>
      <h3>Your Cards</h3>
      <div className="eight-modal-cards-list">
        <AnimatePresence>
          {player.hand
            .filter((card) => card.number !== 8 && card.number !== 14)
            .map((card) => (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                style={cardStyle(card.symbol)}
                className="eight-modal-card"
                key={`${card.number}${card.symbol}`}
              >
                <motion.div
                  style={{ display: "flex", alignItems: "center" }}
                  initial={{ y: -80 }}
                  animate={{ y: 0 }}
                  exit={{ y: -80 }}
                  transition={{ duration: 0.4 }}
                >
                  <h2 className="eight-event-cards">{cardNumber(card)}</h2>
                  <CardSymbol symbol={cardSymbol(card)} />
                </motion.div>
              </motion.div>
            ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default EightModal;
