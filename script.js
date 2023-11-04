// Helper function to check if the board is valid
function isValid(board, row, col, num) {
    for (let x = 0; x < 9; x++) {
      if (board[row][x] === num || board[x][col] === num) return false;
      let boxRow = 3 * Math.floor(row / 3) + Math.floor(x / 3);
      let boxCol = 3 * Math.floor(col / 3) + x % 3;
      if (board[boxRow][boxCol] === num) return false;
    }
    return true;
  }
  
  // The recursive function to solve the Sudoku
  function solveSudoku(board) {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === '.') {
          for (let num = 1; num <= 9; num++) {
            let numStr = num.toString();
            if (isValid(board, row, col, numStr)) {
              board[row][col] = numStr;
              if (solveSudoku(board)) {
                return true;
              }
              board[row][col] = '.';
            }
          }
          return false;
        }
      }
    }
    return true;
  }
  
  // Function to generate the HTML table for the Sudoku board
  function generateBoardHTML(board) {
    let html = '<table class="sudoku-board">';
    for (let row = 0; row < 9; row++) {
      html += '<tr>';
      for (let col = 0; col < 9; col++) {
        let classes = [];
        if (col % 3 === 2 && col !== 8) classes.push('subgrid-border-right');
        if (row % 3 === 2 && row !== 8) classes.push('subgrid-border-bottom');
        let cellValue = board[row][col] !== '.' ? board[row][col] : '&nbsp;';
        html += `<td class="${classes.join(' ')}">${cellValue}</td>`;
      }
      html += '</tr>';
    }
    html += '</table>';
    return html;
  }
  
  // Function to remove cells from the board to create a puzzle
  function generatePuzzle(board, removedCells) {
    let puzzle = JSON.parse(JSON.stringify(board));
    let cellsRemoved = 0;
    while (cellsRemoved < removedCells) {
      let row = Math.floor(Math.random() * 9);
      let col = Math.floor(Math.random() * 9);
      if (puzzle[row][col] !== '.') {
        puzzle[row][col] = '.';
        cellsRemoved++;
      }
    }
    return puzzle;
  }
  
  // Function to handle the solve button click
  function solveAndDisplay() {
    solveSudoku(board);
    document.getElementById('sudokuBoard').innerHTML = generateBoardHTML(board);
  }
  
  // Function to generate a fully solved board
  function generateSolvedBoard() {
    let board = Array.from({ length: 9 }, () => Array(9).fill('.'));
    solveSudoku(board);
    return board;
  }
  
  // Event listener for difficulty selection
  document.getElementById('difficultySelect').addEventListener('change', function() {
    let difficulty = this.value;
    let removedCells;
    switch (difficulty) {
      case 'easy':
        removedCells = 20;
        break;
      case 'medium':
        removedCells = 40;
        break;
      case 'hard':
        removedCells = 60;
        break;
    }
    board = generatePuzzle(generateSolvedBoard(), removedCells);
    document.getElementById('sudokuBoard').innerHTML = generateBoardHTML(board);
  });
  
  // Generate the initial board based on default difficulty
  document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('difficultySelect').value = 'easy';
    document.getElementById('difficultySelect').dispatchEvent(new Event('change'));
    document.getElementById('solveButton').addEventListener('click', solveAndDisplay);
  });
  
  // Define the board variable globally
  let board = [];