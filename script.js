let currentPlayer = null;
let credits=0,selectedNumbers=[],tickets=[],currentPrice=500,isDrawing=false,drawnNumbers=[],currentDrawnIndex=0,winnings=0;
const colors=["#ef4444","#3b82f6","#10b981","#f59e0b","#8b5cf6","#ec4899","#6366f1","#14b8a6","#f97316","#06b6d4"];

const creditCodes = {
    "bingo33191": 2000,
    "bingo26500": 2000,
    "bingo15685": 2000,
    "bingo00003": 2000,
    "bingo00004": 2000,
    "bingo00005": 2000,
    "bingo00006": 2000,
    "bingo00007": 2000,
    "bingo00008": 2000,
    "bingo00009": 2000,
    "bingo00010": 2000,
    "bingo00011": 2000,
    "bingo00012": 2000,
    "bingo00013": 2000,
    "bingo00014": 2000,
    "bingo00015": 2000,
    "bingo00016": 2000,
    "bingo00017": 2000,
    "bingo00018": 2000,
    "bingo00019": 2000
};

function generatePlayerId() {
    return Math.floor(10000 + Math.random() * 90000).toString();
}

function savePlayer(player) {
    let players = JSON.parse(localStorage.getItem('players')) || {};
    players[player.username] = player;
    localStorage.setItem('players', JSON.stringify(players));
    localStorage.setItem('currentPlayer', JSON.stringify(player));
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
                credits: 0,
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
    credits = player.credits;
    document.getElementById('authScreen').classList.add('x');
    document.getElementById('gameScreen').classList.remove('x');
    updatePlayerInfo();
    updateCreditsDisplay();
    console.log('Jugador cargado:', player);
}

function updatePlayerInfo() {
    document.getElementById('playerInfo').textContent = `Jugador: ${currentPlayer.username} (ID: ${currentPlayer.id})`;
}

function loadCredits(){
    if (currentPlayer) {
        credits = currentPlayer.credits;
        updateCreditsDisplay();
    }
}

function saveCredits(){
    if (currentPlayer) {
        currentPlayer.credits = credits;
        savePlayer(currentPlayer);
    }
}

function generateNumberGrid(){
    const grid=document.querySelector(".g");
    for(let i=1;i<=80;i++){
        const button=document.createElement("button");
        button.textContent=i;
        button.addEventListener("click",()=>selectNumber(i));
        grid.appendChild(button);
    }
}

function setupEventListeners(){
    document.querySelectorAll(".b").forEach(button=>{
        button.addEventListener("click",()=>changeTab(button.dataset.tab));
    });
    document.getElementById("cB").addEventListener("click", showCreditDialog);
    document.getElementById("loadCreditsBtn").addEventListener("click", showLoadCreditsForm);
    document.getElementById("loadCreditsCodeBtn").addEventListener("click", showLoadCreditsCodeForm);
    document.getElementById("withdrawCreditsBtn").addEventListener("click", showWithdrawCreditsForm);
    document.getElementById("confirmLoadCredits").addEventListener("click", handleLoadCredits);
    document.getElementById("confirmLoadCreditsCode").addEventListener("click", handleLoadCreditsCode);
    document.getElementById("confirmWithdraw").addEventListener("click", handleWithdraw);
    document.getElementById("clB").addEventListener("click", hideCreditDialog);
    document.getElementById("closeReceipt").addEventListener("click", hideReceiptScreen);
    document.getElementById("bB").addEventListener("click", buyTicket);
    document.getElementById("sB").addEventListener("click", startDraw);
    document.getElementById("tP").addEventListener("change",e=>{
        currentPrice=parseInt(e.target.value,10);
    });
    document.getElementById("loginButton").addEventListener("click", loginPlayer);
    document.getElementById("logoutButton").addEventListener("click", logoutPlayer);
    console.log('Event listeners configurados');
}

function logoutPlayer() {
    localStorage.removeItem('currentPlayer');
    location.reload();
}

function changeTab(tabName){
    document.querySelectorAll(".b").forEach(btn=>btn.classList.remove("a"));
    document.querySelectorAll(".n").forEach(content=>content.classList.add("x"));
    document.querySelector(`.b[data-tab="${tabName}"]`).classList.add("a");
    document.getElementById(`${tabName}Tab`).classList.remove("x");
    if(tabName==="buy"&&isDrawing) resetDraw();
    updateCreditsDisplay();
}

function showCreditDialog(){
    document.getElementById("cD").classList.add("visible");
    document.getElementById("loadCreditsForm").classList.add("x");
    document.getElementById("loadCreditsCodeForm").classList.add("x");
    document.getElementById("withdrawCreditsForm").classList.add("x");
}

function showLoadCreditsForm() {
    document.getElementById("loadCreditsForm").classList.remove("x");
    document.getElementById("loadCreditsCodeForm").classList.add("x");
    document.getElementById("withdrawCreditsForm").classList.add("x");
}

function showLoadCreditsCodeForm() {
    document.getElementById("loadCreditsCodeForm").classList.remove("x");
    document.getElementById("loadCreditsForm").classList.add("x");
    document.getElementById("withdrawCreditsForm").classList.add("x");
}

function showWithdrawCreditsForm() {
    document.getElementById("withdrawCreditsForm").classList.remove("x");
    document.getElementById("loadCreditsForm").classList.add("x");
    document.getElementById("loadCreditsCodeForm").classList.add("x");
}

function hideCreditDialog(){
    document.getElementById("cD").classList.remove("visible");
    // Limpiar los campos del formulario de carga de créditos
    document.getElementById("loadPassword").value = "";
    document.getElementById("loadAmount").value = "";
    document.getElementById("loadCode").value = "";
    // Limpiar el campo del formulario de retiro
    document.getElementById("withdrawAmount").value = "";
}

function handleLoadCredits() {
    const password = document.getElementById("loadPassword").value;
    const amount = parseInt(document.getElementById("loadAmount").value);

    if (password === "c27041279") {
        if (!isNaN(amount) && amount > 0) {
            credits += amount;
            updateCreditsDisplay();
            saveCredits();
            alert(`Se han cargado ${amount} créditos a tu cuenta.`);
            hideCreditDialog();
        } else {
            alert("Por favor, ingrese un monto válido.");
        }
    } else {
        alert("Contraseña incorrecta.");
    }
}

function handleLoadCreditsCode() {
    const code = document.getElementById("loadCode").value;

    if (validateCode(code)) {
        if (creditCodes.hasOwnProperty(code) && !currentPlayer.usedCodes.includes(code)) {
            const amount = creditCodes[code];
            credits += amount;
            currentPlayer.usedCodes.push(code);
            updateCreditsDisplay();
            saveCredits();
            alert(`Se han cargado ${amount} créditos a tu cuenta.`);
            hideCreditDialog();
        } else {
            alert("Código inválido o ya utilizado.");
        }
    } else {
        alert("Formato de código inválido o no coincide con tu ID de jugador.");
    }
}

function validateCode(code) {
    // Verificar que el código tenga el formato correcto (5 letras seguidas de 5 números)
    const codeRegex = /^[a-zA-Z]{5}\d{5}$/;
    if (!codeRegex.test(code)) {
        return false;
    }

    // Verificar que los últimos 5 dígitos del código coincidan con los últimos 5 dígitos del ID del jugador
    const codeNumbers = code.slice(-5);
    const playerIdNumbers = currentPlayer.id.slice(-5);

    return codeNumbers === playerIdNumbers;
}

function handleWithdraw() {
    const amount = parseInt(document.getElementById("withdrawAmount").value);
    
    if (isNaN(amount) || amount <= 0) {
        alert("Por favor, ingrese un monto válido.");
        return;
    }
    
    if (amount > credits) {
        alert("No tienes suficientes créditos para realizar este retiro.");
        return;
    }
    
    credits -= amount;
    updateCreditsDisplay();
    saveCredits();
    hideCreditDialog();
    showReceiptScreen(amount);
}

function showReceiptScreen(amount) {
    const receiptScreen = document.getElementById("receiptScreen");
    const receiptContent = document.getElementById("receiptContent");
    const currentDate = new Date();
    
    receiptContent.innerHTML = `
        <p><strong>Usuario:</strong> ${currentPlayer.username}</p>
        <p><strong>ID del Jugador:</strong> ${currentPlayer.id}</p>
        <p><strong>Cantidad Retirada:</strong> $${amount}</p>
        <p><strong>Fecha:</strong> ${currentDate.toLocaleDateString()}</p>
        <p><strong>Hora:</strong> ${currentDate.toLocaleTimeString()}</p>
    `;
    
    receiptScreen.classList.add("visible");
}

function hideReceiptScreen() {
    alert("Recuerde que para validar este recibo debe hacer una captura de pantalla al recibo y enviarlo al WhatsApp +573247159521");
    const confirmClose = confirm("¿Desea cerrar el recibo?");
    if (confirmClose) {
        document.getElementById("receiptScreen").classList.remove("visible");
    }
}

function updateCreditsDisplay(){
    const creditButton = document.getElementById("cB");
    creditButton.innerHTML = `💳 Créditos: $<span id="cA">${credits}</span>`;
}

function selectNumber(number){
    const index=selectedNumbers.indexOf(number);
    const button=document.querySelector(`.g button:nth-child(${number})`);
    if(index>-1){
        selectedNumbers.splice(index,1);
        button.classList.remove("s");
    }else if(selectedNumbers.length<3){
        selectedNumbers.push(number);
        button.classList.add("s");
    }
    document.getElementById("bB").disabled=selectedNumbers.length!==3||credits<currentPrice;
}

function buyTicket(){
    if(selectedNumbers.length===3&&credits>=currentPrice){
        const newTicket={
            id:Date.now(),
            numbers:[...selectedNumbers],
            price:currentPrice,
            matches:0
        };
        tickets.push(newTicket);
        credits-=currentPrice;
        updateCreditsDisplay();
        saveCredits();
        renderTickets();
        resetSelection();
    }
}

function renderTickets(){
    const ticketsList=document.getElementById("tL");
    ticketsList.innerHTML="";
    tickets.forEach(ticket=>{
        ticketsList.appendChild(createTicketElement(ticket));
    });
}

function createTicketElement(ticket,inDrawScreen=false){
    const ticketElement=document.createElement("div");
    ticketElement.classList.add("k");
    ticketElement.innerHTML=`
        <div class="ticket-header"><span>#${ticket.id}</span><span>$${ticket.price}</span></div>
        <div class="ticket-numbers">${ticket.numbers.map(num=>`
            <span class="${inDrawScreen&&drawnNumbers.slice(0,currentDrawnIndex).includes(num)?"m":""}">${num}</span>
        `).join("")}</div>
    `;
    if(inDrawScreen){
        ticketElement.innerHTML+=`<div class="ticket-matches">Aciertos: ${ticket.matches}</div>`;
    }
    return ticketElement;
}

function resetSelection(){
    selectedNumbers=[];
    document.querySelectorAll(".g button").forEach(button=>button.classList.remove("s"));
    document.getElementById("bB").disabled=true;
}

function startDraw(){
    if(tickets.length){
        isDrawing=true;
        drawnNumbers=[];
        currentDrawnIndex=0;
        winnings=0;
        const availableNumbers=Array.from({length:80},(_,i)=>i+1);
        for(let i=0;i<21;i++){
            const randomIndex=Math.floor(Math.random()*availableNumbers.length);
            const drawnNumber=availableNumbers[randomIndex];
            drawnNumbers.push(drawnNumber);
            availableNumbers.splice(randomIndex,1);
        }
        document.getElementById("sB").classList.add("x");
        document.getElementById("dR").classList.remove("x");
        drawNextNumber();
    }
}

function drawNextNumber(){
    if(currentDrawnIndex<21){
        document.getElementById("cB").textContent=currentDrawnIndex+1;
        renderDrawnNumbers();
        updateTicketMatches();
        renderTicketsInDraw();
        currentDrawnIndex++;
        setTimeout(drawNextNumber,1000);
    }else{
        calculateWinnings();
    }
}

function renderDrawnNumbers(){
    const drawnNumbersElement=document.getElementById("dN");
    drawnNumbersElement.innerHTML="";
    for(let i=0;i<currentDrawnIndex;i++){
        const numberElement=document.createElement("div");
        numberElement.style.backgroundColor=colors[i%colors.length];
        numberElement.textContent=drawnNumbers[i];
        drawnNumbersElement.appendChild(numberElement);
    }
}

function updateTicketMatches(){
    tickets.forEach(ticket=>{
        ticket.matches=ticket.numbers.filter(num=>
            drawnNumbers.slice(0,currentDrawnIndex).includes(num)
        ).length;
    });
}

function renderTicketsInDraw(){
    const ticketsInDraw=document.getElementById("tD");
    ticketsInDraw.innerHTML="";
    
    tickets.sort((a,b)=>b.matches-a.matches).forEach(ticket=>{
        ticketsInDraw.appendChild(createTicketElement(ticket,true));
    });
}

function calculateWinnings(){
    tickets.forEach(ticket=>{
        if(ticket.matches===3){
            winnings+=ticket.price*50;
        }
    });
    credits+=winnings;
    updateCreditsDisplay();
    saveCredits();
    document.getElementById("wI").classList.remove("x");
    document.getElementById("wI").textContent=winnings>0
        ?`¡Felicidades! Ganaste  $${winnings}`
        :"No hubo ganadores esta vez";
}

function resetDraw(){
    isDrawing=false;
    tickets=[];
    drawnNumbers=[];
    currentDrawnIndex=0;
    winnings=0;
    document.getElementById("sB").classList.remove("x");
    document.getElementById("dR").classList.add("x");
    document.getElementById("wI").classList.add("x");
    renderTickets();
    updateCreditsDisplay();
}

document.addEventListener("DOMContentLoaded", () => {
    generateNumberGrid();
    setupEventListeners();
    
    const savedPlayer = JSON.parse(localStorage.getItem('currentPlayer'));
    if (savedPlayer) {
        loadPlayerAndStartGame(savedPlayer);
    } else {
        console.log('No hay jugador guardado, mostrando pantalla de inicio de sesión');
        document.getElementById('authScreen').classList.remove('x');
        document.getElementById('gameScreen').classList.add('x');
    }
});