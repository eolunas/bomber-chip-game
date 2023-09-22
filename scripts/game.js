const canvas = document.querySelector("#game");
const game = canvas.getContext("2d");

let canvasSize;

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

  const map = maps[0];
  const mapRows = map.trim().split("\n");
  const mapRowCol = mapRows.map((row) => row.trim());

  for (let i = 1; i <= 10; i++) {
    for (let j = 1; j <= 10; j++) {
      game.fillText(
        emojis[mapRowCol[i - 1][j - 1]],
        frameSize * (i - 0.5),
        frameSize * (j - 0.2)
      );
    }
  }

  //   game.fillRect(0, 0, 100, 100);
  //   game.clearRect(20, 20, 20, 20);

  //   game.font = "25px Verdana";
  //   game.fillStyle = "Purple";
  //   game.textAlign = 'center';
  //   game.fillText("Chip", 150, 50);
}
