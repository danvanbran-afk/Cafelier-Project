// 1. Game State (State Tracking)
const state = {
    tips: 0,
    patience: 3,
    orders: [] // Stores the strings: "Coffee" or "Tea"
};

// 2. DOM Elements
const scoreDisplay = document.getElementById("score");
const livesDisplay = document.getElementById("lives");
const orderListUI = document.getElementById("active-orders");
const baristaInput = document.getElementById("barista-input");
const orderBtn = document.getElementById("order-btn");

// 3. Functions

// Add a random order to the queue
function placeOrder() {
    if (state.patience <= 0) {
        alert("Game Over! The café is closed.");
        return;
    }

    const drinks = ["Coffee", "Tea"];
    const randomDrink = drinks[Math.floor(Math.random() * drinks.length)];

    // Update State
    state.orders.push(randomDrink);

    // Update UI: Create <li> and add it to the <ul>
    const li = document.createElement("li");
    li.textContent = randomDrink;
    li.classList.add("user-item"); 
    orderListUI.appendChild(li);
}

// Check input and remove the oldest order
function handleBaristaWork(e) {
    const typedValue = e.target.value.trim();
    const firstOrderInQueue = state.orders[0];

    // Match found (Case Insensitive)
    if (firstOrderInQueue && typedValue.toLowerCase() === firstOrderInQueue.toLowerCase()) {
        // 1. Update Logic State
        state.orders.shift(); // Remove from array
        state.tips += 10;

        // 2. Update UI
        scoreDisplay.textContent = state.tips;
        if (orderListUI.firstChild) {
            orderListUI.removeChild(orderListUI.firstChild);
        }

        // 3. Reset Input
        e.target.value = "";
        
        // Simple UI Feedback
        scoreDisplay.style.color = "gold";
        setTimeout(() => scoreDisplay.style.color = "", 300);
    }
}

// 4. Event Listeners
orderBtn.addEventListener("click", placeOrder);
baristaInput.addEventListener("input", handleBaristaWork);
