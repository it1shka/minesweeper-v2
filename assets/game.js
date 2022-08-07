import { Board, createBoardLayer } from "./board.js";
import { createClock } from "./interface.js";
export default class Game {
    constructor(root, boardSize, bombsAmount, timeoutSeconds) {
        this._state = "IN_PROCESS" /* IN_PROCESS */;
        createClock(timeoutSeconds);
        setTimeout(() => {
            if (this.state === "IN_PROCESS" /* IN_PROCESS */) {
                this.state = "LOSS" /* LOSS */;
            }
        }, timeoutSeconds * 1000);
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
    }
    get state() {
        return this._state;
    }
    set state(value) {
        this._state = value;
        if (this._state === "IN_PROCESS" /* IN_PROCESS */)
            return;
        // do smth on game end
        // CONTINUE...
        this.board.revealMap();
    }
    cleanup() {
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
