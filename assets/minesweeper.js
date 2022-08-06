var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getRandomElements, nearest, positionsContain } from "./utils.js";
class Minesweeper {
    constructor(size, bombsAmount, timeout) {
        this.size = size;
        this.bombsAmount = bombsAmount;
        this.flags = [];
        this.bombs = [];
        this.firstTouch = true;
        this.state = "IN_PROCESS" /* IN_PROCESS */;
        setTimeout(() => {
            if (this.state === "IN_PROCESS" /* IN_PROCESS */)
                this.state = "LOSS" /* LOSS */;
        }, timeout);
        this.countmap = new Array(size);
        for (let row = 0; row < size; row++) {
            this.countmap[row] = new Array(size).fill(0);
        }
    }
    setupBoard(touch) {
        const maybeBombs = [];
        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                if (touch[0] === row && touch[1] === col)
                    continue;
                maybeBombs.push([row, col]);
            }
        }
        this.bombs = getRandomElements(maybeBombs, this.bombsAmount);
        for (const bomb of this.bombs) {
            for (const pos of nearest(bomb)) {
                if (!this.validPos(pos))
                    continue;
                const [r, c] = pos;
                this.countmap[r][c]++;
            }
        }
    }
    validPos([r, c]) {
        return r >= 0 && r < this.size && c >= 0 && c < this.size;
    }
    toggleFlag(pos) {
        if (this.state !== "IN_PROCESS" /* IN_PROCESS */)
            return;
        if (this.firstTouch)
            return;
        if (positionsContain(this.flags, pos)) {
            const flagIndex = this.flags.findIndex(([r, c]) => {
                return r === pos[0] && c === pos[1];
            });
            this.flags.splice(flagIndex, 1);
            return;
        }
        this.flags.push(pos);
    }
    defuse(pos) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.state !== "IN_PROCESS" /* IN_PROCESS */)
                return;
            if (positionsContain(this.flags, pos))
                return;
            if (this.firstTouch) {
                this.firstTouch = false;
                this.setupBoard(pos);
            }
            if (this.)
                ;
        });
    }
}
