import './interface.js';
import Game from './game.js';
import { startForm } from './interface.js';
const root = document.getElementById('minesweeper');
document.getElementById('new-game-form')
    .addEventListener('submit', event => {
    event.preventDefault();
    const { boardSize, bombsAmount, timeout } = startForm;
    new Game(root, boardSize, bombsAmount, timeout);
});
