const state = {
    tips: 0,
    orders: [],
    timeLeft: 60,
    gameActive: false,
    isPaused: false,
    timerInterval: null,
    spawnInterval: null
};

// DOM Elements
const screens = {
    start: document.getElementById("screen-start"),
    game: document.getElementById("screen-game"),
    ranking: document.getElementById("screen-ranking")
};

const bgMusic = document.getElementById("bg-music");
const muteBtn = document.getElementById("mute-btn");
const baristaInput = document.getElementById("barista-input");
const orderListUI = document.getElementById("active-orders");

// --- NAVIGATION & UI ---
function showScreen(screenId) {
    Object.values(screens).forEach(s => s.classList.add("hidden"));
    screens[screenId].classList.remove("hidden");
}

function updateRankingUI() {
    const scores = JSON.parse(localStorage.getItem("bistroScores")) || [];
    scores.sort((a, b) => b.score - a.score);
    
    // Update Top 3 (Home)
    document.getElementById("best-three-list").innerHTML = scores.slice(0, 3)
        .map(s => `<li>${s.name}: $${s.score}</li>`).join("");

    // Update Top 10 (Ranking Screen)
    document.getElementById("top-ten-list").innerHTML = scores.slice(0, 10)
        .map(s => `<li>${s.name}: $${s.score}</li>`).join("");
}

// --- AUDIO LOGIC ---
muteBtn.addEventListener("click", () => {
    bgMusic.muted = !bgMusic.muted;
    muteBtn.textContent = bgMusic.muted ? "🔇" : "🔊";
});

// --- GAME CORE ---
document.getElementById("start-btn").addEventListener("click", () => {
    bgMusic.play().catch(() => console.log("Audio waiting for interaction"));
    bgMusic.volume = 0.2;
    showScreen("game");
    initNewGame();
});

function initNewGame() {
    state.tips = 0;
    state.timeLeft = 60;
    state.orders = [];
    state.gameActive = true;
    state.isPaused = false;
    
    document.getElementById("score").textContent = "0";
    document.getElementById("timer").textContent = "60";
    orderListUI.innerHTML = "";
    baristaInput.value = "";
    baristaInput.disabled = false;
    baristaInput.focus();
    
    startLoops();
}

function startLoops() {
    state.timerInterval = setInterval(() => {
        state.timeLeft--;
        document.getElementById("timer").textContent = state.timeLeft;
        if (state.timeLeft <= 0) endGame();
    }, 1000);
    
    state.spawnInterval = setInterval(spawnOrder, 2500);
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

// --- PLAYER ACTION ---
baristaInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !state.isPaused) {
        const val = baristaInput.value.trim().toLowerCase();
        const firstOrder = state.orders[0] ? state.orders[0].toLowerCase() : null;

        if (firstOrder && val === firstOrder) {
            state.orders.shift();
            state.tips += 10;
            document.getElementById("score").textContent = state.tips;
            orderListUI.removeChild(orderListUI.firstChild);
            baristaInput.value = "";
        } else {
            // Flash red on error
            baristaInput.style.backgroundColor = "#ffcdd2";
            setTimeout(() => baristaInput.style.backgroundColor = "", 200);
        }
    }
});

// --- PAUSE & END ---
document.getElementById("pause-btn").addEventListener("click", () => {
    if (!state.isPaused) {
        clearInterval(state.timerInterval);
        clearInterval(state.spawnInterval);
        state.isPaused = true;
        document.getElementById("pause-btn").textContent = "Resume";
        baristaInput.disabled = true;
    } else {
        startLoops();
        state.isPaused = false;
        document.getElementById("pause-btn").textContent = "Pause Game";
        baristaInput.disabled = false;
        baristaInput.focus();
    }
});

function endGame() {
    clearInterval(state.timerInterval);
    clearInterval(state.spawnInterval);
    state.gameActive = false;
    
    const name = prompt(`Great shift! You earned $${state.tips}. Enter your name:`) || "Guest";
    const scores = JSON.parse(localStorage.getItem("bistroScores")) || [];
    scores.push({ name, score: state.tips });
    localStorage.setItem("bistroScores", JSON.stringify(scores));
    
    updateRankingUI();
    showScreen("ranking");
}

document.getElementById("restart-btn").addEventListener("click", () => showScreen("start"));

// Initial Setup
updateRankingUI();
showScreen("start");