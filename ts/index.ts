import Game from './game.js';
const root = document.getElementById('minesweeper')!
const game = new Game(root, 15, 10, 180 * 1000)