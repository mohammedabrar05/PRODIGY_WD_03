let currentPlayer = 'X';
    let gameState = ['', '', '', '', '', '', '', '', ''];
    let gameActive = true;
    let isAIMode = false;

    const winningConditions = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];

    function setGameMode(mode) {
      isAIMode = mode === 'ai';
      resetGame();
    }

    function createBoard() {
      const board = document.getElementById('board');
      board.innerHTML = '';
      for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.setAttribute('data-index', i);
        cell.addEventListener('click', handleCellClick);
        board.appendChild(cell);
      }
      updateStatus();
    }

    function handleCellClick(e) {
      const index = e.target.getAttribute('data-index');
      
      if (gameState[index] !== '' || !gameActive) {
        return;
      }

      makeMove(index);

      if (isAIMode && gameActive && currentPlayer === 'O') {
        setTimeout(makeAIMove, 500);
      }
    }

    function makeMove(index) {
      gameState[index] = currentPlayer;
      const cell = document.querySelector(`[data-index="${index}"]`);
      cell.textContent = currentPlayer;
      cell.classList.add(currentPlayer.toLowerCase()); // Add class based on current player
    
      if (checkWin()) {
        gameActive = false;
        updateStatus(`Player ${currentPlayer} wins!`);
        return;
      }
    
      if (checkDraw()) {
        gameActive = false;
        updateStatus("Game ended in a draw!");
        return;
      }
    
      currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
      updateStatus();
    }

    function makeAIMove() {
      const bestMove = findBestMove();
      if (bestMove !== -1) {
        makeMove(bestMove);
      }
    }

    function findBestMove() {
      let bestScore = -Infinity;
      let bestMove = -1;

      for (let i = 0; i < 9; i++) {
        if (gameState[i] === '') {
          gameState[i] = 'O';
          let score = minimax(gameState, 0, false);
          gameState[i] = '';
          
          if (score > bestScore) {
            bestScore = score;
            bestMove = i;
          }
        }
      }
      
      return bestMove;
    }

    function minimax(board, depth, isMaximizing) {
      const result = checkGameResult();
      if (result !== null) {
        return result;
      }

      if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 9; i++) {
          if (board[i] === '') {
            board[i] = 'O';
            let score = minimax(board, depth + 1, false);
            board[i] = '';
            bestScore = Math.max(score, bestScore);
          }
        }
        return bestScore;
      } else {
        let bestScore = Infinity;
        for (let i = 0; i < 9; i++) {
          if (board[i] === '') {
            board[i] = 'X';
            let score = minimax(board, depth + 1, true);
            board[i] = '';
            bestScore = Math.min(score, bestScore);
          }
        }
        return bestScore;
      }
    }

    function checkGameResult() {
      if (checkWinForPlayer('O')) return 1;
      if (checkWinForPlayer('X')) return -1;
      if (checkDraw()) return 0;
      return null;
    }

    function checkWinForPlayer(player) {
      return winningConditions.some(condition => {
        return condition.every(index => gameState[index] === player);
      });
    }

    function checkWin() {
      return checkWinForPlayer(currentPlayer);
    }

    function checkDraw() {
      return gameState.every(cell => cell !== '');
    }

    function updateStatus(message) {
      const status = document.getElementById('status');
      status.textContent = message || `Player ${currentPlayer}'s turn`;
    }

    function resetGame() {
      currentPlayer = 'X';
      gameState = ['', '', '', '', '', '', '', '', ''];
      gameActive = true;
      createBoard();
    }
    
    createBoard();
