// Global variables
let selectedRow, selectedCol;
let board = [];

/**
 * Helper function to check during Sudoku-solving process whether it is
 * valid to place a certain number in a specific cell,
 */
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
        html += `<td tabindex="0" class="${classes.join(' ')}" data-row="${row}" data-col="${col}">${cellValue}</td>`;
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
    makeCellsClickable();
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
    makeCellsClickable();
  });
  
  // Generate the initial board based on default difficulty
  document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('difficultySelect').value = 'easy';
    document.getElementById('difficultySelect').dispatchEvent(new Event('change'));
    document.getElementById('solveButton').addEventListener('click', solveAndDisplay);
  });

  // Functio to clear selected cell on board
  function clearSelectedCell() {
    if (typeof selectedRow === 'number' && typeof selectedCol === 'number') {
      board[selectedRow][selectedCol] = '.';
      updateBoardDisplay(); // Update the display after clearing the cell
      
      // Clear the selection variables
      selectedRow = undefined;
      selectedCol = undefined;
  
      // Optionally, update the UI to reflect that no cell is selected
      document.querySelectorAll('.sudoku-board td').forEach(cell => {
        cell.classList.remove('selected-cell');
      });
    }
  }
  
  // Validate current state of the board
  function validateBoard() {
    // You will need to implement a validation function
    if (isBoardValid(board)) {
      showToast("The board is valid!", "success");
    } else {
      showToast("The board is invalid or incomplete.", "error");
    }
  }
  
  // Toast message for validation
  function showToast(message, status) {
    const toast = document.getElementById('toast');
    toast.className = `toast show ${status}`;
    toast.textContent = message;
    setTimeout(() => toast.className = toast.className.replace('show', ''), 4000);
  }

  // update the board with new state
  function updateBoardDisplay() {
    document.getElementById('sudokuBoard').innerHTML = generateBoardHTML(board);
    // Reapply the 'selected-cell' class to the currently selected cell after re-rendering the board
    if (selectedRow !== undefined && selectedCol !== undefined) {
      updateSelectedCell(selectedRow, selectedCol);
    }
  }

  /**
   * Its intended to be used as a complete board validation function
   * It checks whether the entire board is in a valid state
   * @param {*} board 
   * @returns boolean 
   */
  function isBoardValid(board) {
    // Helper function to check if a block (row, column, or square) is valid
    function isValidBlock(block) {
        let seen = new Set();
        for (let num of block) {
            if (num !== '.') {
                if (seen.has(num)) {
                    return false; // If a number is repeated, the block is not valid
                }
                seen.add(num);
            }
        }
        return true;
    }

    // Check rows and columns
    for (let i = 0; i < 9; i++) {
        let row = [];
        let col = [];
        for (let j = 0; j < 9; j++) {
            row.push(board[i][j]);
            col.push(board[j][i]);
        }
        if (!isValidBlock(row) || !isValidBlock(col)) {
            return false;
        }
    }

    // Check 3x3 subgrids
    for (let i = 0; i < 9; i += 3) {
        for (let j = 0; j < 9; j += 3) {
            let square = [];
            for (let k = 0; k < 3; k++) {
                for (let l = 0; l < 3; l++) {
                    square.push(board[i + k][j + l]);
                }
            }
            if (!isValidBlock(square)) {
                return false;
            }
        }
    }

    // If no false returns occurred, the board is valid
    return true;
}

  // This function add the selected number to the selected cell in the board
  function addNumberToBoard(number) {
    if (typeof selectedRow === 'number' && typeof selectedCol === 'number') {
      board[selectedRow][selectedCol] = number.toString();
      updateBoardDisplay(); // Update the display after adding the number
    }
  }

  function makeCellsClickable() {
    // Assuming the cells have the 'sudoku-cell' class
    const cells = document.querySelectorAll('.sudoku-board td');
    cells.forEach(cell => {
      cell.addEventListener('click', function() {
        // Clear previous selection
        cells.forEach(c => c.classList.remove('selected-cell'));
        // Mark this cell as selected
        this.classList.add('selected-cell');
  
        selectedRow = this.dataset.row;
        selectedCol = this.dataset.col;
        
        // Enable number buttons only if the selected cell is empty
        if (board[selectedRow][selectedCol] === '.') {
          enableNumberButtons();
        }
      });
    });
  }

  function enableNumberButtons() {
    const numberButtons = document.querySelectorAll('#numberButtons button');
    numberButtons.forEach(button => {
      button.disabled = false;
    });
  }
  
  // Function to initialize number buttons and clear button
  function initializeNumberButtons() {
    const numberButtons = document.getElementById('numberButtons');
    for (let i = 1; i <= 9; i++) {
      const button = document.createElement('button');
      button.textContent = i;
      button.addEventListener('click', () => addNumberToBoard(i));
      numberButtons.appendChild(button);
    }
    const clearButton = document.createElement('button');
    clearButton.textContent = 'Clear';
    clearButton.addEventListener('click', clearSelectedCell);
    numberButtons.appendChild(clearButton);
  }
  function makeBoardClickable() {
    const sudokuBoard = document.getElementById('sudokuBoard');
    // Event delegation to handle click on individual cells
    sudokuBoard.addEventListener('click', function(event) {
      const target = event.target; // Clicked element
      if (target.tagName === 'TD') { // Check if a cell was clicked
        const row = parseInt(target.getAttribute('data-row'), 10);
        const col = parseInt(target.getAttribute('data-col'), 10);
  
        // Clear previous selection
        document.querySelectorAll('.selected-cell').forEach(c => c.classList.remove('selected-cell'));
        // Mark this cell as selected
        target.classList.add('selected-cell');
    
        selectedRow = row;
        selectedCol = col;
        
        // Enable number buttons only if the selected cell is empty
        if (board[selectedRow][selectedCol] === '.') {
          enableNumberButtons();
        }
      }
    });
  }

  // Initialize the selected cell to the first cell by default
  selectedRow = 0;
  selectedCol = 0;
  function updateSelectedCell(row, col) {
    document.querySelectorAll('.sudoku-board td').forEach(cell => {
      cell.classList.remove('selected-cell');
    });
  
    const newSelectedCell = document.querySelector(`.sudoku-board td[data-row="${row}"][data-col="${col}"]`);
    if (newSelectedCell) { // Check if the element exists
      newSelectedCell.classList.add('selected-cell');
      newSelectedCell.focus(); // Focus on the new selected cell
    }
    
    selectedRow = row;
    selectedCol = col;
}
  
  function handleArrowKeyNavigation(event) {
    switch (event.key) {
      case 'ArrowUp':
        if (selectedRow > 0) updateSelectedCell(selectedRow - 1, selectedCol);
        break;
      case 'ArrowDown':
        if (selectedRow < 8) updateSelectedCell(selectedRow + 1, selectedCol);
        break;
      case 'ArrowLeft':
        if (selectedCol > 0) updateSelectedCell(selectedRow, selectedCol - 1);
        break;
      case 'ArrowRight':
        if (selectedCol < 8) updateSelectedCell(selectedRow, selectedCol + 1);
        break;
      default:
        return; // Exit this handler for other keys
    }
    event.preventDefault(); // Prevent the default action (scroll / move caret)
  }

  function handleOnKeyDownForKeyboardInput(event) {
    // Only proceed if a cell is selected
    if (selectedRow == null || selectedCol == null) return;

    // Allow numbers 1-9
    if (event.key >= '1' && event.key <= '9') {
      // Directly update the board with the pressed key
      board[selectedRow][selectedCol] = event.key;
      updateBoardDisplay();
    } else if (event.key === 'Backspace' || event.key === 'Delete') {
      // If Backspace or Delete is pressed, clear the selected cell
      board[selectedRow][selectedCol] = '.';
      updateBoardDisplay();
    }

    // Prevent default to stop any other behavior that might happen when pressing these keys
    event.preventDefault();
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    initializeNumberButtons();
    document.getElementById('validateButton').addEventListener('click', validateBoard);
    updateBoardDisplay(); // Update the board display initially
    makeBoardClickable(); // Make the board clickable after it's displayed
    updateSelectedCell(selectedRow, selectedCol); // Now the DOM is ready, we can update the selected cell
    document.addEventListener('keydown', handleOnKeyDownForKeyboardInput); // Allow keyboard input and backspace
    document.addEventListener('keydown', handleArrowKeyNavigation); // Allow keyboard input for arrow nav
});
