import { Board, BoardLayer, createBoardLayer, Position } from "./board.js";
import { clock, Status, statusBar } from "./interface.js";

export const enum GameState {
  IN_PROCESS = 'IN_PROCESS',
  WIN = 'WIN',
  LOSS = 'LOSS',
}

export default class Game {

  private _state = GameState.IN_PROCESS

  private get state() {
    return this._state
  }

  private set state(value: GameState) {
    this._state = value
    if(this._state === GameState.IN_PROCESS)
      return
    
    // do smth on game end
    clearTimeout(this.gameoverTimeoutHandler)
    this.board.revealMap()
    const status = value === GameState.LOSS
      ? Status.LOSS
      : Status.WIN
    statusBar.status = status
  }

  private board: Board
  private layer: BoardLayer
  
  private gameoverTimeoutHandler: number

  constructor(
    private readonly root: HTMLElement,
    boardSize: number,
    bombsAmount: number,
    timeoutSeconds: number,
  ) {

    this.layer = createBoardLayer(root, boardSize)
    this.board = new Board(boardSize, bombsAmount, this.layer)

    for(let row = 0; row < boardSize; row++) {
      for(let col = 0; col < boardSize; col++) {
        const pos: Position = [row, col]
        const cell = this.layer[row][col]
        cell.onclick = evt => this.clickBoard(evt, 'left', pos)
        cell.oncontextmenu = evt => this.clickBoard(evt, 'right', pos)
      }
    }

    root.style.display = 'grid'

    clock.start(timeoutSeconds)
    this.gameoverTimeoutHandler = setTimeout(() => {
      if(this.state === GameState.IN_PROCESS) {
        this.state = GameState.LOSS
      }
    }, timeoutSeconds * 1000)
    
    statusBar.status = Status.IN_PROCESS

    const newGameBtn = document.getElementById('menu__start')!
    const handler = () => {
      this.cleanup()
      newGameBtn.removeEventListener('click', handler)
    }
    newGameBtn.addEventListener('click', handler)
  }

  public cleanup() {
    this.root.style.display = 'none'
    clearTimeout(this.gameoverTimeoutHandler)
    for(const row of this.layer) {
      for(const elem of row) {
        elem.remove()
      }
    }
  }

  private clickBoard(event: MouseEvent, type: 'left' | 'right', pos: Position) {
    if(this.state !== GameState.IN_PROCESS) return
    if(type === 'left') {
      this.board.defuse(pos)
    } else {
      event.preventDefault()
      this.board.toggleFlag(pos)
    }

    this.state = this.board.checkGameState()
  }
}