const board = document.getElementById('board');
const cells = document.querySelectorAll('.cell');
const resetButton = document.getElementById('resetButton');
const statusDisplay = document.getElementById('status');
const saveButton = document.getElementById('saveButton'); // (lo creiamo tra poco in HTML)
let moveLog = []; // Array per salvare le mosse




let currentPlayer = 'X';
let gameState = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;

// Variabili per le statistiche
let playerXWins = 0;
let playerOWins = 0;
let draws = 0;

// Condizioni di vittoria
const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function updateStatus() {
    statusDisplay.textContent = `Turno del giocatore ${currentPlayer}`;
}

/*modifico la funzione handCellClick per il log delle mosse */
function handleCellClick(event) {
    const clickedCell = event.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

    if (gameState[clickedCellIndex] !== '' || !gameActive) {
        return;
    }

    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.textContent = currentPlayer;

    // NUOVO: Salviamo la mossa
    moveLog.push({ player: currentPlayer, cell: clickedCellIndex });
    updateMoveLog(); // Aggiorna la visualizzazione del log

    checkResult();
    if (gameActive) {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        updateStatus();
    }
}

function checkResult() {
    let roundWon = false;
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        if (currentPlayer === 'X') {
            playerXWins++;
        } else {
            playerOWins++;
        }
        statusDisplay.textContent = `Giocatore ${currentPlayer} ha vinto!`;
        gameActive = false;
        updateStats();
        return;
    }

    const roundDraw = !gameState.includes('');
    if (roundDraw) {
        draws++;
        statusDisplay.textContent = 'Pareggio!';
        gameActive = false;
        updateStats();
        return;
    }
}

function handleReset() {
    gameState = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    currentPlayer = 'X';
    updateStatus();
    cells.forEach(cell => cell.textContent = '');
    moveLog = []; //  Reset anche il log delle mosse
    updateMoveLog(); //  E aggiorna a schermo
}

// ✅ Funzione UNICA per aggiornare e salvare le statistiche
function updateStats() {
    document.getElementById('player-x-wins').textContent = playerXWins;
    document.getElementById('player-o-wins').textContent = playerOWins;
    document.getElementById('draws').textContent = draws;
}

function saveStats() {
    localStorage.setItem('playerXWins', playerXWins);
    localStorage.setItem('playerOWins', playerOWins);
    localStorage.setItem('draws', draws);
    alert("Statistiche salvate!");
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetButton.addEventListener('click', handleReset);
saveButton.addEventListener('click', saveStats);

// ✅ Recuperiamo anche i pareggi salvati
if (localStorage.getItem('playerXWins')) {
    playerXWins = parseInt(localStorage.getItem('playerXWins'));
}
if (localStorage.getItem('playerOWins')) {
    playerOWins = parseInt(localStorage.getItem('playerOWins'));
}
if (localStorage.getItem('draws')) {
    draws = parseInt(localStorage.getItem('draws'));
}

// Mostriamo le statistiche appena parte il gioco
updateStats();
updateStatus();

const clearStatsButton = document.getElementById('clearStatsButton');
clearStatsButton.addEventListener('click', () => {
    localStorage.clear();
    playerXWins = 0;
    playerOWins = 0;
    draws = 0;
    updateStats();
    alert("Statistiche azzerate!");
});


function updateMoveLog() {
    const moveLogElement = document.getElementById('move-log');
    moveLogElement.innerHTML = '';

    moveLog.forEach((move, index) => {
        const li = document.createElement('li');
        li.textContent = `${index + 1}. ${move.player} ha cliccato sulla cella ${move.cell}`;
        li.dataset.cellIndex = move.cell;

        li.addEventListener('mouseover', (e) => {
            const cellIndex = e.target.dataset.cellIndex;
            const cell = document.querySelector(`.cell[data-index="${cellIndex}"]`);
            if (cell) {
                cell.classList.add('highlighted'); // 👈 aggiungiamo la classe
            }
        });

        li.addEventListener('mouseout', (e) => {
            const cellIndex = e.target.dataset.cellIndex;
            const cell = document.querySelector(`.cell[data-index="${cellIndex}"]`);
            if (cell) {
                cell.classList.remove('highlighted'); // 👈 togliamo la classe
            }
        });

        moveLogElement.appendChild(li);
    });
}

