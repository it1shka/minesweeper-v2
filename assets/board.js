var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { delay, initMatrix, nearest, randomElements, removeRandom } from "./utils.js";
export function createBoardLayer(root, size) {
    const tmpl = `repeat(${size}, 1fr)`;
    root.style.gridTemplateRows = tmpl;
    root.style.gridTemplateColumns = tmpl;
    const board = new Array(size);
    for (let row = 0; row < size; row++) {
        board[row] = new Array(size);
        for (let col = 0; col < size; col++) {
            const cell = document.createElement('div');
            cell.className = "fog" /* FOG */;
            root.appendChild(cell);
            board[row][col] = cell;
        }
    }
    return board;
}
export class Board {
    constructor(size, bombsAmount, layer) {
        this.size = size;
        this.bombsAmount = bombsAmount;
        this.layer = layer;
        this.firstTouch = true;
        this.countmap = initMatrix(0, size);
        this.flagmap = initMatrix(false, size);
        this.bombmap = initMatrix(false, size);
        this.fog = initMatrix(true, size);
    }
    defuse(position) {
        if (this.firstTouch) {
            this.randomizeMap(position);
            this.firstTouch = false;
        }
        this.reveal(position);
        const visited = initMatrix(false, this.size);
        visited[position[0]][position[1]] = true;
        const container = [position];
        const toReveal = [];
        while (container.length > 0) {
            const current = container.pop();
            const [row, col] = current;
            if (this.countmap[row][col] > 0 ||
                this.bombmap[row][col] ||
                this.flagmap[row][col])
                continue;
            for (const pos of nearest(current)) {
                const [r, c] = pos;
                if (!this.validPos(pos) || visited[r][c])
                    continue;
                visited[r][c] = true;
                toReveal.push(pos);
                container.push(pos);
            }
        }
        this.revealPositions(toReveal);
    }
    toggleFlag([row, col]) {
        if (this.firstTouch || !this.fog[row][col])
            return;
        const flag = !this.flagmap[row][col];
        this.flagmap[row][col] = flag;
        const state = flag ? "flag" /* FLAG */ : "fog" /* FOG */;
        this.layer[row][col].className = state;
    }
    checkGameState() {
        let bombs = 0, matchedFlags = 0, openedWithoutBombs = 0;
        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                if (this.bombmap[row][col]) {
                    if (!this.fog[row][col])
                        return "LOSS" /* LOSS */;
                    bombs++;
                    if (this.flagmap[row][col])
                        matchedFlags++;
                }
                else if (!this.fog[row][col]) {
                    openedWithoutBombs++;
                }
            }
        }
        if (bombs === matchedFlags)
            return "WIN" /* WIN */;
        if (openedWithoutBombs + bombs === this.size ** 2)
            return "WIN" /* WIN */;
        return "IN_PROCESS" /* IN_PROCESS */;
    }
    revealMap() {
        const rest = [];
        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                if (this.fog[row][col])
                    rest.push([row, col]);
            }
        }
        this.revealPositions(rest);
    }
    revealPositions(positions) {
        return __awaiter(this, void 0, void 0, function* () {
            while (positions.length > 0) {
                yield delay(2);
                const pos = removeRandom(positions);
                this.reveal(pos);
            }
        });
    }
    randomizeMap(touch) {
        const maybeBombs = [];
        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                // EXCLUDING ONLY CURRENT TOUCH
                const maybeBomb = [row, col];
                // if(posEq(maybeBomb, touch)) continue
                // SOLUTION 2: EXCLUDING A SQUARE AROUND
                const [trow, tcol] = touch;
                if (row >= trow - 1 &&
                    row <= trow + 1 &&
                    col >= tcol - 1 &&
                    col <= tcol + 1) {
                    continue;
                }
                maybeBombs.push(maybeBomb);
            }
        }
        const bombs = randomElements(maybeBombs, this.bombsAmount);
        for (const [row, col] of bombs) {
            this.bombmap[row][col] = true;
            for (const [r, c] of nearest([row, col])) {
                if (!this.validPos([r, c]))
                    continue;
                this.countmap[r][c]++;
            }
        }
    }
    validPos([r, c]) {
        return r >= 0 && c >= 0 && r < this.size && c < this.size;
    }
    reveal([row, col]) {
        if (this.flagmap[row][col] || !this.fog[row][col])
            return;
        this.fog[row][col] = false;
        const cell = this.layer[row][col];
        if (this.bombmap[row][col]) {
            cell.className = "bomb" /* BOMB */;
        }
        else {
            cell.className = "empty" /* EMPTY */;
            const value = this.countmap[row][col];
            if (value > 0) {
                cell.textContent = String(value);
            }
        }
    }
}
