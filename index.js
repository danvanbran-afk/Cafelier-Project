/**
 * CAFÉLIER BISTRÔ - CORE GAME ENGINE
 * Features: SPA Navigation, Progressive Difficulty, Anti-Cheat, Local Persistence.
 */

// 1. STATE MANAGEMENT
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

// 2. SOUND EFFECTS (SFX)
// Ensure these files are in your main folder
const sfx = {
    success: new Audio('zapsplat_foley_cash_register_ka_ching_002_44083.mp3'),
    error: new Audio('zapsplat_multimedia_gameshow_buzzer_incorrect_buzz_low_pitched_002_91601.mp3'),
    record: new Audio('zapsplat_multimedia_game_sound_bright_positive_end_success_level_up_109631.mp3')
};

// 3. CACHING DOM ELEMENTS
const dom = {
    screens: {
        start: document.getElementById("screen-start"),
        game: document.getElementById("screen-game"),
        ranking: document.getElementById("screen-ranking")
    },
    score: document.getElementById("score"),
    timer: document.getElementById("timer"),
    input: document.getElementById("barista-input"),
    orderList: document.getElementById("active-orders"),
    overlay: document.getElementById("pause-overlay"),
    music: document.getElementById("bg-music"),
    muteBtn: document.getElementById("mute-btn")
};

// 4. NAVIGATION SYSTEM
function showScreen(screenId) {
    // Hide all screens first
    Object.values(dom.screens).forEach(screen => {
        screen.classList.add("hidden");
    });
    // Show the requested screen
    dom.screens[screenId].classList.remove("hidden");
}

// 5. RANKING LOGIC (LocalStorage)
function updateRankingUI() {
    const scores = JSON.parse(localStorage.getItem("bistroScores")) || [];
    
    // Sort from highest tip to lowest
    scores.sort((a, b) => b.score - a.score);
    
    // Fill the Top 3 on Start Screen
    const bestThree = document.getElementById("best-three-list");
    bestThree.innerHTML = scores.slice(0, 3)
        .map(s => `<li>${s.name}: $${s.score}</li>`)
        .join("");

    // Fill the Top 10 on Ranking Screen
    const topTen = document.getElementById("top-ten-list");
    topTen.innerHTML = scores.slice(0, 10)
        .map(s => `<li>${s.name}: $${s.score}</li>`)
        .join("");
}

// 6. GAME INITIALIZATION
document.getElementById("start-btn").addEventListener("click", function() {
    // Browser audio unlock requirement
    dom.music.play().catch(() => {
        console.warn("Audio interaction required first.");
    });
    dom.music.volume = 0.25;
    
    showScreen("game");
    resetGameSession();
});

function resetGameSession() {
    state.tips = 0;
    state.timeLeft = 60;
    state.orders = [];
    state.spawnSpeed = 2500;
    state.gameActive = true;
    state.isPaused = false;
    
    // UI Reset
    dom.score.textContent = "0";
    dom.timer.textContent = "60";
    dom.orderList.innerHTML = "";
    dom.input.value = "";
    dom.input.disabled = false;
    dom.input.focus();
    dom.overlay.classList.add("hidden");
    
    runGameLoops();
}

// 7. CORE LOOPS (Timer & Spawner)
function runGameLoops() {
    // Timer Loop
    state.timerInterval = setInterval(function() {
        if (!state.isPaused) {
            state.timeLeft--;
            dom.timer.textContent = state.timeLeft;
            
            // PROGRESSIVE DIFFICULTY: Speed up at specific intervals
            if (state.timeLeft === 40) adjustDifficulty(1800);
            if (state.timeLeft === 20) adjustDifficulty(1000);

            if (state.timeLeft <= 0) finalizeGame();
        }
    }, 1000);
    
    // Spawner Loop
    state.spawnInterval = setInterval(createNewOrder, state.spawnSpeed);
}

function adjustDifficulty(newSpeed) {
    clearInterval(state.spawnInterval);
    state.spawnSpeed = newSpeed;
    state.spawnInterval = setInterval(createNewOrder, state.spawnSpeed);
}

function createNewOrder() {
    if (state.gameActive && !state.isPaused) {
        const items = ["Coffee", "Tea"];
        const selected = items[Math.floor(Math.random() * items.length)];
        
        state.orders.push(selected);
        
        // Create Visual Element
        const li = document.createElement("li");
        li.textContent = selected;
        li.className = "user-item";
        dom.orderList.appendChild(li);
    }
}

// 8. PLAYER INPUT & VALIDATION
dom.input.addEventListener("keydown", function(event) {
    if (event.key === "Enter" && !state.isPaused) {
        const userInput = dom.input.value.trim().toLowerCase();
        const currentTarget = state.orders[0] ? state.orders[0].toLowerCase() : null;

        if (currentTarget && userInput === currentTarget) {
            // SUCCESS CASE
            sfx.success.currentTime = 0;
            sfx.success.play();
            
            state.orders.shift(); // Remove from logic
            state.tips += 10;
            dom.score.textContent = state.tips;
            
            // Remove from DOM
            if (dom.orderList.firstChild) {
                dom.orderList.removeChild(dom.orderList.firstChild);
            }
            dom.input.value = "";
        } else {
            // ERROR CASE
            sfx.error.currentTime = 0;
            sfx.error.play();
            
            dom.input.classList.add("shake");
            setTimeout(() => {
                dom.input.classList.remove("shake");
            }, 400);
            dom.input.value = "";
        }
    }
});

// ANTI-CHEAT: Disable Paste Action
dom.input.addEventListener("paste", function(e) {
    e.preventDefault();
    sfx.error.play();
    dom.input.classList.add("shake");
    setTimeout(() => dom.input.classList.remove("shake"), 400);
});

// 9. PAUSE SYSTEM
document.getElementById("pause-btn").addEventListener("click", function() {
    const btn = document.getElementById("pause-btn");
    
    if (!state.isPaused) {
        // Pausing
        clearInterval(state.timerInterval);
        clearInterval(state.spawnInterval);
        state.isPaused = true;
        dom.overlay.classList.remove("hidden");
        btn.textContent = "Resume";
        dom.input.disabled = true;
    } else {
        // Resuming
        state.isPaused = false;
        dom.overlay.classList.add("hidden");
        btn.textContent = "Pause Game";
        dom.input.disabled = false;
        dom.input.focus();
        runGameLoops();
    }
});

// 10. END GAME & PERSISTENCE
function finalizeGame() {
    clearInterval(state.timerInterval);
    clearInterval(state.spawnInterval);
    state.gameActive = false;
    
    // Play Record SFX
    sfx.record.play().catch(() => {});
    
    // Small delay to allow audio start before browser prompt freezes code
    setTimeout(() => {
        const player = prompt(`Time is up! You earned $${state.tips}.\nPlease enter your name:`) || "Guest";
        
        const history = JSON.parse(localStorage.getItem("bistroScores")) || [];
        history.push({ name: player, score: state.tips });
        localStorage.setItem("bistroScores", JSON.stringify(history));
        
        updateRankingUI();
        showScreen("ranking");
    }, 150);
}

// 11. CONTROLS & SYSTEM EVENTS
document.getElementById("restart-btn").addEventListener("click", function() {
    showScreen("start");
});

dom.muteBtn.addEventListener("click", function() {
    const status = !dom.music.muted;
    dom.music.muted = status;
    sfx.success.muted = status;
    sfx.error.muted = status;
    sfx.record.muted = status;
    
    dom.muteBtn.textContent = status ? "🔇" : "🔊";
});

// BOOTSTRAP
updateRankingUI();
showScreen("start");
