const state = {
    tips: 0,
    patience: 3,
    orders: []
};

const scoreDisplay = document.getElementById("score");
const livesDisplay = document.getElementById("lives");
const orderListUI = document.getElementById("active-orders");
const baristaInput = document.getElementById("barista-input");
const orderBtn = document.getElementById("order-btn");

function placeOrder() {
    if (state.patience <= 0) {
        alert("Game Over! The café is closed.");
        return;
    }

    const drinks = ["Coffee", "Tea"];
    const randomDrink = drinks[Math.floor(Math.random() * drinks.length)];
    state.orders.push(randomDrink);

    const li = document.createElement("li");
    li.textContent = randomDrink;
    li.className = "user-item"; 
    orderListUI.appendChild(li);
}

function handleBaristaWork(e) {
    const typedValue = e.target.value.trim().toLowerCase();
    const firstOrderInQueue = state.orders[0] ? state.orders[0].toLowerCase() : null;

    if (firstOrderInQueue && typedValue === firstOrderInQueue) {
        state.orders.shift();
        state.tips += 10;
        scoreDisplay.textContent = state.tips;
        
        if (orderListUI.firstChild) {
            orderListUI.removeChild(orderListUI.firstChild);
        }

        e.target.value = "";
        scoreDisplay.style.color = "gold";
        setTimeout(() => { scoreDisplay.style.color = ""; }, 300);
    }
}

if (orderBtn && baristaInput) {
    orderBtn.addEventListener("click", placeOrder);
    baristaInput.addEventListener("input", handleBaristaWork);
}
