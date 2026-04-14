// 1. Game State (State Tracking)
const state = {
    tips: 0,
    patience: 3,
    orders: [] // Armazena as strings: "Coffee" ou "Tea"
};

// 2. DOM Elements - Capturados pelos IDs exatos do teu HTML
const scoreDisplay = document.getElementById("score");
const livesDisplay = document.getElementById("lives");
const orderListUI = document.getElementById("active-orders");
const baristaInput = document.getElementById("barista-input");
const orderBtn = document.getElementById("order-btn");

// 3. Functions

// Função para adicionar um pedido aleatório à lista
function placeOrder() {
    if (state.patience <= 0) {
        alert("Game Over! The café is closed.");
        return;
    }

    const drinks = ["Coffee", "Tea"];
    const randomDrink = drinks[Math.floor(Math.random() * drinks.length)];

    // Atualiza o Estado (Lógica)
    state.orders.push(randomDrink);

    // Atualiza a Interface (DOM)
    const li = document.createElement("li");
    li.textContent = randomDrink;
    li.classList.add("user-item"); // Classe para o estilo CSS
    orderListUI.appendChild(li);
}

// Função para validar o que o utilizador escreve
function handleBaristaWork(e) {
    // Remove espaços extra e ignora maiúsculas/minúsculas
    const typedValue = e.target.value.trim().toLowerCase();
    const firstOrderInQueue = state.orders[0] ? state.orders[0].toLowerCase() : null;

    // Se o que foi escrito for igual ao primeiro pedido da fila
    if (firstOrderInQueue && typedValue === firstOrderInQueue) {
        // 1. Atualiza o Estado
        state.orders.shift(); // Remove o primeiro pedido do array
        state.tips += 10;

        // 2. Atualiza o DOM
        scoreDisplay.textContent = state.tips;
        
        // Remove o primeiro <li> da lista visual
        if (orderListUI.firstChild) {
            orderListUI.removeChild(orderListUI.firstChild);
        }

        // 3. Limpa o campo de texto para o próximo pedido
        e.target.value = "";
        
        // Feedback Visual Simples (Brilho no Score)
        scoreDisplay.style.color = "gold";
        scoreDisplay.style.fontWeight = "bold";
        setTimeout(() => {
            scoreDisplay.style.color = "";
            scoreDisplay.style.fontWeight = "";
        }, 300);
    }
}

// 4. Event Listeners - Ligação entre as ações e as funções
if (orderBtn && baristaInput) {
    orderBtn.addEventListener("click", placeOrder);
    baristaInput.addEventListener("input", handleBaristaWork);
}
