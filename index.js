const state = {
    tips: 0,
    orders: [],
    timeLeft: 60,
    gameActive: false,
    isPaused: false,
    timerInterval: null,
    spawnInterval: null
};

const screens = {
    start: document.getElementById("screen-start"),
    game: document.getElementById("screen-game"),
    ranking: document.getElementById("screen-ranking")
};

const bgMusic = document.getElementById("bg-music");
const baristaInput = document.getElementById("barista-input");
const orderListUI = document.getElementById("active-orders");

function showScreen(screenId) {
    Object.values(screens).forEach(s => s.classList.add("hidden"));
    screens[screenId].classList.remove("hidden");
}

function updateRankingUI() {
    const scores = JSON.parse(localStorage.getItem("bistroScores")) || [];
    scores.sort((a, b) => b.score - a.score);
    document.getElementById("best-three-list").innerHTML = scores.slice(0, 3).map(s => `<li>${s.name}: $${s.score}</li>`).join("");
    document.getElementById("top-ten-list").innerHTML = scores.slice(0, 10).map(s => `<li>${s.name}: $${s.score}</li>`).join("");
}

document.getElementById("start-btn").addEventListener("click", () => {
    bgMusic.play().catch(() => {});
    bgMusic.volume = 0.2;
    showScreen("game");
    resetGame();
});

function resetGame() {
    state.tips = 0; state.timeLeft = 60; state.orders = [];
    state.gameActive = true; state.isPaused = false;
    document.getElementById("score").textContent = "0";
    document.getElementById("timer").textContent = "60";
    orderListUI.innerHTML = "";
    baristaInput.value = "";
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

baristaInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !state.isPaused) {
        const val = baristaInput.value.trim().toLowerCase();
        if (state.orders[0] && val === state.orders[0].toLowerCase()) {
            state.orders.shift();
            state.tips += 10;
            document.getElementById("score").textContent = state.tips;
            orderListUI.removeChild(orderListUI.firstChild);
            baristaInput.value = "";
        }
    }
});

document.getElementById("pause-btn").addEventListener("click", () => {
    const btn = document.getElementById("pause-btn");
    if (!state.isPaused) {
        clearInterval(state.timerInterval);
        clearInterval(state.spawnInterval);
        state.isPaused = true;
        btn.textContent = "Resume";
    } else {
        startLoops();
        state.isPaused = false;
        btn.textContent = "Pause Game";
        baristaInput.focus();
    }
});

function endGame() {
    clearInterval(state.timerInterval);
    clearInterval(state.spawnInterval);
    const name = prompt(`Shift ended! Earned: $${state.tips}. Name:`) || "Guest";
    const scores = JSON.parse(localStorage.getItem("bistroScores")) || [];
    scores.push({ name, score: state.tips });
    localStorage.setItem("bistroScores", JSON.stringify(scores));
    updateRankingUI();
    showScreen("ranking");
}

document.getElementById("restart-btn").addEventListener("click", () => showScreen("start"));
document.getElementById("mute-btn").addEventListener("click", () => {
    bgMusic.muted = !bgMusic.muted;
    document.getElementById("mute-btn").textContent = bgMusic.muted ? "🔇" : "🔊";
});

updateRankingUI();
showScreen("start");