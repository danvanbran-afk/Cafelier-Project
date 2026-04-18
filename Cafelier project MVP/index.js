// 1. STATE TRACKING (Variables to keep track of game data)
const words = ['espresso', 'cappuccino', 'americano', 'macchiato', 'flat-white', 'mocha', 'latte'];
let score = 0;
let time = 10;
let gameInterval;

// 2. DOM ELEMENTS (Selecting parts of the HTML)
const wordDisplay = document.getElementById('current-word');
const userInput = document.getElementById('user-input');
const scoreDisplay = document.getElementById('score');
const timeDisplay = document.getElementById('time-left');
const progressFill = document.getElementById('progress-fill');

// 3. CORE FUNCTIONS
function init() {
    renderWord();
    // Listening for user input (Event Listener)
    userInput.addEventListener('input', checkInput);
    // Start countdown timer
    gameInterval = setInterval(updateTimer, 1000);
}

function renderWord() {
    const randomIndex = Math.floor(Math.random() * words.length);
    wordDisplay.innerText = words[randomIndex];
}

function checkInput() {
    // UI Feedback: Case-insensitive comparison
    if (userInput.value.toLowerCase() === wordDisplay.innerText.toLowerCase()) {
        score++;
        scoreDisplay.innerText = score;
        userInput.value = ''; // Clear input
        renderWord();         // New order
        time = 10;            // Reset timer (Bonus mechanism)
        updateTimerUI();      // Refresh UI
    }
}

function updateTimer() {
    if (time > 0) {
        time--;
    } else {
        clearInterval(gameInterval);
        alert(`Game Over! Final Score: ${score}`);
        resetGame();
    }
    updateTimerUI();
}

function updateTimerUI() {
    timeDisplay.innerText = time;
    progressFill.style.width = (time * 10) + "%"; // Visual feedback
}

function resetGame() {
    score = 0;
    time = 10;
    scoreDisplay.innerText = score;
    userInput.value = '';
    renderWord();
    gameInterval = setInterval(updateTimer, 1000);
}

// Start the game logic
init();
