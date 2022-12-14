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

export function randomIntUpto(max: number) {
  return Math.floor(max * Math.random())
}

export function randomElements<T>(array: T[], amount = 1) {
  const notChosenIdxs = array.map((_, idx) => idx)
  const chosenIdxs = []
  for(let i = 0; i < amount && notChosenIdxs.length > 0; i++) {
    const chosen = removeRandom(notChosenIdxs)
    chosenIdxs.push(chosen)
  }
  return chosenIdxs.map(i => array[i])
}

export function removeRandom<T>(array: T[]) {
  const index = randomIntUpto(array.length)
  const value = array[index]
  array.splice(index, 1)
  return value
}

export function delay(time: number) {
  return new Promise<void>(resolve => {
    setTimeout(resolve, time)
  })
}

export class Timer {

  private lastStartTime!: number
  private elapsedTime = 0
  private handle: number | undefined
  private stopped = true

  constructor(
    private readonly func: Function,
    private readonly totalTime: number,
    private readonly repetitive = false  
  ) {
    this.execute = this.execute.bind(this)
  }

  private addDeltaTime() {
    const delta = Date.now() - this.lastStartTime
    this.elapsedTime += delta
  }

  private execute() {
    this.stopped = true
    this.func()
    this.addDeltaTime()
    if(this.repetitive) this.start()
  }

  public start() {
    if(!this.stopped) return
    this.stopped = false
    this.lastStartTime = Date.now()

    const timeout = this.totalTime - this.elapsedTime
    if(timeout <= 0) {
      this.elapsedTime = 0
      this.handle = setTimeout(this.execute, this.totalTime)
    } else {
      this.handle = setTimeout(this.execute, timeout)
    }
  }

  public stop() {
    if(this.stopped) return
    this.stopped = true

    clearTimeout(this.handle)
    this.addDeltaTime()
  }

  public rewind() {
    this.stop()
    this.elapsedTime = 0
  }

}
