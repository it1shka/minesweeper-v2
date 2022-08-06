import { Position } from "./board.js"

export function initMatrix<T>(value: T, size: number) {
  const output: T[][] = new Array(size)
  for(let row = 0; row < size; row++) {
    output[row] = new Array(size).fill(value)
  }
  return output
}

export function posEq([r1, c1]: Position, [r2, c2]: Position) {
  return r1 === r2 && c1 === c2
}

export function nearest([row, col]: Position) {
  const output: Position[] = []
  for(let r = row - 1; r <= row + 1; r++) {
    for(let c = col - 1; c <= col + 1; c++) {
      if(r === row && c === col) continue
      output.push([r, c])
    }
  }
  return output
}

export function randomElements<T>(array: T[], amount = 1) {
  const notChosenIdxs = array.map((_, idx) => idx)
  const chosenIdxs = []
  for(let i = 0; i < amount && notChosenIdxs.length > 0; i++) {
    // const index = Math.floor(notChosenIdxs.length * Math.random())
    // chosenIdxs.push(notChosenIdxs[index])
    // notChosenIdxs.splice(index, 1)
    const chosen = removeRandom(notChosenIdxs)
    chosenIdxs.push(chosen)
  }
  return chosenIdxs.map(i => array[i])
}

export function removeRandom<T>(array: T[]) {
  const index = Math.floor(array.length * Math.random())
  const value = array[index]
  array.splice(index, 1)
  return value
}

export function delay(time: number) {
  return new Promise<void>(resolve => {
    setTimeout(resolve, time)
  })
}
