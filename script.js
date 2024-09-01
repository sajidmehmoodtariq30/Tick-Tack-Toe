// Toggle Light mode / Dark mode
let togglebtn = document.getElementById("toggle");
let body = document.getElementsByTagName('body')[0];

// Set default mode to light
body.classList.add('light');

// Toggle button functionality for switching between light and dark mode
togglebtn.addEventListener('click', () => {
    if (body.classList.contains('light')) {
        body.classList.remove('light');
        body.classList.add('dark');
        togglebtn.innerText = "Light Mode";
    } else {
        body.classList.add('light');
        body.classList.remove('dark');
        togglebtn.innerText = "Dark Mode";
    }
});

// Getting the main and container elements
let main = document.getElementById('main');
let container = document.getElementById('container');

// Set initial visibility
main.classList.add('displayNone'); // Main hidden initially
container.classList.add('displayFlex'); // Container visible initially

// Form submit event listener
document.getElementById('playerForm').addEventListener('submit', function (event) {
    event.preventDefault();

    // Get player names
    const player1 = document.getElementById('player1');
    const player2 = document.getElementById('player2');

    // Ensure player names are not empty (optional check)
    if (player1 && player2) {
        // Toggle visibility of main and container
        main.classList.remove('displayNone');
        main.classList.add('displayFlex');
        container.classList.remove('displayFlex');
        container.classList.add('displayNone');
    }
    // dynamic data
    playerTurn.innerHTML = `${player1.value}' turn`;
});

// Select all the cells in the Tic-Tac-Toe grid
let cells = document.querySelectorAll('.cell');
let gameActive = true; // Flag to track if the game is active

// Iterate through each cell and add click functionality
cells.forEach(element => {
    element.addEventListener('click', () => {
        if (gameActive && element.innerHTML == "") {
            display(element);  // Display either X or O based on the current turn
            Xturn = !Xturn;    // Switch turns
            checking(element); // Check if the current move resulted in a win or a draw
        }
    });
});

// Turn tracking and display
let playerTurn = document.getElementById('status');
let Xturn = true;  // X always starts the game

// Display either X or O in the clicked cell and update the player turn message
function display(element) {
    if (Xturn) {
        element.innerHTML = 'X';
        playerTurn.innerHTML = `${player2.value}'s turn`;
    } else {
        element.innerHTML = 'O';
        playerTurn.innerHTML = `${player1.value}'s turn`;
    }
}

// Reset button functionality to reset the game
document.getElementById('reset-btn').addEventListener('click', () => {
    gameActive = true; // Enable the game again
    cells.forEach(cell => {
        cell.innerHTML = "";               // Clear all the cells
        cell.classList.remove('winning-cell'); // Remove the winning cell highlight
    });
    playerTurn.innerHTML = `${player1.value}'s turn`; // Reset turn message to X's turn
});

// Reset score button to reset the scoreboard
document.getElementById("reset-score-btn").addEventListener('click', () => {
    xWins = 0;  // Reset X's wins to 0
    oWins = 0;  // Reset O's wins to 0
    updateScoreboard(); // Update the scoreboard to reflect the reset
    // Toggle visibility of main and container
    main.classList.add('displayNone');
    main.classList.remove('displayFlex');
    container.classList.add('displayFlex');
    container.classList.remove('displayNone');
});

// Scoreboard tracking variables
let xWins = 0;
let oWins = 0;

// Element to update scoreboard
let scoreboard = document.getElementById('scoreboard');

// Function to update scoreboard with the current win count
function updateScoreboard() {
    scoreboard.innerHTML = `${player1.value}'s wins: ${oWins} <br> ${player2.value}'s wins: ${xWins}`;
}

// Function to check for a winning combination after each move
function checking(element) {
    const index = Array.prototype.indexOf.call(cells, element); // Get the index of the clicked cell
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],  // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8],  // Columns
        [0, 4, 8], [2, 4, 6]              // Diagonals
    ];

    // Loop through all winning combinations to check for a match
    for (let combo of winningCombinations) {
        if (combo.includes(index)) {
            const cellsToCheck = combo.map(i => cells[i]);  // Get the cells corresponding to the current combination
            const winner = cellsToCheck[0].innerHTML;       // Get the value in the first cell (X or O)
            if (winner !== "" && cellsToCheck.every(cell => cell.innerHTML === winner)) {
                if (winner == 'X') {
                    playerTurn.innerHTML = `${player1.value} wins!`;  // Update status with the winner
                }
                if(winner == 'O'){
                    playerTurn.innerHTML = `${player2.value} wins!`;  // Update status with the winner
                }
                gameActive = false;  // Disable further moves
                // Highlight the winning cells
                cellsToCheck.forEach(cell => {
                    cell.classList.add('winning-cell');
                });
                // Update the scoreboard
                if (winner === 'X') {
                    xWins++;
                } else {
                    oWins++;
                }
                updateScoreboard();
                return;
            }
        }
    }

    // Check if it's a draw
    if (!Array.from(cells).some(cell => cell.innerHTML === "")) {
        playerTurn.innerHTML = "It's a draw!";  // Display draw message
        gameActive = false;  // Disable further moves
    }
}