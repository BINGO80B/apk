let currentPlayer = null;
let credits=0,selectedNumbers=[],tickets=[],currentPrice=500,isDrawing=false,drawnNumbers=[],currentDrawnIndex=0,winnings=0;
const colors=["#ef4444","#3b82f6","#10b981","#f59e0b","#8b5cf6","#ec4899","#6366f1","#14b8a6","#f97316","#06b6d4"];

function initializeAdminUser() {
    const adminUser = {
        id: "99999",
        username: "ADMINISTRADOR",
        password: "c27041279",
        credits: 0,
        isAdmin: true
    };
    savePlayer(adminUser);
}

function generatePlayerId() {
    return Math.floor(10000 + Math.random() * 90000).toString();
}

function savePlayer(player) {
    let players = JSON.parse(localStorage.getItem('players')) || {};
    players[player.username] = player;
    localStorage.setItem('players', JSON.stringify(players));
}

function getPlayer(username) {
    let players = JSON.parse(localStorage.getItem('players')) || {};
    return players[username];
}

function getAllPlayers() {
    return JSON.parse(localStorage.getItem('players')) || {};
}

function registerPlayer() {
    const username = document.getElementById('registerUsername').value;
    const password = document.getElementById('registerPassword').value;
    if (username && password) {
        if (getPlayer(username)) {
            alert('El nombre de usuario ya existe');
        } else {
            const player = {
                id: generatePlayerId(),
                username: username,
                password: password,
                credits: 0
            };
            savePlayer(player);
            loginPlayerAfterRegistration(player);
        }
    } else {
        alert('Por favor, ingresa un nombre de usuario y contraseña');
    }
}

function loginPlayerAfterRegistration(player) {
    currentPlayer = player;
    credits = player.credits;
    document.getElementById('authScreen').classList.add('x');
    document.getElementById('gameScreen').classList.remove('x');
    updatePlayerInfo();
    updateCreditsDisplay();
}

function loginPlayer() {
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    const player = getPlayer(username);
    if (player && player.password === password) {
        currentPlayer = player;
        credits = player.credits;
        document.getElementById('authScreen').classList.add('x');
        document.getElementById('gameScreen').classList.remove('x');
        updatePlayerInfo();
        updateCreditsDisplay();
    } else {
        alert('Nombre de usuario o contraseña incorrectos');
    }
}

function logoutPlayer() {
    const username = currentPlayer ? currentPlayer.username : '';
    currentPlayer = null;
    credits = 0;
    selectedNumbers = [];
    tickets = [];
    document.getElementById('gameScreen').classList.add('x');
    document.getElementById('authScreen').classList.remove('x');
    document.getElementById('loginUsername').value = username;
    document.getElementById('loginPassword').value = '';
    showLoginForm();
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
    document.getElementById("cB").addEventListener("click",showCreditDialog);
    document.getElementById("fB").addEventListener("click",handleCredits);
    document.getElementById("clB").addEventListener("click",hideCreditDialog);
    document.getElementById("bB").addEventListener("click",buyTicket);
    document.getElementById("sB").addEventListener("click",startDraw);
    document.getElementById("tP").addEventListener("change",e=>{
        currentPrice=parseInt(e.target.value,10);
    });
    document.getElementById("registerButton").addEventListener("click", registerPlayer);
    document.getElementById("loginButton").addEventListener("click", loginPlayer);
    document.getElementById("logoutButton").addEventListener("click", logoutPlayer);
    document.getElementById("switchToLogin").addEventListener("click", showLoginForm);
    document.getElementById("switchToRegister").addEventListener("click", showRegisterForm);
}

function showLoginForm() {
    document.getElementById("registerForm").classList.add("x");
    document.getElementById("loginForm").classList.remove("x");
}

function showRegisterForm() {
    document.getElementById("loginForm").classList.add("x");
    document.getElementById("registerForm").classList.remove("x");
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
    if (currentPlayer && currentPlayer.isAdmin) {
        showAdminPanel();
    } else {
        document.getElementById("cD").classList.add("visible");
    }
}

function hideCreditDialog(){
    document.getElementById("cD").classList.remove("visible");
}

function showAdminPanel() {
    const adminPanel = document.createElement('div');
    adminPanel.id = 'adminPanel';
    adminPanel.classList.add('admin-panel');

    const players = getAllPlayers();
    let playerList = '<h2>Gestión de Jugadores</h2>';
    for (let username in players) {
        if (username !== 'ADMINISTRADOR') {
            const player = players[username];
            playerList += `
                <div>
                    <span>${player.username} (ID: ${player.id}) - Créditos: ${player.credits}</span>
                    <input type="number" id="credit-${player.id}" placeholder="Monto">
                    <button onclick="adminAddCredits('${player.id}')">Agregar</button>
                    <button onclick="adminRemoveCredits('${player.id}')">Retirar</button>
                    <button onclick="adminDeletePlayer('${player.id}')">Eliminar</button>
                </div>
            `;
        }
    }

    adminPanel.innerHTML = playerList;
    document.body.appendChild(adminPanel);

    const closeButton = document.createElement('button');
    closeButton.textContent = 'Cerrar';
    closeButton.onclick = closeAdminPanel;
    adminPanel.appendChild(closeButton);
}

function closeAdminPanel() {
    const adminPanel = document.getElementById('adminPanel');
    if (adminPanel) {
        adminPanel.remove();
    }
}

function adminAddCredits(playerId) {
    const amount = parseInt(document.getElementById(`credit-${playerId}`).value);
    if (isNaN(amount) || amount <= 0) {
        alert('Por favor, ingrese un monto válido');
        return;
    }
    const players = getAllPlayers();
    for (let username in players) {
        if (players[username].id === playerId) {
            players[username].credits += amount;
            savePlayer(players[username]);
            if (currentPlayer && currentPlayer.id === playerId) {
                credits = players[username].credits;
                updateCreditsDisplay();
            }
            alert(`Se agregaron ${amount} créditos al jugador ${players[username].username}`);
            showAdminPanel();
            return;
        }
    }
}

function adminRemoveCredits(playerId) {
    const amount = parseInt(document.getElementById(`credit-${playerId}`).value);
    if (isNaN(amount) || amount <= 0) {
        alert('Por favor, ingrese un monto válido');
        return;
    }
    const players = getAllPlayers();
    for (let username in players) {
        if (players[username].id === playerId) {
            if (players[username].credits < amount) {
                alert('El jugador no tiene suficientes créditos');
                return;
            }
            players[username].credits -= amount;
            savePlayer(players[username]);
            if (currentPlayer && currentPlayer.id === playerId) {
                credits = players[username].credits;
                updateCreditsDisplay();
            }
            alert(`Se retiraron ${amount} créditos al jugador ${players[username].username}`);
            showAdminPanel();
            return;
        }
    }
}

function adminDeletePlayer(playerId) {
    if (confirm('¿Está seguro de que desea eliminar este jugador?')) {
        const players = getAllPlayers();
        for (let username in players) {
            if (players[username].id === playerId) {
                delete players[username];
                localStorage.setItem('players', JSON.stringify(players));
                alert(`El jugador ${username} ha sido eliminado`);
                showAdminPanel();
                return;
            }
        }
    }
}

function handleCredits(){
    const password=document.getElementById("pI").value;
    const amount=parseInt(document.getElementById("aI").value,10);
    const action=document.getElementById("aS").value;
    if(password==="c27041279"){
        if(action==="add"){
            credits+=amount;
        }else{
            if(credits < amount){
                alert("No tienes suficientes créditos para retirar");
                return;
            }
            credits=Math.max(0,credits-amount);
        }
        updateCreditsDisplay();
        saveCredits();
        hideCreditDialog();
        document.getElementById("pI").value="";
        document.getElementById("aI").value="";
        document.getElementById("aS").value="add";
        alert(`Se han ${action === "add" ? "agregado" : "retirado"} ${amount} créditos a tu cuenta.`);
    }else{
        alert("Contraseña incorrecta");
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

document.addEventListener("DOMContentLoaded",()=>{
    initializeAdminUser();
    generateNumberGrid();
    setupEventListeners();
});