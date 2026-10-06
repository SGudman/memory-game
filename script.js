function createElement(tagName, classNames, text) {
  const element = document.createElement(tagName);

  if (classNames) {
    const names = classNames.split(" ");

    for (let index = 0; index < names.length; index += 1) {
      if (names[index]) {
        element.classList.add(names[index]);
      }
    }
  }

  if (text !== undefined) {
    element.textContent = text;
  }

  return element;
}

function buildInterface() {
  const gameRoot = createElement("main", "game");
  const header = createElement("header", "game-header");
  const title = createElement("h1", "game-title", "Игра на память");
  const actions = createElement("div", "game-actions");
  const newGameButton = createElement("button", "button", "Новая игра");
  const leaderboardButton = createElement("button", "button button-secondary", "Таблица лидеров");
  const stats = createElement("section", "game-stats");
  const movesLabel = createElement("p", "", "Ходы: ");
  const movesCount = createElement("span", "", "0");
  const pairsLabel = createElement("p", "", "Пары: ");
  const pairsCount = createElement("span", "", "0");
  const pairTotal = createElement("span", "", " из 8");
  const gameBoard = createElement("section", "game-board");

  newGameButton.type = "button";
  leaderboardButton.type = "button";
  movesCount.id = "moves-count";
  pairsCount.id = "pairs-count";
  gameBoard.setAttribute("aria-label", "Игровое поле");

  movesLabel.append(movesCount);
  pairsLabel.append(pairsCount, pairTotal);
  stats.append(movesLabel, pairsLabel);
  actions.append(newGameButton, leaderboardButton);
  header.append(title, actions);
  gameRoot.append(header, stats, gameBoard);
  document.body.append(gameRoot);
}

buildInterface();
