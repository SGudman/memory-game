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

let gameRoot;
let newGameButton;
let leaderboardButton;
let movesCountElement;
let pairsCountElement;
let gameBoard;
let modalBackdrop;
let modalPanel;
let modalTitle;
let modalContent;
let modalActions;
let gameCards = [];
let firstCard = null;
let movesCount = 0;
let foundPairs = 0;
let mismatchLocked = false;
let mismatchTimer = null;
let currentGameId = 0;
let gameFinished = false;
let modalOpen = false;

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

function createShuffledCards() {
  const cards = [];

  for (let animalIndex = 0; animalIndex < animals.length; animalIndex += 1) {
    for (let copyIndex = 0; copyIndex < 2; copyIndex += 1) {
      cards.push({
        name: animals[animalIndex].name,
        image: animals[animalIndex].image,
        isOpen: false,
        isMatched: false,
        button: null,
        gameId: currentGameId
      });
    }
  }

  for (let index = cards.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    const temporaryCard = cards[index];
    cards[index] = cards[randomIndex];
    cards[randomIndex] = temporaryCard;
  }

  return cards;
}

function createCardButton(card) {
  const button = createElement("button", "card");
  button.type = "button";
  button.setAttribute("aria-label", "Закрытая карточка");

  const back = createElement("span", "card-back", "?");
  const face = createElement("span", "card-face");
  const image = createElement("img", "card-image");
  image.src = card.image;
  image.alt = card.name;
  face.append(image);
  button.append(back, face);
  card.button = button;

  button.addEventListener("click", function () {
    handleCardSelection(card);
  });

  return button;
}

function renderCards() {
  gameBoard.textContent = "";

  for (let index = 0; index < gameCards.length; index += 1) {
    gameBoard.append(createCardButton(gameCards[index]));
  }
}

function updateCardPresentation(card) {
  if (card.isOpen) {
    card.button.classList.add("is-open");
  } else {
    card.button.classList.remove("is-open");
  }

  if (card.isMatched) {
    card.button.classList.add("is-matched");
    card.button.setAttribute("aria-label", "Найденная пара: " + card.name);
  } else if (card.isOpen) {
    card.button.classList.remove("is-matched");
    card.button.setAttribute("aria-label", "Открытая карточка: " + card.name);
  } else {
    card.button.classList.remove("is-matched");
    card.button.setAttribute("aria-label", "Закрытая карточка");
  }
}

function updateStats() {
  movesCountElement.textContent = String(movesCount);
  pairsCountElement.textContent = String(foundPairs);
}

function updateInteractionAvailability() {
  newGameButton.disabled = modalOpen;
  leaderboardButton.disabled = modalOpen;

  for (let index = 0; index < gameCards.length; index += 1) {
    const card = gameCards[index];
    card.button.disabled = modalOpen || mismatchLocked || gameFinished || card.isOpen || card.isMatched;
  }
}

function handleCardSelection(card) {
  if (modalOpen || mismatchLocked || gameFinished || card.isOpen || card.isMatched) {
    return;
  }

  if (card.gameId !== currentGameId) {
    return;
  }

  card.isOpen = true;
  updateCardPresentation(card);

  if (firstCard === null) {
    firstCard = card;
    updateInteractionAvailability();
    return;
  }

  movesCount += 1;
  updateStats();
  const previousCard = firstCard;

  if (previousCard.name === card.name) {
    previousCard.isMatched = true;
    card.isMatched = true;
    foundPairs += 1;
    firstCard = null;
    updateCardPresentation(previousCard);
    updateCardPresentation(card);
    updateStats();

    if (foundPairs === animals.length) {
      gameFinished = true;
      openVictoryModal();
    } else {
      updateInteractionAvailability();
    }

    return;
  }

  mismatchLocked = true;
  firstCard = null;
  const mismatchGameId = currentGameId;
  const mismatchedFirstCard = previousCard;
  const mismatchedSecondCard = card;

  mismatchTimer = setTimeout(function () {
    if (mismatchGameId !== currentGameId) {
      return;
    }

    mismatchedFirstCard.isOpen = false;
    mismatchedSecondCard.isOpen = false;
    updateCardPresentation(mismatchedFirstCard);
    updateCardPresentation(mismatchedSecondCard);
    mismatchLocked = false;
    mismatchTimer = null;
    updateInteractionAvailability();
  }, 1000);

  updateInteractionAvailability();
}

function startNewGame() {
  if (mismatchTimer !== null) {
    clearTimeout(mismatchTimer);
  }

  mismatchTimer = null;
  currentGameId += 1;
  mismatchLocked = false;
  firstCard = null;
  gameFinished = false;
  movesCount = 0;
  foundPairs = 0;

  if (modalOpen) {
    closeModal();
  }

  gameCards = createShuffledCards();
  renderCards();
  updateStats();
  updateInteractionAvailability();
}

function formatMoveWord(count) {
  const lastTwoDigits = count % 100;
  const lastDigit = count % 10;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
    return "ходов";
  }

  if (lastDigit === 1) {
    return "ход";
  }

  if (lastDigit >= 2 && lastDigit <= 4) {
    return "хода";
  }

  return "ходов";
}

function createModalButton(label, secondary, handler) {
  const classNames = secondary ? "button button-secondary" : "button";
  const button = createElement("button", classNames, label);
  button.type = "button";
  button.addEventListener("click", handler);
  return button;
}

function openModal(title, content, buttons) {
  modalTitle.textContent = title;
  modalContent.textContent = "";
  modalActions.textContent = "";
  modalContent.append(content);

  for (let index = 0; index < buttons.length; index += 1) {
    modalActions.append(buttons[index]);
  }

  modalOpen = true;
  modalBackdrop.classList.add("is-open");
  document.body.classList.add("modal-open");
  updateInteractionAvailability();
}

function closeModal() {
  if (!modalOpen) {
    return;
  }

  modalOpen = false;
  modalBackdrop.classList.remove("is-open");
  document.body.classList.remove("modal-open");
  modalContent.textContent = "";
  modalActions.textContent = "";
  updateInteractionAvailability();
}

function openVictoryModal() {
  const message = "Вы нашли все пары за " + movesCount + " " + formatMoveWord(movesCount) + ".";
  const content = createElement("p", "", message);
  const restartButton = createModalButton("Новая игра", false, startNewGame);
  const closeButton = createModalButton("Закрыть", true, closeModal);
  openModal("Победа!", content, [restartButton, closeButton]);
}

function handleDocumentKeydown(event) {
  if (modalOpen && event.key === "Escape") {
    closeModal();
  }
}

function buildInterface() {
  gameRoot = createElement("main", "game");

  const header = createElement("header", "game-header");
  const title = createElement("h1", "game-title", "Игра на память");
  const actions = createElement("div", "game-actions");
  newGameButton = createElement("button", "button", "Новая игра");
  newGameButton.type = "button";
  leaderboardButton = createElement("button", "button button-secondary", "Таблица лидеров");
  leaderboardButton.type = "button";
  newGameButton.addEventListener("click", startNewGame);
  actions.append(newGameButton, leaderboardButton);
  header.append(title, actions);

  const stats = createElement("section", "game-stats");
  const movesLabel = createElement("p", "", "Ходы: ");
  movesCountElement = createElement("span", "", "0");
  movesCountElement.id = "moves-count";
  movesLabel.append(movesCountElement);
  const pairsLabel = createElement("p", "", "Пары: ");
  pairsCountElement = createElement("span", "", "0");
  pairsCountElement.id = "pairs-count";
  const pairTotal = createElement("span", "", " из 8");
  pairsLabel.append(pairsCountElement, pairTotal);
  stats.append(movesLabel, pairsLabel);

  gameBoard = createElement("section", "game-board");
  gameBoard.setAttribute("aria-label", "Игровое поле");
  gameRoot.append(header, stats, gameBoard);

  modalBackdrop = createElement("div", "modal-backdrop");
  modalPanel = createElement("section", "modal-panel");
  modalPanel.setAttribute("role", "dialog");
  modalPanel.setAttribute("aria-modal", "true");
  modalTitle = createElement("h2", "modal-title");
  modalTitle.id = "modal-title";
  modalPanel.setAttribute("aria-labelledby", "modal-title");
  modalContent = createElement("div", "modal-content");
  modalActions = createElement("div", "modal-actions");
  modalPanel.append(modalTitle, modalContent, modalActions);
  modalBackdrop.append(modalPanel);
  modalBackdrop.addEventListener("click", function (event) {
    if (event.target === modalBackdrop) {
      closeModal();
    }
  });
  document.addEventListener("keydown", handleDocumentKeydown);

  document.body.append(gameRoot, modalBackdrop);
}

buildInterface();
startNewGame();
