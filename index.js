const state = {
    tips: 0,
    orders: [],
    timeLeft: 60,
    gameActive: false,
    isPaused: false,
    timerInterval: null,
    spawnInterval: null,
    spawnSpeed: 2500
};

const sfx = {
    success: new Audio('success.mp3'),
    error: new Audio('error.mp3'),
    record: new Audio('record.mp3')
};

const screens = {
    start: document.getElementById("screen-start"),
    game: document.getElementById("screen-game"),
    ranking: document.getElementById("screen-ranking")
};

const bgMusic = document.getElementById("bg-music");
const baristaInput = document.getElementById("barista-input");
const orderListUI = document.getElementById("active-orders");
const pauseOverlay = document.getElementById("pause-overlay");
const scoreDisplay = document.getElementById("score");
const timerDisplay = document.getElementById("timer");

function showScreen(screenId) {
    Object.values(screens).forEach(s => s.classList.add("hidden"));
    screens[screenId].classList.remove("hidden");
}

function updateRankingUI() {
    const scores = JSON.parse(localStorage.getItem("bistroScores")) || [];
    scores.sort((a, b) => b.score - a.score);
    
    document.getElementById("best-three-list").innerHTML = scores.slice(0, 3)
        .map(s => `<li>${s.name}: $${s.score}</li>`).join("");

    document.getElementById("top-ten-list").innerHTML = scores.slice(0, 10)
        .map(s => `<li>${s.name}: $${s.score}</li>`).join("");
}

document.getElementById("start-btn").addEventListener("click", () => {
    bgMusic.play().catch(() => {});
    bgMusic.volume = 0.2;
    showScreen("game");
    initGame();
});

function initGame() {
    state.tips = 0;
    state.timeLeft = 60;
    state.orders = [];
    state.spawnSpeed = 2500;
    state.gameActive = true;
    state.isPaused = false;
    
    scoreDisplay.textContent = "0";
    timerDisplay.textContent = "60";
    orderListUI.innerHTML = "";
    baristaInput.value = "";
    baristaInput.focus();
    pauseOverlay.classList.add("hidden");

    const progressBar = document.getElementById("timer-progress");
    progressBar.style.width = "100%";
    progressBar.style.backgroundColor = "#2ecc71";
    
    startLoops();
}

function startLoops() {
    state.timerInterval = setInterval(() => {
        state.timeLeft--;
        timerDisplay.textContent = state.timeLeft;

        const progressBar = document.getElementById("timer-progress");
        const percentage = (state.timeLeft / 60) * 100;
        progressBar.style.width = percentage + "%";
        if (state.timeLeft < 15) progressBar.style.backgroundColor = "#e74c3c";
        
        if (state.timeLeft === 40) updateSpawnSpeed(1800);
        if (state.timeLeft === 20) updateSpawnSpeed(1000);

        if (state.timeLeft <= 0) endGame();
    }, 1000);
    
    state.spawnInterval = setInterval(spawnOrder, state.spawnSpeed);
}

function updateSpawnSpeed(newSpeed) {
    clearInterval(state.spawnInterval);
    state.spawnSpeed = newSpeed;
    state.spawnInterval = setInterval(spawnOrder, state.spawnSpeed);
}

function spawnOrder() {
    const drinks = ["Coffee", "Tea"];
    const drink = drinks[Math.floor(Math.random() * drinks.length)];
    state.orders.push(drink);
    
    const li = document.createElement("li");
    li.textContent = drink;
    li.className = "user-item";
    orderListUI.appendChild(li);
}

baristaInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !state.isPaused) {
        const val = baristaInput.value.trim().toLowerCase();
        const firstOrder = state.orders[0] ? state.orders[0].toLowerCase() : null;

        if (firstOrder && val === firstOrder) {
            sfx.success.currentTime = 0;
            sfx.success.play();

            const container = document.getElementById("game-container");
            container.classList.add("success-flash");
            setTimeout(() => container.classList.remove("success-flash"), 250);

            state.orders.shift();
            state.tips += 10;
            scoreDisplay.textContent = state.tips;
            orderListUI.removeChild(orderListUI.firstChild);
            baristaInput.value = "";
        } else {
            sfx.error.currentTime = 0;
            sfx.error.play();
            baristaInput.classList.add("shake");
            setTimeout(() => baristaInput.classList.remove("shake"), 300);
            baristaInput.value = "";
        }
    }
});

baristaInput.addEventListener("paste", (e) => {
    e.preventDefault();
    sfx.error.play();
    baristaInput.classList.add("shake");
    setTimeout(() => baristaInput.classList.remove("shake"), 300);
});

document.getElementById("pause-btn").addEventListener("click", () => {
    if (!state.isPaused) {
        clearInterval(state.timerInterval);
        clearInterval(state.spawnInterval);
        state.isPaused = true;
        pauseOverlay.classList.remove("hidden");
        document.getElementById("pause-btn").textContent = "Resume";
    } else {
        state.isPaused = false;
        pauseOverlay.classList.add("hidden");
        document.getElementById("pause-btn").textContent = "Pause Game";
        startLoops();
        baristaInput.focus();
    }
});

function endGame() {
    clearInterval(state.timerInterval);
    clearInterval(state.spawnInterval);
    state.gameActive = false;
    
    sfx.record.play().catch(() => {});
    
    setTimeout(() => {
        const name = prompt(`Great shift! You earned $${state.tips}. Enter your name:`) || "Guest";
        const scores = JSON.parse(localStorage.getItem("bistroScores")) || [];
        scores.push({ name, score: state.tips });
        localStorage.setItem("bistroScores", JSON.stringify(scores));
        
        updateRankingUI();
        showScreen("ranking");
    }, 200);
}

document.getElementById("restart-btn").addEventListener("click", () => showScreen("start"));

document.getElementById("mute-btn").addEventListener("click", () => {
    bgMusic.muted = !bgMusic.muted;
    sfx.success.muted = bgMusic.muted;
    sfx.error.muted = bgMusic.muted;
    sfx.record.muted = bgMusic.muted;
    document.getElementById("mute-btn").textContent = bgMusic.muted ? "🔇" : "🔊";
});

updateRankingUI();
showScreen("start");
