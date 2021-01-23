export const cardSymbol = (card) => {
  card = card.number ? card : { number: 8, symbol: card };

  if (card.number === 14) {
    return "";
  }
  const symbol = card.symbol;
  return symbol;
  if (symbol === "H") {
    return "♥";
  } else if (symbol === "S") {
    return "♠";
  } else if (symbol === "C") {
    return "♣️";
  } else if (symbol === "D") {
    return "♦️";
  }
};

export const symbolReq = (card) => {
  card = card.number ? card : { number: 8, symbol: card };

  if (card.number === 14) {
    return "";
  }
  const symbol = card.symbol;

  if (symbol === "H") {
    return "♥";
  } else if (symbol === "S") {
    return "♠";
  } else if (symbol === "C") {
    return "♣️";
  } else if (symbol === "D") {
    return "♦️";
  }
};

export const cardNumber = (card) => {
  const cardNumber = card.number.toString();
  if (cardNumber === "1") {
    return "A";
  } else if (cardNumber === "11") {
    return "J";
  } else if (cardNumber === "12") {
    return "Q";
  } else if (cardNumber === "13") {
    return "K";
  } else if (cardNumber === "14") {
    return "🤡";
  } else {
    return cardNumber;
  }
};

export const cardStyle = (symbol) =>
  symbol === "H" || symbol === "D" ? { color: "#ff0000" } : { color: "#000" };

export const gameOrderStyle = (playerObj, game) => {
  if (playerObj.status === "waiting") {
    return { opacity: "0.6", color: "#55ff55" };
  } else if (playerObj.status === "watching") {
    return { opacity: "0.6", color: "#ff5555" };
  } else {
    return game.order[0].id === playerObj.id
      ? {
          color: "#fff",
          textDecoration: "underline",
          textDecorationColor: "#ffffff38",
        }
      : { opacity: "0.9" };
  }
};

export const getGameId = (url) => {
  const urlSplit = url.split("/");

  let gameId = urlSplit[urlSplit.length - 1];

  while (gameId.indexOf("%20") >= 0) {
    gameId = gameId.replace("%20", " ");
  }
  return gameId;
};

export const removeDuplicates = (array, player) => {
  let noDuplicates = [];
  array.forEach((item) => {
    let toAdd = true;
    noDuplicates.forEach((idem) => {
      if (idem.id === item.id) {
        toAdd = false;
      }
    });
    if (toAdd && !(item.action && item.handle === player.handle)) {
      noDuplicates = [...noDuplicates, item];
    }
  });

  return noDuplicates;
};

export const titleCase = (str) => {
  return str
    .toLowerCase()
    .split(" ")
    .map(function (word) {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
};

export const removeStrSpaces = (str, replacement = "+") => {
  return str.toLowerCase().split(" ").join(replacement);
};
