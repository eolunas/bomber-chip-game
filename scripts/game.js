const canvas = document.querySelector("#game");
const game = canvas.getContext("2d");
const spanLives = document.querySelector("#lives");
const spanTime = document.querySelector("#time");
const spanRecord = document.querySelector("#record");
const btnUp = document.querySelector("#up");
const btnLeft = document.querySelector("#left");
const btnRight = document.querySelector("#right");
const btnDown = document.querySelector("#down");

let canvasSize;
let frameSize;
let level = 0;
let mapElement;
const player = {
  posX: null,
  posY: null,
  lives: 3,
  getX: function () {
    return (this.posX + 0.5) * frameSize;
  },
  getY: function () {
    return (this.posY + 0.8) * frameSize;
  },
};
const gift = {
  posX: null,
  posY: null,
};
const doorLevel = {
  posX: null,
  posY: null,
};

let timeStart;
let timeInterval;

window.addEventListener("load", setCanvasSize);
window.addEventListener("resize", setCanvasSize);

function setCanvasSize() {
  canvasSize =
    window.innerWidth < window.innerHeight
      ? window.innerWidth * 0.8
      : window.innerHeight * 0.8;

  canvas.setAttribute("width", canvasSize);
  canvas.setAttribute("height", canvasSize);

  startGame();
}

function startGame() {
  frameSize = canvasSize / 10;
  game.font = frameSize * 0.8 + "px Verdana";
  game.textAlign = "center";

  const map = maps[level];
  const mapRows = map.trim().split("\n");
  const mapRowCol = mapRows.map((row) => row.trim().split(""));
  mapElement = mapRowCol;

  if (!timeStart) {
    timeStart = Date.now();
    timeInterval = setInterval(showTime, 100);
    showRecord();
  }

  showLives();

  game.clearRect(0, 0, canvasSize, canvasSize);
  mapRowCol.forEach((row, rowI) => {
    row.forEach((obj, colI) => {
      const emoji = emojis[obj];
      const posX = frameSize * (colI + 0.5);
      const posY = frameSize * (rowI + 0.8);
      game.fillText(emoji, posX, posY);
      if (obj == "O") {
        doorLevel.posX = colI;
        doorLevel.posY = rowI;
        player.posX = player.posX != null ? player.posX : colI;
        player.posY = player.posY != null ? player.posY : rowI;
      } else if (obj == "I") {
        gift.posX = colI;
        gift.posY = rowI;
      }
    });
  });
  movePlayer();
}

function movePlayer() {
  const giftCollision = player.posX == gift.posX && player.posY == gift.posY;
  const enemyColision = mapElement[player.posY][player.posX] == "X";

  if (giftCollision) levelWin();
  if (enemyColision) levelFail();

  game.fillText(emojis["PLAYER"], player.getX(), player.getY());
}

function showLives() {
  const liveArray = Array(player.lives).fill(emojis["HEART"]);
  spanLives.innerHTML = liveArray.join("");
}

function showTime() {
  spanTime.innerHTML = ((Date.now() - timeStart) / 1000).toFixed(2);
}

function showRecord() {
  spanRecord.innerHTML = localStorage.getItem("maxScore");
}

function levelWin() {
  if (level < maps.length - 1) {
    level++;
    startGame();
  } else if (level == maps.length - 1) gameWin();
}

function levelFail() {
  if (player.lives > 0) {
    player.lives--;
    player.posX = doorLevel.posX;
    player.posY = doorLevel.posY;
  } else {
    level = 0;
    player.lives = 3;
    timeStart = null;
    player.posX = null;
    player.posY = null;
  }
  startGame();
}

function gameWin() {
  clearInterval(timeInterval);
  const maxScore = localStorage.getItem("maxScore");
  const score = spanTime.innerHTML;
  if (maxScore > score || maxScore == null)
    localStorage.setItem("maxScore", score);
  alert("You win!!" + score);
}

// Button and keyboard event listener:
window.addEventListener("keydown", moveByKeys);
btnUp.addEventListener("click", moveUp);
btnLeft.addEventListener("click", moveLeft);
btnRight.addEventListener("click", moveRight);
btnDown.addEventListener("click", moveDown);

function moveByKeys(event) {
  switch (event.code) {
    case "ArrowUp":
    case "KeyW":
      moveUp();
      break;
    case "ArrowLeft":
    case "KeyA":
      moveLeft();
      break;
    case "ArrowRight":
    case "KeyD":
      moveRight();
      break;
    case "ArrowDown":
    case "KeyS":
      moveDown();
      break;

    default:
      break;
  }
}
function moveUp() {
  const newPos = player.posY - 1;
  if (newPos >= 0) player.posY = newPos;
  startGame();
}
function moveLeft() {
  const newPos = player.posX - 1;
  if (newPos >= 0) player.posX = newPos;
  startGame();
}
function moveRight() {
  const newPos = player.posX + 1;
  if (newPos < 10) player.posX = newPos;
  startGame();
}
function moveDown() {
  const newPos = player.posY + 1;
  if (newPos < 10) player.posY = newPos;
  startGame();
}
