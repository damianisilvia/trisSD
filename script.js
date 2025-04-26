const board = document.getElementById('board');
const cells = document.querySelectorAll('.cell');
const resetButton = document.getElementById('resetButton');
const statusDisplay = document.getElementById('status');
let currentPlayer = 'X';
let gameState = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;

// Variabili per le vittorie
let playerXWins = 0;
let playerOWins = 0;

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

// Funzione per aggiornare lo stato del gioco e il messaggio sotto i quadrati
function updateStatus() {
    statusDisplay.textContent = `Turno del giocatore ${currentPlayer}`;
}

function handleCellClick(event) {
    const clickedCell = event.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

    if (gameState[clickedCellIndex] !== '' || !gameActive) {
        return; // Se la cella è già occupata o il gioco è finito, non fare nulla
    }

    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.textContent = currentPlayer;

    checkResult();
    if (gameActive) {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X'; // Alterna il giocatore solo se il gioco è attivo
        updateStatus(); // Aggiorna il messaggio sotto i quadrati
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
            playerXWins++; // Aumenta vittoria di X
        } else {
            playerOWins++; // Aumenta vittoria di O
        }
        statusDisplay.textContent = `Giocatore ${currentPlayer} ha vinto!`;
        gameActive = false;
        updateStats(); // Aggiorna le statistiche
        return;
    }

    const roundDraw = !gameState.includes('');
    if (roundDraw) {
        statusDisplay.textContent = 'Pareggio!';
        gameActive = false;
        return;
    }
}

function handleReset() {
    gameState = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    currentPlayer = 'X';
    updateStatus(); // Mostra il turno del giocatore X all'inizio
    cells.forEach(cell => cell.textContent = '');
}

function updateStats() {
    // Salvataggio delle statistiche nel localStorage
    localStorage.setItem('playerXWins', playerXWins);
    localStorage.setItem('playerOWins', playerOWins);

    // Mostra le statistiche
    console.log(`Vittorie X: ${playerXWins}, Vittorie O: ${playerOWins}`);
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetButton.addEventListener('click', handleReset);

// Recupera le statistiche salvate dal localStorage (se esistono)
if (localStorage.getItem('playerXWins')) {
    playerXWins = parseInt(localStorage.getItem('playerXWins'));
    playerOWins = parseInt(localStorage.getItem('playerOWins'));
}

// Prima di tutto, aggiorniamo lo stato per il primo turno
updateStatus();
