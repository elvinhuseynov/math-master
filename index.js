var beforeStart = document.querySelector("#beforeStart");
var afterStart = document.querySelector("#afterStart");
var highScore = document.querySelector("#highScore");
var latestScore = document.querySelector("#latestScore");
var submitStart = document.querySelector("#submitStart");
var level = document.querySelector("#level");
var gameOver = document.querySelector("#gameOver");
var score = document.querySelector("#score");
var remainingTime = document.querySelector("#remainingTime");
var question = document.querySelector("#question");
var answerInput = document.querySelector("#answerInput");
var submitAnswer = document.querySelector("#submitAnswer");
window.addEventListener("load", function () {
    var _a, _b;
    highScore.textContent = "High score: ".concat((_a = localStorage.getItem("highScore")) !== null && _a !== void 0 ? _a : 0);
    latestScore.textContent = "Latest score: ".concat((_b = localStorage.getItem("latestScore")) !== null && _b !== void 0 ? _b : 0);
});
var gameDetails = {
    level: 1,
    score: 0,
    remainingTime: 30,
    question: "",
    answer: 0,
    interval: 0,
};
var operations = ["+", "-", "*", "/"];
var handleOperationType = {
    1: operations[0],
    2: operations[Math.floor(Math.random() * 2)],
    3: operations[Math.floor(Math.random() * 3)],
    4: operations[Math.floor(Math.random() * 4)],
};
var handleRemainingTimeByLevel = {
    1: 30,
    2: 20,
    3: 15,
    4: 10,
};
var handleGameOver = function () {
    var latestHighScore = localStorage.getItem("highScore");
    localStorage.setItem("highScore", +latestHighScore >= gameDetails.score
        ? latestHighScore !== null && latestHighScore !== void 0 ? latestHighScore : "0"
        : "".concat(gameDetails.score));
    localStorage.setItem("latestScore", "".concat(gameDetails.score));
    highScore.textContent = "High score: ".concat(localStorage.getItem("highScore"));
    latestScore.textContent = "Latest score: ".concat(localStorage.getItem("latestScore"));
    afterStart.style.display = "none";
    beforeStart.style.display = "block";
    gameOver.textContent = "Game over, your score was ".concat(gameDetails.score);
};
var handleRemainingTime = function () {
    var currentScore = gameDetails.score;
    var interval = setInterval(function () {
        remainingTime.textContent = "Remaining time: ".concat(gameDetails.remainingTime - 1);
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
var handleSubmitAnswer = function () {
    if (+answerInput.value !== gameDetails.answer) {
        handleGameOver();
        latestScore.textContent = "Latest score: ".concat(gameDetails.score);
        clearInterval(gameDetails.interval);
        remainingTime.textContent = "Remaining time: ";
        gameDetails.remainingTime = 30;
        gameDetails.level = 1;
        gameDetails.score = 0;
        level.textContent = "Level: ";
        score.textContent = "Score: ";
        answerInput.value = "";
        return;
    }
    if (+answerInput.value === gameDetails.answer) {
        gameDetails.score++;
        score.textContent = "Score: ".concat(gameDetails.score);
        if (gameDetails.score % 5 === 0) {
            if (gameDetails.level === 4) {
                handleGameOver();
                return;
            }
            gameDetails.level += 1;
            level.textContent = "Level: ".concat(gameDetails.level);
        }
    }
    answerInput.value = "";
    gameDetails.remainingTime = handleRemainingTimeByLevel[gameDetails.level];
    remainingTime.textContent = "Remaining time: ".concat(gameDetails.remainingTime);
    generateQuestion();
};
var handleAnswer = function (_a) {
    var num1 = _a.num1, num2 = _a.num2, operationType = _a.operationType;
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
var generateQuestion = function () {
    var operationType = "+";
    var num1 = Math.floor(Math.random() * 10);
    var num2 = Math.floor(Math.random() * 10);
    operationType = handleOperationType[gameDetails.level];
    gameDetails.question = "".concat(num1, " ").concat(operationType, " ").concat(num2);
    handleAnswer({ num1: num1, num2: num2, operationType: operationType });
    question.textContent = "Question: ".concat(gameDetails.question);
    handleRemainingTime();
};
var startGame = function () {
    afterStart.style.display = "block";
    beforeStart.style.display = "none";
    level.textContent = level.textContent + gameDetails.level;
    remainingTime.textContent = "".concat(remainingTime.textContent, " ").concat(gameDetails.remainingTime);
    score.textContent = score.textContent + gameDetails.score;
    generateQuestion();
};
submitStart.addEventListener("click", startGame);
submitAnswer.addEventListener("click", handleSubmitAnswer);
