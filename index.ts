const beforeStart = document.querySelector("#beforeStart") as HTMLDivElement;
const afterStart = document.querySelector("#afterStart") as HTMLDivElement;
const highScore = document.querySelector("#highScore") as HTMLHeadingElement;
const latestScore = document.querySelector(
  "#latestScore"
) as HTMLHeadingElement;
const submitStart = document.querySelector("#submitStart") as HTMLButtonElement;
const level = document.querySelector("#level") as HTMLHeadingElement;
const gameOver = document.querySelector("#gameOver") as HTMLHeadingElement;
const score = document.querySelector("#score") as HTMLHeadingElement;
const remainingTime = document.querySelector(
  "#remainingTime"
) as HTMLHeadingElement;
const question = document.querySelector("#question") as HTMLHeadingElement;
const answerInput = document.querySelector("#answerInput") as HTMLInputElement;
const submitAnswer = document.querySelector(
  "#submitAnswer"
) as HTMLButtonElement;

window.addEventListener("load", () => {
  highScore.textContent = `High score: ${
    localStorage.getItem("highScore") ?? 0
  }`;
  latestScore.textContent = `Latest score: ${
    localStorage.getItem("latestScore") ?? 0
  }`;
});

const gameDetails = {
  level: 1,
  score: 0,
  remainingTime: 30,
  question: "",
  answer: 0,
  interval: 0,
};

const operations = ["+", "-", "*", "/"];

const handleOperationType = {
  1: operations[0],
  2: operations[Math.floor(Math.random() * 2)],
  3: operations[Math.floor(Math.random() * 3)],
  4: operations[Math.floor(Math.random() * 4)],
};

const handleRemainingTimeByLevel = {
  1: 30,
  2: 20,
  3: 15,
  4: 10,
};

const handleGameOver = () => {
  const latestHighScore = localStorage.getItem("highScore");
  localStorage.setItem(
    "highScore",
    +latestHighScore! >= gameDetails.score
      ? latestHighScore ?? "0"
      : `${gameDetails.score}`
  );
  localStorage.setItem("latestScore", `${gameDetails.score}`);
  highScore.textContent = `High score: ${localStorage.getItem("highScore")}`;
  latestScore.textContent = `Latest score: ${localStorage.getItem(
    "latestScore"
  )}`;
  afterStart.style.display = "none";
  beforeStart.style.display = "block";
  gameOver.textContent = `Game over, your score was ${gameDetails.score}`;
};

const handleRemainingTime = () => {
  const currentScore = gameDetails.score;
  const interval = setInterval(() => {
    remainingTime.textContent = `Remaining time: ${
      gameDetails.remainingTime - 1
    }`;

    gameDetails.remainingTime = gameDetails.remainingTime - 1;

    if (gameDetails.remainingTime === 0) {
      handleGameOver();
      clearInterval(interval);
    }

    if (currentScore !== gameDetails.score) {
      clearInterval(interval);
    }
  }, 1000);

  gameDetails.interval = interval;
};

const handleSubmitAnswer = () => {
  if (+answerInput.value !== gameDetails.answer) {
    handleGameOver();
    latestScore.textContent = `Latest score: ${gameDetails.score}`;
    clearInterval(gameDetails.interval);
    remainingTime.textContent = "Remaining time: ";
    gameDetails.remainingTime = 30;
    gameDetails.level = 1;
    gameDetails.score = 0;
    level.textContent = `Level: `;
    score.textContent = `Score: `;
    answerInput.value = "";
    return;
  }
  if (+answerInput.value === gameDetails.answer) {
    gameDetails.score++;
    score.textContent = `Score: ${gameDetails.score}`;

    if (gameDetails.score % 5 === 0) {
      if (gameDetails.level === 4) {
        handleGameOver();
        return;
      }

      gameDetails.level += 1;
      level.textContent = `Level: ${gameDetails.level}`;
    }
  }
  answerInput.value = "";
  gameDetails.remainingTime = handleRemainingTimeByLevel[gameDetails.level];
  remainingTime.textContent = `Remaining time: ${gameDetails.remainingTime}`;
  generateQuestion();
};

const handleAnswer = ({
  num1,
  num2,
  operationType,
}: {
  num1: number;
  num2: number;
  operationType: string;
}) => {
  if (operationType === "+") {
    gameDetails.answer = num1 + num2;
  }
  if (operationType === "-") {
    gameDetails.answer = num1 - num2;
  }
  if (operationType === "*") {
    gameDetails.answer = num1 * num2;
  }
  if (operationType === "/") {
    gameDetails.answer = num1 / num2;
  }
};

const generateQuestion = () => {
  let operationType = "+";
  let num1 = Math.floor(Math.random() * 10);
  let num2 = Math.floor(Math.random() * 10);
  operationType = handleOperationType[gameDetails.level];
  gameDetails.question = `${num1} ${operationType} ${num2}`;
  handleAnswer({ num1, num2, operationType });
  question.textContent = `Question: ${gameDetails.question}`;
  handleRemainingTime();
};

const startGame = () => {
  afterStart.style.display = "block";
  beforeStart.style.display = "none";
  level.textContent = level.textContent! + gameDetails.level;
  remainingTime.textContent = `${remainingTime.textContent!} ${
    gameDetails.remainingTime
  }`;
  score.textContent = score.textContent! + gameDetails.score;
  generateQuestion();
};
submitStart.addEventListener("click", startGame);
submitAnswer.addEventListener("click", handleSubmitAnswer);
