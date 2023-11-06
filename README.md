# Sudoku Savant

Sudoku Savant is a classic Sudoku puzzle game designed to provide an engaging and interactive experience for Sudoku enthusiasts. Built with plain HTML, CSS, and JavaScript, this game allows users to play Sudoku directly in their browser.

## Features

- **Dynamic Puzzle Generation:** Enjoy an endless number of Sudoku puzzles generated on the fly with varying levels of difficulty.
- **Solver Algorithm:** Built-in solver algorithm that ensures every puzzle has a unique solution.
- **Interactive UI:** Simple and responsive user interface for desktop and mobile browsers.
- **Local Play:** Play the game offline - just clone the repo and open `index.html` in your browser.

## Getting Started

To run Sudoku Savant locally:

1. Clone the repository to your local machine.
2. Navigate to the cloned directory.
3. Open the `index.html` file in your preferred browser.
4. Start solving puzzles!

## Puzzle Generation Logic

The puzzle generation logic in Sudoku Savant ensures that each game is both challenging and solvable. A fully solved board is generated first, ensuring a unique solution. Then, a number of cells are removed based on the selected difficulty level - fewer cells are removed for an easier game, while more cells are removed for a harder challenge.

## Solver Logic

Sudoku Savant's solver uses a backtracking algorithm to fill in the puzzle, which mimics the way a human might attempt to solve Sudoku by trying numbers and backtracking upon hitting a dead end. It's efficient and guarantees a solution if one is available.

## Contributions

We welcome contributions to Sudoku Savant. If you have ideas for improvements or have found a bug, please open an issue or a pull request.

## License

Sudoku Savant is open source and is available under the [MIT License](LICENSE).

Enjoy your game of Sudoku!