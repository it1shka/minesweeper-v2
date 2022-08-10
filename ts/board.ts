import { GameState } from "./game.js"
import { delay, initMatrix, nearest, posEq, randomElements, randomIntUpto, removeRandom } from "./utils.js"

export type BoardLayer = HTMLElement[][]

export function createBoardLayer(root: HTMLElement, size: number) {
  const tmpl = `repeat(${size}, 1fr)`
  root.style.gridTemplateRows = tmpl
  root.style.gridTemplateColumns = tmpl
  const board: BoardLayer = new Array(size)
  for(let row = 0; row < size; row++) {
    board[row] = new Array(size)
    for(let col = 0; col < size; col++) {
      const cell = document.createElement('div')
      cell.className = CellState.FOG
      root.appendChild(cell)
      board[row][col] = cell
    }
  }
  return board
}

const enum CellState {
  FOG   = 'fog',
  EMPTY = 'empty',
  FLAG  = 'flag' ,
  BOMB  = 'bomb' ,
}

export type Position = readonly [number, number]

export class Board {

  private countmap: number[][]
  private flagmap: boolean[][]
  private bombmap: boolean[][]
  private fog: boolean[][]

  private firstTouch = true

  constructor(
    private readonly size: number,
    private readonly bombsAmount: number,
    private readonly layer: BoardLayer,
  ){
    this.countmap = initMatrix(0, size)
    this.flagmap = initMatrix(false, size)
    this.bombmap = initMatrix(false, size)
    this.fog = initMatrix(true, size)
  }

  public defuse(position: Position) {
    if(this.firstTouch) {
      this.randomizeMap(position)
      this.firstTouch = false
    }
    this.reveal(position)
    
    const visited = initMatrix(false, this.size)
    visited[position[0]][position[1]] = true
    const container: Position[] = [position]
    
    const toReveal: Position[] = []

    while(container.length > 0) {
      const current = container.pop()!
      const [row, col] = current
      if(this.countmap[row][col] > 0 || 
        this.bombmap[row][col] || 
        this.flagmap[row][col])
        continue
      for(const pos of nearest(current)) {
        const [r, c] = pos
        if(!this.validPos(pos) || visited[r][c]) continue
        visited[r][c] = true
        toReveal.push(pos)
        container.push(pos)
      }
    }

    // this.revealPositions(toReveal)
    return this.revealPositions(toReveal)
  }

  public toggleFlag([row, col]: Position) {
    if(this.firstTouch || !this.fog[row][col]) return
    const flag = !this.flagmap[row][col]
    this.flagmap[row][col] = flag
    const state = flag ? CellState.FLAG : CellState.FOG 
    this.layer[row][col].className = state
  }

  public checkGameState(): GameState {
    let bombs = 0, matchedFlags = 0, openedWithoutBombs = 0

    for(let row = 0; row < this.size; row++) {
      for(let col = 0; col < this.size; col++) {

        if(this.bombmap[row][col]) {
          if(!this.fog[row][col]) 
            return GameState.LOSS
          bombs++
          if(this.flagmap[row][col]) 
            matchedFlags++
        } else if(!this.fog[row][col]) {
          openedWithoutBombs++
        }

      }
    }

    if(bombs === matchedFlags) return GameState.WIN
    if(openedWithoutBombs + bombs === this.size ** 2) return GameState.WIN
    return GameState.IN_PROCESS
  }

  public revealMap() {
    if(this.firstTouch) {
      const pos: Position = [randomIntUpto(this.size), randomIntUpto(this.size)]
      this.randomizeMap(pos)
      this.firstTouch = false
    }

    const rest: Position[] = []
    for(let row = 0; row < this.size; row++) {
      for(let col = 0; col < this.size; col++) {
        if(this.fog[row][col]) rest.push([row, col])
      }
    }
    this.revealPositions(rest)
  }

  private async revealPositions(positions: Position[]) {
    while(positions.length > 0) {
      await delay(2);
      const pos = removeRandom(positions)
      this.reveal(pos)
    }
  }

  private randomizeMap(touch: Position) {
    const maybeBombs: Position[] = []

    for(let row = 0; row < this.size; row++) {
      for(let col = 0; col < this.size; col++) {
        // EXCLUDING ONLY CURRENT TOUCH
        const maybeBomb: Position = [row, col]
        // if(posEq(maybeBomb, touch)) continue
        
        // SOLUTION 2: EXCLUDING A SQUARE AROUND
        const [trow, tcol] = touch
        if(row >= trow - 1 && 
           row <= trow + 1 && 
           col >= tcol - 1 && 
           col <= tcol + 1) {
          continue
        }
        maybeBombs.push(maybeBomb)
      }
    }

    const bombs = randomElements(maybeBombs, this.bombsAmount)

    for(const [row, col] of bombs) {
      this.bombmap[row][col] = true
      for(const [r, c] of nearest([row, col])) {
        if(!this.validPos([r, c])) continue
        this.countmap[r][c]++
      }
    }

  }

  private validPos([r, c]: Position) {
    return r >= 0 && c >= 0 && r < this.size && c < this.size
  }

  private reveal([row, col]: Position) {
    if(this.flagmap[row][col] || !this.fog[row][col]) return
    this.fog[row][col] = false
    const cell = this.layer[row][col]
    if(this.bombmap[row][col]) {
      cell.className = CellState.BOMB
    } else {
      cell.className = CellState.EMPTY
      const value = this.countmap[row][col]
      if(value > 0) {
        cell.textContent = String(value)
      }
    }
  }

}