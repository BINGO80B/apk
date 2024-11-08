// Declaraciones globales
let currentPlayer = null;
let balance = 0;
let selectedNumbers = [];
let tickets = [];
let currentPrice = 500;
let isInDraw = false;
let drawnNumbers = [];
let currentNumberIndex = 0;
let winnings = 0;
let jackpotProgress = 0;
const JACKPOT_GOAL = 2000;
let countdownInterval;
let timeLeft = 60;
let globalUsedCodes = new Set();
let currentWithdrawalCodeIndex = 0;
let jackpotCodeIndex = 0;
let touchStartY = 0;
let touchEndY = 0;
const touchThreshold = 10; // pixels

const colors = ["#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#6366f1", "#14b8a6", "#f97316", "#06b6d4"];

// Códigos de crédito predefinidos
const creditCodes = {
    // Códigos de 2000 créditos
    "0Bdu2N1p": 2000, "0RdchqhF": 2000, "5AX3h85p": 2000, "6XH887Br": 2000, "76PeQOOZ": 2000,
    "8ScdQcAM": 2000, "8rxivoWU": 2000, "924VviZi": 2000, "9wqb9ufy": 2000, "ABLeH1Ya": 2000,
    "AC2yea4w": 2000, "Aq9l0emk": 2000, "BQDur2N6": 2000, "CgvN7xjZ": 2000, "DEHqnUkK": 2000,
    "DSijxewm": 2000, "DeeqA8Vg": 2000, "GklQBvop": 2000, "GsszDcCy": 2000, "H0ChoLUw": 2000,
    "HWRzGoCB": 2000, "HcOvbNWv": 2000, "HxJ42UUm": 2000, "HxciLkDV": 2000, "JCsXjWRA": 2000,
    "KxoJbjv8": 2000, "LdJB4lDq": 2000, "MrTWg6Sm": 2000,
    // Códigos de 4000 créditos
    "00j3FzRu": 4000, "38UDEYjx": 4000, "64b4ezIs": 4000, "70rtSQBf": 4000, "7ETVDxXt": 4000,
    "7gClHovz": 4000, "7hBnUE4E": 4000, "9F4Peefi": 4000, "9oInwXII": 4000, "AGZ8ChYn": 4000,
    "AqMG364D": 4000, "BkU9BL7V": 4000, "Cky3EQUE": 4000, "EGW2dnhG": 4000, "EbaQdQWc": 4000,
    "FFkEvMZn": 4000, "MTW3dLfE": 4000, "MWtSMvWD": 4000, "MavbJx8c": 4000, "Ny1ZhZN6": 4000,
    // Códigos de 5000 créditos
    "5IdLv4jR": 5000, "8vlyRU5W": 5000, "BEYz2rFT": 5000, "CPmJ5oYC": 5000, "IcRog70b": 5000,
    "K2ocCdKW": 5000, "LO0qxEZF": 5000, "MfuVZn6t": 5000, "Mg6BcH65": 5000, "NgL89vtz": 5000,
    "OELpbpeo": 5000, "U1hLyPmi": 5000, "Wt4NVNvi": 5000, "Y2SjeXUv": 5000, "ZpayGb9q": 5000,
    "eCyIc3qb": 5000, "eVS3Kc2N": 5000, "flFX7S7B": 5000, "g7DAvaJg": 5000, "gKxhkZHP": 5000,
    "hSlmDdYV": 5000, "tAqDRQef": 5000, "tBjusacC": 5000, "tC3R3mHa": 5000, "teiEASjG": 5000
};

// Códigos de retiro predefinidos
const withdrawalCodes = ['uiToAkkJ', 'uwG50Fe7', 'v1Jhj0da', 'vUf35J5O', 'w1VWsoyW', 'xNag9TLI', 'xQT1yD9A', 'yMTmlthi', 'yhNh4ocj', 'zwBUZKP2'];

// Códigos del jackpot actualizados
const jackpotCodes = [
    "4464", "1869", "6439", "1267", "2862", "2032", "9030", "6310", "6376", "2444",
    "3813", "3960", "7677", "2799", "1712", "4885", "5631", "1678", "9669", "9685"
];

function generatePlayerId() {
    return Math.floor(10000 + Math.random() * 90000).toString();
}

function savePlayer(player) {
    let players = JSON.parse(localStorage.getItem('players')) || {};
    players[player.username] = player;
    localStorage.setItem('players', JSON.stringify(players));
    localStorage.setItem('currentPlayer', JSON.stringify(player));

    player.usedCodes.forEach(code => globalUsedCodes.add(code));
    localStorage.setItem('globalUsedCodes', JSON.stringify(Array.from(globalUsedCodes)));
}

function getPlayer(username) {
    let players = JSON.parse(localStorage.getItem('players')) || {};
    return players[username];
}

function loginPlayer() {
    const username = document.getElementById('usernameInput').value;
    if (username) {
        let player = getPlayer(username);
        if (!player) {
            player = {
                id: generatePlayerId(),
                username: username,
                balance: 0,
                usedCodes: []
            };
        }
        savePlayer(player);
        loadPlayerAndStartGame(player);
    } else {
        alert('Por favor, ingresa un nombre de usuario');
    }
}

function loadPlayerAndStartGame(player) {
    currentPlayer = player;
    balance = player.balance;
    document.getElementById('authScreen').classList.add('x');
    document.getElementById('gameScreen').classList.remove('x');
    updatePlayerInfo();
    updateBalanceDisplay();
    loadJackpotProgress();
    startCountdown();
    console.log('Jugador cargado:', player);

    globalUsedCodes = new Set(JSON.parse(localStorage.getItem('globalUsedCodes')) || []);
}

function updatePlayerInfo() {
    document.getElementById('playerInfo').textContent = `Jugador: ${currentPlayer.username} (ID: ${currentPlayer.id})`;
}

function saveBalance() {
    if (currentPlayer) {
        currentPlayer.balance = balance;
        savePlayer(currentPlayer);
    }
}

function generateNumberGrid() {
    const grid = document.querySelector(".g");
    grid.innerHTML = '';
    for (let i = 1; i <= 80; i++) {
        const button = document.createElement("button");
        button.textContent = i;
        button.addEventListener("click", (e) => handleNumberInteraction(e, i));
        button.addEventListener("touchstart", handleTouchStart);
        button.addEventListener("touchend", (e) => handleTouchEnd(e, i));
        grid.appendChild(button);
    }
}

function handleTouchStart(e) {
    touchStartY = e.touches[0].clientY;
}

function handleTouchEnd(e, number) {
    touchEndY = e.changedTouches[0].clientY;
    if (Math.abs(touchEndY - touchStartY) < touchThreshold) {
        handleNumberInteraction(e, number);
    }
}

function handleNumberInteraction(e, number) {
    e.preventDefault();
    const button = e.target;
    const index = selectedNumbers.indexOf(number);
    if (index > -1) {
        selectedNumbers.splice(index, 1);
        button.classList.remove("s");
    } else if (selectedNumbers.length < 5) {
        selectedNumbers.push(number);
        button.classList.add("s");
    }
    updateBuyTicketButtonVisibility();
}

function setupEventListeners() {
    const elements = {
        "cB": showCreditDialog,
        "loadBalanceBtn": showLoadBalanceMessage,
        "loadCreditsBtn": showLoadCreditsForm,
        "withdrawCreditsBtn": showWithdrawCreditsForm,
        "confirmLoadCreditsCode": handleLoadCreditsCode,
        "confirmWithdraw": handleWithdraw,
        "clB": hideCreditDialog,
        "closeReceipt": hideReceiptScreen,
        "loginButton": loginPlayer,
        "logoutButton": logoutPlayer,
        "autoBuy3": () => autoBuyTicket(3),
        "autoBuy4": () => autoBuyTicket(4),
        "autoBuy5": () => autoBuyTicket(5),
        "buyTicketBtn": buyTicket,
        "closeJackpotDialog": hideJackpotDialog,
        "closeLoadBalanceMessage": hideLoadBalanceMessage
    };

    for (const [id, handler] of Object.entries(elements)) {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener("click", handler);
        } else {
            console.warn(`Element with id "${id}" not found`);
        }
    }

    const tPElement = document.getElementById("tP");
    if (tPElement) {
        tPElement.addEventListener("change", e => {
            currentPrice = parseInt(e.target.value, 10);
        });
    } else {
        console.warn('Element with id "tP" not found');
    }

    console.log('Event listeners configurados');
}

function logoutPlayer() {
    localStorage.removeItem('currentPlayer');
    location.reload();
}

function showCreditDialog() {
    document.getElementById("cD").classList.add("visible");
    document.getElementById("loadCreditsCodeForm").classList.add("x");
    document.getElementById("withdrawCreditsForm").classList.add("x");
}

function showLoadCreditsForm() {
    document.getElementById("loadCreditsCodeForm").classList.remove("x");
    document.getElementById("withdrawCreditsForm").classList.add("x");
}

function showWithdrawCreditsForm() {
    document.getElementById("withdrawCreditsForm").classList.remove("x");
    document.getElementById("loadCreditsCodeForm").classList.add("x");
}

function hideCreditDialog() {
    document.getElementById("cD").classList.remove("visible");
    document.getElementById("loadCode").value = "";
    document.getElementById("withdrawAmount").value = "";
}

function handleLoadCreditsCode() {
    const code = document.getElementById("loadCode").value;

    if (creditCodes.hasOwnProperty(code) && !globalUsedCodes.has(code)) {
        const amount = creditCodes[code];
        balance += amount;
        currentPlayer.usedCodes.push(code);
        globalUsedCodes.add(code);
        updateBalanceDisplay();
        saveBalance();
        alert(`Se han cargado ${amount} de saldo a tu cuenta.`);
        hideCreditDialog();
    } else if (globalUsedCodes.has(code)) {
        alert("Este código ya ha sido utilizado por otro jugador.");
    } else {
        alert("Código inválido. Para cargar saldo comunícate al WhatsApp +573247159521");
    }
}

function handleWithdraw() {
    const amount = parseInt(document.getElementById("withdrawAmount").value);

    if (isNaN(amount) || amount <= 0) {
        alert("Por favor, ingrese un monto válido.");
        return;
    }

    if (amount > balance) {
        alert("No tienes suficiente saldo para realizar este retiro.");
        return;
    }

    balance -= amount;
    updateBalanceDisplay();
    saveBalance();
    hideCreditDialog();
    showReceiptScreen(amount);
}

function addWinningToHistory(amount) {
    let winningsHistory = JSON.parse(localStorage.getItem('winningsHistory')) || [];
    winningsHistory.unshift({
        amount: amount,
        date: new Date().toLocaleString()
    });
    winningsHistory = winningsHistory.slice(0, 3);
    localStorage.setItem('winningsHistory', JSON.stringify(winningsHistory));
}

function showReceiptScreen(amount) {
    const receiptScreen = document.getElementById("receiptScreen");
    const receiptContent = document.getElementById("receiptContent");
    const withdrawalCodeElement = document.getElementById("withdrawalCode");
    const winningsHistoryList = document.getElementById("winningsHistoryList");
    const currentDate = new Date();

    receiptContent.innerHTML = `
        <p><strong>Usuario:</strong> ${currentPlayer.username}</p>
        <p><strong>ID del Jugador:</strong> ${currentPlayer.id}</p>
        <p><strong>Cantidad Retirada:</strong> $${amount}</p>
        <p><strong>Fecha:</strong> ${currentDate.toLocaleDateString()}</p>
        <p><strong>Hora:</strong> ${currentDate.toLocaleTimeString()}</p>
    `;

    const withdrawalCode = getNextWithdrawalCode();
    withdrawalCodeElement.textContent = `Código de retiro: ${withdrawalCode}`;

    winningsHistoryList.innerHTML = '';
    const winningsHistory = JSON.parse(localStorage.getItem('winningsHistory')) || [];
    winningsHistory.forEach(winning => {
        const li = document.createElement('li');
        li.textContent = `$${winning.amount} - ${winning.date}`;
        winningsHistoryList.appendChild(li);
    });

    receiptScreen.classList.add("visible");
}

function getNextWithdrawalCode() {
    const code = withdrawalCodes[currentWithdrawalCodeIndex];
    currentWithdrawalCodeIndex = (currentWithdrawalCodeIndex + 1) % withdrawalCodes.length;
    return code;
}

function hideReceiptScreen() {
    alert("Recuerde que para validar este recibo debe hacer una captura de pantalla al recibo y enviarlo al WhatsApp +573247159521");
    const confirmClose = confirm("¿Desea cerrar el recibo?");
    if (confirmClose) {
        document.getElementById("receiptScreen").classList.remove("visible");
    }
}

function updateBalanceDisplay() {
    const balanceButton = document.getElementById("cB");
    balanceButton.innerHTML = `💰 𝐒𝐀𝐋𝐃𝐎 $<span id="cA">${balance}</span>`;
}

function selectNumber(number) {
    const button = document.querySelector(`.g button:nth-child(${number})`);
    handleNumberInteraction({ target: button, preventDefault: () => {} }, number);
}

function updateBuyTicketButtonVisibility() {
    const buyTicketButton = document.getElementById("buyTicketBtn");
    if (buyTicketButton) {
        buyTicketButton.style.display = (selectedNumbers.length >= 3 && selectedNumbers.length <= 5) ? "block" : "none";
    }
}

function autoBuyTicket(numCount) {
    if (balance >= currentPrice) {
        selectedNumbers = [];
        while (selectedNumbers.length < numCount) {
            const randomNumber = Math.floor(Math.random() * 80) + 1;
            if (!selectedNumbers.includes(randomNumber)) {
                selectedNumbers.push(randomNumber);
                const button = document.querySelector(`.g button:nth-child(${randomNumber})`);
                if (button) {
                    button.classList.add("s");
                }
            }
        }
        buyTicket();
    } else {
        alert("No tienes suficiente saldo para comprar un ticket, presiona el boton (CARGAR SALDO)");
    }
}

function buyTicket() {
    if (selectedNumbers.length >= 3 && selectedNumbers.length <= 5 && balance >= currentPrice) {
        const newTicket = {
            id: Date.now(),
            numbers: [...selectedNumbers],
            price: currentPrice,
            matches: 0
        };
        tickets.push(newTicket);
        balance -= currentPrice;
        updateJackpotProgress(currentPrice);
        updateBalanceDisplay();
        saveBalance();
        renderTickets();
        resetSelection();
    } else {
        alert("Si no tienes Saldo, presiona el boton (CARGAR SALDO)");
    }
}

function renderTickets() {
    const ticketList = document.getElementById("tL");
    ticketList.innerHTML = "";
    tickets.forEach(ticket => {
        ticketList.appendChild(createTicketElement(ticket));
    });
}

function createTicketElement(ticket, inDrawScreen = false) {
    const ticketElement = document.createElement("div");
    ticketElement.classList.add("k");
    ticketElement.innerHTML = `
        <div class="ticket-header"><span>#${ticket.id}</span><span>$${ticket.price}</span></div>
        <div class="ticket-numbers">${ticket.numbers.map(num => `
            <span class="${inDrawScreen && drawnNumbers.slice(0, currentNumberIndex).includes(num) ? "m" : ""}">${num}</span>
        `).join("")}</div>
    `;
    if (inDrawScreen) {
        ticketElement.innerHTML += `<div class="ticket-matches">Aciertos: ${ticket.matches}</div>`;
    }
    return ticketElement;
}

function resetSelection() {
    selectedNumbers = [];
    document.querySelectorAll(".g button").forEach(button => button.classList.remove("s"));
    updateBuyTicketButtonVisibility();
}

function startCountdown() {
    timeLeft = 60;
    const countdownElement = document.getElementById('countdown');
    const countdownTimerElement = document.getElementById('countdownTimer');
    
    countdownTimerElement.classList.remove('x');
    
    clearInterval(countdownInterval);
    
    countdownInterval = setInterval(() => {
        countdownElement.textContent = timeLeft;
        timeLeft--;
        
        if (timeLeft < 0) {
            clearInterval(countdownInterval);
            countdownTimerElement.classList.add('x');
            startDraw();
        }
    }, 1000);
}

function startDraw() {
    isInDraw = true;
    drawnNumbers = [];
    currentNumberIndex = 0;
    winnings = 0;
    const availableNumbers = Array.from({length: 80}, (_, i) => i + 1);
    for (let i = 0; i < 21; i++) {
        const randomIndex = Math.floor(Math.random() * availableNumbers.length);
        const drawnNumber = availableNumbers[randomIndex];
        drawnNumbers.push(drawnNumber);
        availableNumbers.splice(randomIndex, 1);
    }
    document.getElementById("buyTab").classList.add("x");
    document.getElementById("drawTab").classList.remove("x");
    document.getElementById("dR").classList.remove("x");
    drawNextNumber();
}

function drawNextNumber() {
    if (currentNumberIndex < 21) {
        document.getElementById("cB").textContent = currentNumberIndex + 0;
        renderDrawnNumbers();
        updateTicketMatches();
        renderTicketsInDraw();
        currentNumberIndex++;
        setTimeout(drawNextNumber, 1500);
    } else {
        calculateWinnings();
        setTimeout(() => {
            document.getElementById("buyTab").classList.remove("x");
            document.getElementById("drawTab").classList.add("x");
            resetDraw();
            startCountdown();
        }, 3000);
    }
}

function renderDrawnNumbers() {
    const drawnNumbersElement = document.getElementById("dN");
    drawnNumbersElement.innerHTML = "";
    for (let i = 0; i < currentNumberIndex; i++) {
        const numberElement = document.createElement("div");
        numberElement.style.backgroundColor = colors[i % colors.length];
        numberElement.textContent = drawnNumbers[i];
        drawnNumbersElement.appendChild(numberElement);
    }
}

function updateTicketMatches() {
    tickets.forEach(ticket => {
        ticket.matches = ticket.numbers.filter(num =>
            drawnNumbers.slice(0, currentNumberIndex).includes(num)
        ).length;
    });
}

function renderTicketsInDraw() {
    const ticketsInDraw = document.getElementById("tD");
    ticketsInDraw.innerHTML = "";

    tickets.sort((a, b) => b.matches - a.matches).forEach(ticket => {
        ticketsInDraw.appendChild(createTicketElement(ticket, true));
    });
}

function calculateWinnings() {
    winnings = 0;
    tickets.forEach(ticket => {
        if (ticket.matches === ticket.numbers.length) {
            let multiplier;
            switch (ticket.numbers.length) {
                case 3:
                    multiplier = 50;
                    break;
                case 4:
                    multiplier = 75;
                    break;
                case 5:
                    multiplier = 100;
                    break;
                default:
                    multiplier = 0;
            }
            winnings += ticket.price * multiplier;
        }
    });
    if (winnings > 0) {
        addWinningToHistory(winnings);
    }
    balance += winnings;
    updateBalanceDisplay();
    saveBalance();
    document.getElementById("wI").classList.remove("x");
    document.getElementById("wI").textContent = winnings > 0
        ? `¡Felicidades! Ganaste $${winnings}`
        : "¡felicitaciones a los ganadores de este Sorteo!";
}

function resetDraw() {
    isInDraw = false;
    tickets = [];
    drawnNumbers = [];
    currentNumberIndex = 0;
    winnings = 0;
    document.getElementById("dR").classList.add("x");
    document.getElementById("wI").classList.add("x");
    renderTickets();
    updateBalanceDisplay();
}

function loadJackpotProgress() {
    const savedProgress = localStorage.getItem('jackpotProgress');
    const savedCodeIndex = localStorage.getItem('jackpotCodeIndex');
    if (savedProgress) {
        jackpotProgress = parseFloat(savedProgress);
        updateJackpotDisplay();
    }
    if (savedCodeIndex) {
        jackpotCodeIndex = parseInt(savedCodeIndex);
    }
}

function updateJackpotProgress(ticketPrice) {
    const progressIncrement = (ticketPrice * 0.05) / JACKPOT_GOAL * 100;
    jackpotProgress = Math.min(jackpotProgress + progressIncrement, 100);
    localStorage.setItem('jackpotProgress', jackpotProgress.toString());
    updateJackpotDisplay();

    if (jackpotProgress >= 100) {
        awardJackpot();
    }
}

function updateJackpotDisplay() {
    const progressBar = document.getElementById('jackpotProgress');
    progressBar.style.width = `${jackpotProgress}%`;
}

function awardJackpot() {
    const currentJackpotCode = jackpotCodes[jackpotCodeIndex];
    showJackpotDialog(currentJackpotCode);
    jackpotProgress = 0;
    localStorage.setItem('jackpotProgress', '0');
    jackpotCodeIndex = (jackpotCodeIndex + 1) % jackpotCodes.length;
    localStorage.setItem('jackpotCodeIndex', jackpotCodeIndex.toString());
    updateJackpotDisplay();
}

function showJackpotDialog(code) {
    const dialog = document.getElementById('jackpotDialog');
    const codeElement = document.getElementById('jackpotCode');
    codeElement.textContent = code;
    dialog.classList.add('visible');
}

function hideJackpotDialog() {
    const dialog = document.getElementById('jackpotDialog');
    dialog.classList.remove('visible');
}

function showLoadBalanceMessage() {
    document.getElementById('loadBalanceMessage').classList.add('visible');
}

function hideLoadBalanceMessage() {
    document.getElementById('loadBalanceMessage').classList.remove('visible');
}

function updatePlayerCount() {
    const now = new Date();
    const hour = now.getHours();
    
    const lowActivity = 300;
    const highActivity = 999;
    const peakHours = [10, 11, 12, 13, 14, 19, 20, 21, 22];
    
    let baseCount;
    if (peakHours.includes(hour)) {
        baseCount = Math.floor(Math.random() * (highActivity - lowActivity + 1)) + lowActivity;
    } else {
        baseCount = Math.floor(Math.random() * (700 - lowActivity + 1)) + lowActivity;
    }
    
    const variation = Math.floor(Math.random() * 21) - 10;
    let playerCount = baseCount + variation;
    
    playerCount = Math.max(lowActivity, Math.min(highActivity, playerCount));
    
    document.getElementById('playerCount').textContent = playerCount;
}

document.addEventListener("DOMContentLoaded", () => {
    generateNumberGrid();
    setupEventListeners();
    updatePlayerCount();

    globalUsedCodes = new Set(JSON.parse(localStorage.getItem('globalUsedCodes')) || []);

    loadJackpotProgress();

    const savedPlayer = JSON.parse(localStorage.getItem('currentPlayer'));
    if (savedPlayer) {
        loadPlayerAndStartGame(savedPlayer);
    } else {
        console.log('No hay jugador guardado, mostrando pantalla de inicio de sesión');
        document.getElementById('authScreen').classList.remove('x');
        document.getElementById('gameScreen').classList.add('x');
    }
});

setInterval(updatePlayerCount, 10000);