const rulesBtn = document.getElementById("rules-btn");
const closeBtn = document.getElementById("close-btn");
const rules = document.getElementById("rules");

const canvas = document.getElementById("canvas");

const ctx = canvas.getContext("2d");

const columnCount = 9;
const rowCount = 5;
let gameOver = false;
let tryLeft = 3;
let score = 0;

rulesBtn.addEventListener("click", () => {
  rules.classList.add("show");
});
closeBtn.addEventListener("click", () => {
  rules.classList.remove("show");
});

//Properties of ball
const ball = {
  x: canvas.width / 2,
  y: canvas.height - 30,
  size: 10,
  speed: 4,
  dx: 4,
  dy: -4,
};
//Porperties of paddle
const paddle = {
  x: canvas.width / 2 - 40,
  y: canvas.height - 20,
  w: 80,
  h: 10,
  speed: 8,
  dx: 0,
};
//Properties of bricks
const brickInfo = {
  w: 70,
  h: 20,
  padding: 10,
  offsetX: 45,
  offsetY: 60,
  visible: true,
};
//Draw paddle
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h);
  ctx.fillStyle = "#0095dd";
  ctx.fill();
  ctx.closePath();
}

//Draw ball

function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
  ctx.fillStyle = "#0095dd";
  ctx.fill();
  ctx.closePath();
}
//draw score
function drawScore() {
  ctx.font = "20px Arial";
  ctx.fillText(`Score: ${score}`, canvas.width - 100, 30);
}
//Create bricks
const bricks = [];
for (let i = 0; i < columnCount; i++) {
  bricks[i] = [];
  for (let j = 0; j < rowCount; j++) {
    const x = i * (brickInfo.w + brickInfo.padding) + brickInfo.offsetX;
    const y = j * (brickInfo.h + brickInfo.padding) + brickInfo.offsetY;
    bricks[i][j] = { x, y, ...brickInfo };
  }
}

//Draw bricks
function drawBricks() {
  bricks.forEach((column) => {
    column.forEach((brick) => {
      ctx.beginPath();
      ctx.rect(brick.x, brick.y, brick.w, brick.h);
      ctx.fillStyle = brick.visible ? "#0095dd" : "transparent";
      ctx.fill();
      ctx.closePath();
    });
  });
}

//key event lestener
document.addEventListener("keydown", (e) => {
  if (flag) flag = false;
  if (gameOver) resetGame();
  if (e.key === "Right" || e.key === "ArrowRight") {
    paddle.dx = paddle.speed;
  }
  if (e.key === "Left" || e.key === "ArrowLeft") {
    paddle.dx = -paddle.speed;
  }
});
document.addEventListener("keyup", (e) => {
  if (
    e.key === "Right" ||
    e.key === "ArrowRight" ||
    e.key === "Left" ||
    e.key === "ArrowLeft"
  ) {
    paddle.dx = 0;
  }
});
//move paddle
function movePaddle() {
  paddle.x += paddle.dx;
  //wall collison
  if (paddle.x + paddle.w > canvas.width) {
    paddle.x = canvas.width - paddle.w;
  }
  if (paddle.x < 0) {
    paddle.x = 0;
  }
}
//move ball
function moveBall() {
  ball.x += ball.dx;
  ball.y += ball.dy;

  //wall collison
  if (ball.x + ball.size > canvas.width || ball.x - ball.size < 0) {
    ball.dx *= -1;
  }
  if (ball.y + ball.size > canvas.height || ball.y - ball.size < 0) {
    ball.dy *= -1;
  }

  //paddle collison
  if (
    ball.x + ball.size > paddle.x &&
    ball.x - ball.size < paddle.x + paddle.w &&
    ball.y + ball.size > paddle.y
  ) {
    ball.dy *= -1;
  }

  //bricks collision
  bricks.forEach((column) => {
    column.forEach((brick) => {
      if (brick.visible) {
        if (
          ball.x + ball.size > brick.x &&
          ball.x - ball.size < brick.x + brick.w &&
          ball.y + ball.size > brick.y &&
          ball.y - ball.size < brick.y + brick.h
        ) {
          ball.dy *= -1;
          brick.visible = false;
          increaseScore();
        }
      }
    });
  });

  //collision with floor
  if (ball.y + ball.size > canvas.height) {
    setTries();
    setStartPosition();
    flag = true;
  }
}
//fucntion game over
function drawGameOver() {
  ctx.font = "40px Arial";
  ctx.fillText("Game Over", 300, 300);
}
//draw tries
function drawTries() {
  ctx.font = "20px Arial";
  ctx.fillText(`Tries Left: ${tryLeft}`, 30, 30);
}
//set tries
function setTries() {
  tryLeft--;
  if (tryLeft === 0) {
    gameOver = true;
  }
}
function resetGame() {
  gameOver = false;
  showAllBricks();
  score = 0;
  tryLeft = 3;
  setStartPosition();
}
let flag = false;
//set start position
function setStartPosition() {
  paddle.x = canvas.width / 2 - 40;
  ball.y = canvas.height - 30;
  ball.x = canvas.width / 2;
}
//increase score
function increaseScore() {
  score++;
}
//show all bricks
function showAllBricks() {
  bricks.forEach((column) => {
    column.forEach((brick) => {
      brick.visible = true;
    });
  });
}

//Draw all
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBall();
  drawPaddle();
  drawScore();
  drawTries();
  if (gameOver) {
    drawGameOver();
  }
  drawBricks();
}
//update all
function update() {
  if (!gameOver) {
    if (!flag) {
      moveBall();
      movePaddle();
      draw();
    }
  }

  requestAnimationFrame(update);
}
update();
