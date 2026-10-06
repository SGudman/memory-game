const animals = [
  { name: "Собака", image: "assets/animals/dog.svg" },
  { name: "Кошка", image: "assets/animals/cat.svg" },
  { name: "Лиса", image: "assets/animals/fox.svg" },
  { name: "Лев", image: "assets/animals/lion.svg" },
  { name: "Панда", image: "assets/animals/panda.svg" },
  { name: "Кролик", image: "assets/animals/rabbit.svg" },
  { name: "Тигр", image: "assets/animals/tiger.svg" },
  { name: "Медведь", image: "assets/animals/bear.svg" }
];

let gameBoard;
let gameCards = [];

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

function createCards() {
  const cards = [];

  for (let animalIndex = 0; animalIndex < animals.length; animalIndex += 1) {
    for (let copyIndex = 0; copyIndex < 2; copyIndex += 1) {
      cards.push({
        name: animals[animalIndex].name,
        image: animals[animalIndex].image
      });
    }
  }

  return cards;
}

function createCardButton(card) {
  const button = createElement("button", "card");
  const back = createElement("span", "card-back", "?");
  const face = createElement("span", "card-face");
  const image = createElement("img", "card-image");

  button.type = "button";
  button.setAttribute("aria-label", "Закрытая карточка");
  image.src = card.image;
  image.alt = card.name;
  face.append(image);
  button.append(back, face);

  return button;
}

function renderCards() {
  gameBoard.textContent = "";

  for (let index = 0; index < gameCards.length; index += 1) {
    gameBoard.append(createCardButton(gameCards[index]));
  }
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
  gameBoard = createElement("section", "game-board");

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
gameCards = createCards();
renderCards();
