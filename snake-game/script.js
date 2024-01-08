// define html elements
const board = document.getElementById("game-board");
const instructionText = document.getElementById("instruction-text");
const logo = document.getElementById("logo");
const score = document.getElementById("score");
const highScoreText = document.getElementById("highScore");
//Define game variables
const GridSize = 20;
let snake = [{ x: 10, y: 10 }];
let food = generateFood();
let highScore = 0;
let direction = "right";
let gameInterval;
let gameSpeedDelay = 200;
let gameStarted = false;
let lastInput;
// Draw game map, snake, food
function draw() {
  board.innerHTML = " ";
  drawSnake();
  drawFood();
  updateScore();
}

// function to draw snake
function drawSnake() {
  snake.forEach((segment) => {
    const snakeElement = createGameElement("div", "snake");
    setPosition(snakeElement, segment);
    board.appendChild(snakeElement);
  });
}

// Create a snake or food cube/div
function createGameElement(tag, className) {
  const element = document.createElement(tag);
  element.className = className;
  return element;
}

// Set the position of the snake or food
function setPosition(element, position) {
  element.style.gridColumn = position.x;
  element.style.gridRow = position.y;
}

// testing draw function
//draw();

//draw food function
function drawFood() {
  if (gameStarted) {
    const foodElement = createGameElement("div", "food");
    setPosition(foodElement, food);
    board.appendChild(foodElement);
  }
}
//Generate food
function generateFood() {
  const x = Math.floor(Math.random() * GridSize) + 1;
  const y = Math.floor(Math.random() * GridSize) + 1;
  return { x, y };
}

//Moving snake
function move() {
  const head = { ...snake[0] };
  switch (direction) {
    case "up":
      head.y--;
      break;
    case "down":
      head.y++;
      break;
    case "left":
      head.x--;
      break;
    case "right":
      head.x++;
      break;
  }
  snake.unshift(head);
  // if get food, grow one, if not do not grow
  if (head.x === food.x && head.y === food.y) {
    food = generateFood();
    //if food spawns on snake respawn food
    snake.forEach((segment) => {
      if (segment.x === food.x && segment.y === food.y) {
        food = generateFood();
      }
    });
    increaseSpeed();
    clearInterval(gameInterval); // clear past interval
    gameInterval = setInterval(() => {
      move();
      checkCollision();
      draw();
    }, gameSpeedDelay);
  } else {
    snake.pop();
  }
}
// start game function
function startGame() {
  gameStarted = true; // keep track of a running game
  instructionText.style.display = "none";
  logo.style.display = "none";
  gameInterval = setInterval(() => {
    move();
    checkCollision();
    draw();
  }, gameSpeedDelay);
}

// keypress event listener
function handleKeyPress(event) {
  if (
    (!gameStarted && event.code === "Space") ||
    (!gameStarted && event.key === " ")
  ) {
    startGame();
  } else {
    switch (event.key) {
      case "ArrowUp":
        if (direction != "down") {
          direction = "up";
        }
        break;
      case "ArrowDown":
        if (direction != "up") {
          direction = "down";
        }
        break;
      case "ArrowRight":
        if (direction != "left") {
          direction = "right";
        }
        break;
      case "ArrowLeft":
        if (direction != "right") {
          direction = "left";
        }
        break;
    }
  }
}

document.addEventListener("keydown", handleKeyPress);

function increaseSpeed() {
  //console.log(gameSpeedDelay);
  if (gameSpeedDelay > 150) {
    gameSpeedDelay -= 5;
  } else if (gameSpeedDelay > 100) {
    gameSpeedDelay -= 3;
  } else if (gameSpeedDelay > 50) {
    gameSpeedDelay -= 2;
  } else if (gameSpeedDelay > 25) {
    gameSpeedDelay -= 1;
  }
}
//Checks for collision between the snale and a wall or the snake and itself, if collion is true, reset game
function checkCollision() {
  const head = snake[0];

  if (head.x < 1 || head.x > GridSize || head.y < 1 || head.y > GridSize) {
    resetGame();
  }

  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      resetGame();
    }
  }
}
//resets gamestate to starting position
function resetGame() {
  updateHighScore();
  stopGame();
  snake = [{ x: 10, y: 10 }];
  food = generateFood();
  direction = "right";
  gameSpeedDelay = 200;
  updateScore();
}

function updateScore() {
  const currentScore = snake.length - 1;
  score.textContent = currentScore.toString().padStart(3, "0");
}

function stopGame() {
  clearInterval(gameInterval);
  gameStarted = false;
  instructionText.style.display = "block";
  logo.style.display = "block";
}

function updateHighScore() {
  const currentScore = snake.length - 1;
  if (currentScore > highScore) {
    highScore = currentScore;
    highScoreText.textContent = highScore.toString().padStart(3, 0);
  }
  highScoreText.style.display = "block";
}
