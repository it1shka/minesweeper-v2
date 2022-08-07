import { Board, createBoardLayer } from "./board.js";
import { clock, statusBar } from "./interface.js";
export default class Game {
    constructor(root, boardSize, bombsAmount, timeoutSeconds) {
        this.root = root;
        this._state = "IN_PROCESS" /* IN_PROCESS */;
        this.layer = createBoardLayer(root, boardSize);
        this.board = new Board(boardSize, bombsAmount, this.layer);
        for (let row = 0; row < boardSize; row++) {
            for (let col = 0; col < boardSize; col++) {
                const pos = [row, col];
                const cell = this.layer[row][col];
                cell.onclick = evt => this.clickBoard(evt, 'left', pos);
                cell.oncontextmenu = evt => this.clickBoard(evt, 'right', pos);
            }
        }
        root.style.display = 'grid';
        clock.start(timeoutSeconds);
        this.gameoverTimeoutHandler = setTimeout(() => {
            if (this.state === "IN_PROCESS" /* IN_PROCESS */) {
                this.state = "LOSS" /* LOSS */;
            }
        }, timeoutSeconds * 1000);
        statusBar.status = "Active \uD83E\uDD78" /* IN_PROCESS */;
        const newGameBtn = document.getElementById('menu__start');
        const handler = () => {
            this.cleanup();
            newGameBtn.removeEventListener('click', handler);
        };
        newGameBtn.addEventListener('click', handler);
    }
    get state() {
        return this._state;
    }
    set state(value) {
        this._state = value;
        if (this._state === "IN_PROCESS" /* IN_PROCESS */)
            return;
        // do smth on game end
        clearTimeout(this.gameoverTimeoutHandler);
        this.board.revealMap();
        const status = value === "LOSS" /* LOSS */
            ? "Loss \uD83D\uDD25" /* LOSS */
            : "Win \uD83D\uDE0E" /* WIN */;
        statusBar.status = status;
    }
    cleanup() {
        this.root.style.display = 'none';
        clearTimeout(this.gameoverTimeoutHandler);
        for (const row of this.layer) {
            for (const elem of row) {
                elem.remove();
            }
        }
    }
    clickBoard(event, type, pos) {
        if (this.state !== "IN_PROCESS" /* IN_PROCESS */)
            return;
        if (type === 'left') {
            this.board.defuse(pos);
        }
        else {
            event.preventDefault();
            this.board.toggleFlag(pos);
        }
        this.state = this.board.checkGameState();
    }
}
