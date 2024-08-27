const gameBoard = function() {
    this.board = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    this.playerIndexes = [];
    this.cpuIndexes = [];
};

gameBoard.prototype.markPlayer = function(indexes) {
    indexes.forEach(index => {
        if (index >= 0 && index < this.board.length) {
            this.board[index] = 'X';
        }
    });
};

gameBoard.prototype.markCpu = function(indexes) {
    indexes.forEach(index => {
        if (index >= 0 && index < this.board.length) {
            this.board[index] = 'O';
        }
    });
};

gameBoard.prototype.printBoard = function() {
    const boardDiv = document.getElementById('board');
    const squares = boardDiv.getElementsByClassName('square');
    this.board.forEach((value, index) => {
        squares[index].innerHTML = value;
    });
};

gameBoard.prototype.printWinner = function() {
    const messageDiv = document.getElementById('message');
    const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [6, 4, 2]
    ];

    let hasWon = false;

    for (let combination of winningCombinations) {
        if (combination.every(index => this.board[index] === 'X')) {
            hasWon = true;
            messageDiv.innerHTML = 'You win!';
            break;
        } else if (combination.every(index => this.board[index] === 'O')) {
            hasWon = true;
            messageDiv.innerHTML = 'CPU wins!';
            break;
        }
    }

    if (hasWon) {
        return true;
    } else if (this.board.every(cell => cell === 'X' || cell === 'O')) {
        messageDiv.innerHTML = 'It\'s a draw.';
        return true;
    }
    return false;
};

gameBoard.prototype.getAvailableIndexes = function() {
    return this.board
        .map((value, index) => (value !== 'X' && value !== 'O') ? index : null)
        .filter(index => index !== null);
};

gameBoard.prototype.cpuTurn = function() {
    const availableIndexes = this.getAvailableIndexes();
    
    if (availableIndexes.length === 0) return;

    const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [6, 4, 2]
    ];

    let moveMade = false;

    for (let combination of winningCombinations) {
        const cpuWinningMove = this.findWinningMove(combination, 'O');
        if (cpuWinningMove !== null) {
            this.board[cpuWinningMove] = 'O';
            moveMade = true;
            break;
        }
    }

    if (!moveMade) {
        for (let combination of winningCombinations) {
            const playerWinningMove = this.findWinningMove(combination, 'X');
            if (playerWinningMove !== null) {
                this.board[playerWinningMove] = 'O';
                moveMade = true;
                break;
            }
        }
    }

    if (!moveMade) {
        const randomIndex = availableIndexes[Math.floor(Math.random() * availableIndexes.length)];
        this.board[randomIndex] = 'O';
    }
};

gameBoard.prototype.findWinningMove = function(combination, symbol) {
    const filled = combination.filter(index => this.board[index] === symbol);
    const empty = combination.filter(index => this.board[index] !== 'X' && this.board[index] !== 'O');

    if (filled.length === 2 && empty.length === 1) {
        return empty[0];
    }
    return null;
};

gameBoard.prototype.restartGame = function() {
    this.board = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    this.playerIndexes = [];
    this.cpuIndexes = [];
    document.getElementById('message').innerHTML = ''; // Clear the message
    this.printBoard(); // Refresh the board display
};

const game = new gameBoard();

function handlePlayerMove() {
    const playerInput = document.getElementById('playerInput');
    const index = parseInt(playerInput.value, 10);
    
    if (!isNaN(index) && index >= 0 && index <= 8 && game.board[index] !== 'X' && game.board[index] !== 'O') {
        game.playerIndexes.push(index);
        game.board[index] = 'X';
        game.printBoard();
        
        if (game.printWinner()) {
            return;
        }
        
        if (game.getAvailableIndexes().length === 0) {
            document.getElementById('message').innerHTML = 'The game is a draw.';
            return;
        }
        
        game.cpuTurn();
        game.printBoard();
        
        if (game.printWinner()) {
            return;
        }
        
        if (game.getAvailableIndexes().length === 0) {
            document.getElementById('message').innerHTML = 'The game is a draw.';
            return;
        }
    } else {
        document.getElementById('message').innerHTML = "Invalid input or position already taken";
    }
}

function handleRestart() {
    game.restartGame();
}

document.getElementById('submitBtn').addEventListener('click', handlePlayerMove);
document.getElementById('restartBtn').addEventListener('click', handleRestart);
