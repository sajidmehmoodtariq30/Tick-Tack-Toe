// Get form, main game area, and container elements
const togglebtn = document.getElementById("toggle");
const body = document.getElementsByTagName('body')[0];
const main = document.getElementById('main');
const container = document.getElementById('container');
const playerTurn = document.getElementById('status');
const cells = document.querySelectorAll('.cell');

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
let Xturn = true; // X starts first by default
let gameActive = true; // Game is active by default

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
        toggleVisibility(main, container);

        // Set initial player turn and update scoreboard
        playerTurn.innerHTML = `${player1.value}'s turn`;
        document.getElementById('player1name').innerHTML = player1.value;
        document.getElementById('player2name').innerHTML = player2.value;
    } else {
        alert('Please enter both player names');
    }
});

// Add click functionality to each cell
cells.forEach(cell => {
    cell.addEventListener('click', () => {
        if (gameActive && cell.innerHTML == "") {
            handlePlayerMove(cell);
        }
    });
});

// Function to handle player move
function handlePlayerMove(cell) {
    display(cell); // Display X or O
    Xturn = !Xturn; // Switch turn
    checking(cell); // Check if there's a winner or a draw
}

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
    Xturn = true; // Reset the turn to X
    
    if (player1 && player2) { // Check if player1 and player2 are defined
        playerTurn.innerHTML = `${player1.value}'s turn`; // Reset turn display
    }
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
                declareWinner(winner, cellsToCheck);
                return;
            }
        }
    }

    // Check for draw
    if (!Array.from(cells).some(cell => cell.innerHTML === "")) {
        playerTurn.innerHTML = "It's a draw!";
        gameActive = false;
        updateScoreboard("Draw"); // Update scoreboard in case of a draw
    }
}

// Declare winner and highlight the winning cells
function declareWinner(winner, cellsToCheck) {
    if (winner === 'X') {
        playerTurn.innerHTML = `${player1.value} wins!`;
    } else if (winner === 'O') {
        playerTurn.innerHTML = `${player2.value} wins!`;
    }
    gameActive = false; // End game
    cellsToCheck.forEach(cell => cell.classList.add('winning-cell')); // Highlight winning cells
    updateScoreboard(winner);
}

// Update scoreboard function
function updateScoreboard(result) {
    const scoreboardTable = document.getElementById('scoreboard-table');
    const newRow = document.createElement('tr');
    const player1Cell = document.createElement('td');
    const player2Cell = document.createElement('td');

    // Handle different results
    if (result === 'X') {
        player1Cell.innerHTML = 'Win';
        player2Cell.innerHTML = 'Lose';
    } else if (result === 'O') {
        player1Cell.innerHTML = 'Lose';
        player2Cell.innerHTML = 'Win';
    } else if (result === 'Draw') {
        player1Cell.innerHTML = 'Draw';
        player2Cell.innerHTML = 'Draw';
    }

    // Append the new result row to the scoreboard table
    newRow.appendChild(player1Cell);
    newRow.appendChild(player2Cell);
    scoreboardTable.tBodies[0].appendChild(newRow);
}

// Reset the scoreboard and return to the player input form
document.getElementById('reset-score-btn').addEventListener('click', () => {
    document.querySelector('#scoreboard-table tbody').innerHTML = ""; // Clear the scoreboard
    toggleVisibility(container, main); // Go back to player input form
    
    // Reset the game state
    gameActive = true;
    cells.forEach(cell => {
        cell.innerHTML = ""; // Clear cell content
        cell.classList.remove('winning-cell'); // Remove winning cell class
    });
    Xturn = true; // Reset to X's turn
});

// Toggle visibility between main game and form containers
function toggleVisibility(showElement, hideElement) {
    hideElement.classList.add('displayNone');
    hideElement.classList.remove('displayFlex');
    showElement.classList.add('displayFlex');
    showElement.classList.remove('displayNone');
}