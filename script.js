// Get form, main game area, and container elements
let togglebtn = document.getElementById("toggle");
let body = document.getElementsByTagName('body')[0];
let main = document.getElementById('main');
let container = document.getElementById('container');

// Set default mode to light
body.classList.add('light');

// Toggle between light and dark modes
togglebtn.addEventListener('click', () => {
    body.classList.toggle('light');
    body.classList.toggle('dark');
    togglebtn.innerText = body.classList.contains('light') ? "Dark Mode" : "Light Mode";
});

// Initialize variables
let player1, player2;
let playerTurn = document.getElementById('status');
let Xturn = true; // X starts first by default
let gameActive = true; // Game is active by default
let cells = document.querySelectorAll('.cell');

// Hide the main game area initially
main.classList.add('displayNone');
container.classList.add('displayFlex');

// Form submit event listener to capture player names and start the game
document.getElementById('playerForm').addEventListener('submit', function (event) {
    event.preventDefault();

    player1 = document.getElementById('player1');
    player2 = document.getElementById('player2');

    // Ensure both player names are provided
    if (player1.value && player2.value) {
        // Show the game area and hide the form
        main.classList.remove('displayNone');
        main.classList.add('displayFlex');
        container.classList.remove('displayFlex');
        container.classList.add('displayNone');

        // Set initial player turn and update scoreboard
        playerTurn.innerHTML = `${player1.value}'s turn`;
        document.getElementById('player1name').innerHTML = player1.value;
        document.getElementById('player2name').innerHTML = player2.value;
    }
});

// Add click functionality to each cell
cells.forEach(cell => {
    cell.addEventListener('click', () => {
        if (gameActive && cell.innerHTML == "") {
            display(cell); // Display X or O
            Xturn = !Xturn; // Switch turn
            checking(cell); // Check if there's a winner or a draw
        }
    });
});

// Function to display X or O in a clicked cell
function display(cell) {
    cell.innerHTML = Xturn ? 'X' : 'O';
    playerTurn.innerHTML = Xturn ? `${player2.value}'s turn` : `${player1.value}'s turn`;
}

// Reset button functionality to reset the game
document.getElementById('reset-btn').addEventListener('click', resetGame);

// Function to reset the entire game
function resetGame() {
    gameActive = true;
    cells.forEach(cell => {
        cell.innerHTML = ""; // Clear all cells
        cell.classList.remove('winning-cell'); // Remove winning cell highlight
    });
    Xturn = true; // Reset turn to X
    playerTurn.innerHTML = `${player1.value}'s turn`; // Reset status to player 1's turn
}

// Function to check for a win or draw
function checking(element) {
    const index = Array.prototype.indexOf.call(cells, element);
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],  // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8],  // Columns
        [0, 4, 8], [2, 4, 6]              // Diagonals
    ];

    // Check for winning combinations
    for (let combo of winningCombinations) {
        if (combo.includes(index)) {
            const cellsToCheck = combo.map(i => cells[i]);
            const winner = cellsToCheck[0].innerHTML;
            if (winner !== "" && cellsToCheck.every(cell => cell.innerHTML === winner)) {
                if (winner === 'X') {
                    playerTurn.innerHTML = `${player1.value} wins!`;
                } else if (winner === 'O') {
                    playerTurn.innerHTML = `${player2.value} wins!`;
                }
                gameActive = false; // End game
                cellsToCheck.forEach(cell => cell.classList.add('winning-cell')); // Highlight winning cells
                updateScoreboard(winner);
                return;
            }
        }
    }

    // Check for draw
    if (!Array.from(cells).some(cell => cell.innerHTML === "")) {
        playerTurn.innerHTML = "It's a draw!";
        gameActive = false;
    }
}

// Update scoreboard function
function updateScoreboard(winner) {
    const scoreboardTable = document.getElementById('scoreboard-table');
    const newRow = document.createElement('tr');
    const player1Cell = document.createElement('td');
    const player2Cell = document.createElement('td');

    player1Cell.innerHTML = winner === 'X' ? 'Win' : 'Lose';
    player2Cell.innerHTML = winner === 'X' ? 'Lose' : 'Win';

    newRow.appendChild(player1Cell);
    newRow.appendChild(player2Cell);

    scoreboardTable.tBodies[0].appendChild(newRow);
}

// Reset the scoreboard and return to the player input form
document.getElementById('reset-score-btn').addEventListener('click', () => {
    document.querySelector('tbody').innerHTML = ""; // Clear the scoreboard
    main.classList.add('displayNone');
    main.classList.remove('displayFlex');
    container.classList.add('displayFlex');
    container.classList.remove('displayNone');
});