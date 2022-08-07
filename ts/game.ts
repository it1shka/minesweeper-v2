import { Board, BoardLayer, createBoardLayer, Position } from "./board.js";

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
    // CONTINUE...
    this.board.revealMap()
  }

  private board: Board
  private layer: BoardLayer

  constructor(
    root: HTMLElement,
    boardSize: number,
    bombsAmount: number,
    timeout: number,
  ) {
    setTimeout(() => {
      if(this.state === GameState.IN_PROCESS) {
        this.state = GameState.LOSS
      }
    }, timeout)

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
  }

  public cleanup() {
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