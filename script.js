let currentPlayer = null;
let credits=0,selectedNumbers=[],tickets=[],currentPrice=500,isDrawing=false,drawnNumbers=[],currentDrawnIndex=0,winnings=0;
const colors=["#ef4444","#3b82f6","#10b981","#f59e0b","#8b5cf6","#ec4899","#6366f1","#14b8a6","#f97316","#06b6d4"];

const creditCodes = {
    "0Bdu2N1p": 2000, "0RdchqhF": 2000, "5AX3h85p": 2000, "6XH887Br": 2000, "76PeQOOZ": 2000,
    "8ScdQcAM": 2000, "8rxivoWU": 2000, "924VviZi": 2000, "9wqb9ufy": 2000, "ABLeH1Ya": 2000,
    "AC2yea4w": 2000, "Aq9l0emk": 2000, "BQDur2N6": 2000, "CgvN7xjZ": 2000, "DEHqnUkK": 2000,
    "DSijxewm": 2000, "DeeqA8Vg": 2000, "GklQBvop": 2000, "GsszDcCy": 2000, "H0ChoLUw": 2000,
    "HWRzGoCB": 2000, "HcOvbNWv": 2000, "HxJ42UUm": 2000, "HxciLkDV": 2000, "JCsXjWRA": 2000,
    "KxoJbjv8": 2000, "LdJB4lDq": 2000, "MrTWg6Sm": 2000, "NN5Eng2t": 2000, "NdDRFyJS": 2000,
    "NrCQlEbg": 2000, "O3IQIGPU": 2000, "O3Y48At6": 2000, "OE4XfKEP": 2000, "PniZ4RRB": 2000,
    "QEvc3xAe": 2000, "QtjV7UYB": 2000, "RaJnCEfM": 2000, "RpyfgsCk": 2000, "S9cu0y33": 2000,
    "SBsoxoLU": 2000, "SgbZ94jf": 2000, "SpOnIKDR": 2000, "TCklClbf": 2000, "TidyBAsq": 2000,
    "Tj2xLY6P": 2000, "TlCZdHFb": 2000, "UDFdRlmj": 2000, "Us8U9f0n": 2000, "X4Bz70oj": 2000,
    "XiVUEWs2": 2000, "Ym1INVJQ": 2000, "Yo7nyKW4": 2000, "YoQS7G84": 2000, "Z9nJW5kE": 2000,
    "ZYY8gKTK": 2000, "ZiQQlpS8": 2000, "a5jybDLS": 2000, "aHySiuOM": 2000, "cV0Q2tBN": 2000,
    "cVyq7IEF": 2000, "dswVdtAV": 2000, "ejz8eTAe": 2000, "fM1JV8sc": 2000, "g2XOKkYI": 2000,
    "gT4hZvfG": 2000, "ggO9phng": 2000, "gkGXZejy": 2000, "gkwsvVPF": 2000, "hCiBXOkM": 2000,
    "hFCHyzee": 2000, "iWVfSWeK": 2000, "j2wLm20W": 2000, "k5CaK9Ij": 2000, "kYp05Rto": 2000,
    "l9AHdP2u": 2000, "lS5efeLi": 2000, "lnjmmfoA": 2000, "m7IdbTtm": 2000, "mgRe9Oxx": 2000,
    "mkz7k5FI": 2000, "nFX1Kjbb": 2000, "p1JaNqds": 2000, "rof7ehX5": 2000, "s8fFwui8": 2000,
    "slZRJeaL": 2000, "soVfTxlQ": 2000, "tnn4DOkt": 2000, "u6ZF81SU": 2000, "u8Vbx896": 2000,
    "uiToAkkJ": 2000, "uwG50Fe7": 2000, "v1Jhj0da": 2000, "vUf35J5O": 2000, "w1VWsoyW": 2000,
    "xNag9TLI": 2000, "xQT1yD9A": 2000, "yMTmlthi": 2000, "yhNh4ocj": 2000, "zwBUZKP2": 2000,
    "00j3FzRu": 5000, "38UDEYjx": 5000, "64b4ezIs": 5000, "70rtSQBf": 5000, "7ETVDxXt": 5000,
    "7gClHovz": 5000, "7hBnUE4E": 5000, "9F4Peefi": 5000, "9oInwXII": 5000, "AGZ8ChYn": 5000,
    "AqMG364D": 5000, "BkU9BL7V": 5000, "Cky3EQUE": 5000, "EGW2dnhG": 5000, "EbaQdQWc": 5000,
    "FFkEvMZn": 5000, "MTW3dLfE": 5000, "MWtSMvWD": 5000, "MavbJx8c": 5000, "Ny1ZhZN6": 5000,
    "P8dz1BgP": 5000, "QOypLVLf": 5000, "QrrrOaaB": 5000, "SIenPh0A": 5000, "Sbyl5YVb": 5000,
    "SeXHfzYK": 5000, "SmOR0E2v": 5000, "T7yzREyU": 5000, "Tsrynozh": 5000, "VRv2MGJH": 5000,
    "XCWYQUeE": 5000, "Zpb0sK0Z": 5000, "aPvK1dgN": 5000, "b2gW8OWj": 5000, "bc0WlmI4": 5000,
    "ehsYxUCG": 5000, "fO5nmCMO": 5000, "h5TCMCuM": 5000, "iFUmljwu": 5000, "js7Ed4c3": 5000,
    "nMQZZOBZ": 5000, "nQ15nNEp": 5000, "ovDKk2xE": 5000, "pARTnfvG": 5000, "psXLn0Up": 5000,
    "qB3CrmqU": 5000, "s4dpByiK": 5000, "vtqID2Rl": 5000, "wID6MRFp": 5000, "z7zrqTUR": 5000,
    "5IdLv4jR": 10000, "8vlyRU5W": 10000, "BEYz2rFT": 10000, "CPmJ5oYC": 10000, "IcRog70b": 10000,
    "K2ocCdKW": 10000, "LO0qxEZF": 10000, "MfuVZn6t": 10000, "Mg6BcH65": 10000, "NgL89vtz": 10000,
    "OELpbpeo": 10000, "U1hLyPmi": 10000, "Wt4NVNvi": 10000, "Y2SjeXUv": 10000, "ZpayGb9q": 10000,
    "eCyIc3qb": 10000, "eVS3Kc2N": 10000, "flFX7S7B": 10000, "g7DAvaJg": 10000, "gKxhkZHP": 10000,
    "hSlmDdYV": 10000, "tAqDRQef": 10000, "tBjusacC": 10000, "tC3R3mHa": 10000, "teiEASjG": 10000
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
    document.getElementById("fB").addEventListener("click", redeemCode);
    document.getElementById("clB").addEventListener("click", hideCreditDialog);
    document.getElementById("bB").addEventListener("click", buyTicket);
    document.getElementById("sB").addEventListener("click", startDraw);
    document.getElementById("tP").addEventListener("change",e=>{
        currentPrice=parseInt(e.target.value,10);
    });
    document.getElementById("loginButton").addEventListener("click", loginPlayer);
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
}

function hideCreditDialog(){
    document.getElementById("cD").classList.remove("visible");
}

function getGlobalUsedCodes() {
    return JSON.parse(localStorage.getItem('globalUsedCodes')) || [];
}

function saveGlobalUsedCodes(codes) {
    localStorage.setItem('globalUsedCodes', JSON.stringify(codes));
}

function redeemCode(){
    const code = document.getElementById("codeInput").value.trim();
    console.log("Código ingresado:", code);
    
    const globalUsedCodes = getGlobalUsedCodes();
    
    if (creditCodes.hasOwnProperty(code)) {
        console.log("Código válido encontrado");
        if (globalUsedCodes.includes(code)) {
            alert("Este código ya ha sido utilizado en otro dispositivo.");
        } else if (currentPlayer.usedCodes && currentPlayer.usedCodes.includes(code)) {
            alert("Ya has utilizado este código.");
        } else {
            const amount = creditCodes[code];
            credits += amount;
            currentPlayer.usedCodes = currentPlayer.usedCodes || [];
            currentPlayer.usedCodes.push(code);
            globalUsedCodes.push(code);
            saveGlobalUsedCodes(globalUsedCodes);
            updateCreditsDisplay();
            saveCredits();
            hideCreditDialog();
            document.getElementById("codeInput").value = "";
            alert(`Se han agregado ${amount} créditos a tu cuenta.`);
        }
    } else {
        console.log("Código no encontrado en la lista de códigos válidos");
        alert("Código inválido.");
    }
}

function  updateCreditsDisplay(){
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
    }
});

function redeemCode(){
    const code = document.getElementById("codeInput").value.trim();
    console.log("Código ingresado:", code); // Depuración
    
    if (creditCodes.hasOwnProperty(code)) {
        console.log("Código válido encontrado"); // Depuración
        if (currentPlayer.usedCodes && currentPlayer.usedCodes.includes(code)) {
            alert("Este código ya ha sido utilizado.");
        } else {
            const amount = creditCodes[code];
            credits += amount;
            currentPlayer.usedCodes = currentPlayer.usedCodes || [];
            currentPlayer.usedCodes.push(code);
            updateCreditsDisplay();
            saveCredits();
            hideCreditDialog();
            document.getElementById("codeInput").value = "";
            alert(`Se han agregado ${amount} créditos a tu cuenta.`);
        }
    } else {
        console.log("Código no encontrado en la lista de códigos válidos"); // Depuración
        alert("Código inválido.");
    }
}