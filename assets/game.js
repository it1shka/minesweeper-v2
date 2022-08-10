import { Board, createBoardLayer } from "./board.js";
import { clock, statusBar } from "./interface.js";
import { Timer } from "./utils.js";
export default class Game {
    constructor(root, boardSize, bombsAmount, timeoutSeconds) {
        this.root = root;
        this.timeoutSeconds = timeoutSeconds;
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
        statusBar.status = "Active \uD83E\uDD78" /* IN_PROCESS */;
        clock.time = timeoutSeconds;
        this.paused = false;
        this.bindInterfaceToGame();
    }
    get state() {
        return this._state;
    }
    set state(value) {
        var _a;
        this._state = value;
        if (this._state === "IN_PROCESS" /* IN_PROCESS */)
            return;
        // do smth on game end
        (_a = this.gameoverTimer) === null || _a === void 0 ? void 0 : _a.stop();
        clock.stop();
        this.board.revealMap();
        const status = value === "LOSS" /* LOSS */
            ? "Loss \uD83D\uDD25" /* LOSS */
            : "Win \uD83D\uDE0E" /* WIN */;
        statusBar.status = status;
    }
    bindInterfaceToGame() {
        const openMenu = document.getElementById('open-menu');
        const closeMenu = document.getElementById('menu__close');
        this.togglePause = this.togglePause.bind(this);
        [openMenu, closeMenu].forEach(btn => {
            btn.addEventListener('click', this.togglePause);
        });
        const newGameBtn = document.getElementById('menu__start');
        const handler = () => {
            this.cleanup();
            newGameBtn.removeEventListener('click', handler);
            [openMenu, closeMenu].forEach(btn => {
                btn.removeEventListener('click', this.togglePause);
            });
        };
        newGameBtn.addEventListener('click', handler);
    }
    togglePause() {
        if (!this.gameoverTimer)
            return;
        if (this.paused) {
            clock.start();
            this.gameoverTimer.start();
            this.paused = false;
        }
        else {
            clock.stop();
            this.gameoverTimer.stop();
            this.paused = true;
        }
    }
    cleanup() {
        var _a;
        this.root.style.display = 'none';
        (_a = this.gameoverTimer) === null || _a === void 0 ? void 0 : _a.stop();
        clock.stop();
        for (const row of this.layer) {
            for (const elem of row) {
                elem.remove();
            }
        }
    }
    clickBoard(event, type, pos) {
        if (this.state !== "IN_PROCESS" /* IN_PROCESS */)
            return;
        if (!this.gameoverTimer) {
            clock.start(this.timeoutSeconds);
            this.gameoverTimer = new Timer(() => {
                this.state = "LOSS" /* LOSS */;
            }, (this.timeoutSeconds + 1) * 1000);
            this.gameoverTimer.start();
        }
        if (type === 'left') {
            this.board.defuse(pos)
                .then(() => {
                this.state = this.board.checkGameState();
            });
        }
        else {
            event.preventDefault();
            this.board.toggleFlag(pos);
            this.state = this.board.checkGameState();
        }
    }
}
