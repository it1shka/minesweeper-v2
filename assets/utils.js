export function initMatrix(value, size) {
    const output = new Array(size);
    for (let row = 0; row < size; row++) {
        output[row] = new Array(size).fill(value);
    }
    return output;
}
export function posEq([r1, c1], [r2, c2]) {
    return r1 === r2 && c1 === c2;
}
export function nearest([row, col]) {
    const output = [];
    for (let r = row - 1; r <= row + 1; r++) {
        for (let c = col - 1; c <= col + 1; c++) {
            if (r === row && c === col)
                continue;
            output.push([r, c]);
        }
    }
    return output;
}
export function randomIntUpto(max) {
    return Math.floor(max * Math.random());
}
export function randomElements(array, amount = 1) {
    const notChosenIdxs = array.map((_, idx) => idx);
    const chosenIdxs = [];
    for (let i = 0; i < amount && notChosenIdxs.length > 0; i++) {
        const chosen = removeRandom(notChosenIdxs);
        chosenIdxs.push(chosen);
    }
    return chosenIdxs.map(i => array[i]);
}
export function removeRandom(array) {
    const index = randomIntUpto(array.length);
    const value = array[index];
    array.splice(index, 1);
    return value;
}
export function delay(time) {
    return new Promise(resolve => {
        setTimeout(resolve, time);
    });
}
