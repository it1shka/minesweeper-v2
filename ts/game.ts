import { Board, BoardLayer, createBoardLayer, Position } from "./board.js";
import { clock, Status, statusBar } from "./interface.js";
import { Timer } from "./utils.js";

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
    this.gameoverTimer?.stop()
    clock.stop()
    this.board.revealMap()
    const status = value === GameState.LOSS
      ? Status.LOSS
      : Status.WIN
    statusBar.status = status
  }

  private board: Board
  private layer: BoardLayer
  private gameoverTimer: Timer | undefined
  private paused: boolean

  constructor(
    private readonly root: HTMLElement,
    boardSize: number,
    bombsAmount: number,
    private readonly timeoutSeconds: number,
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
    statusBar.status = Status.IN_PROCESS
    clock.time = timeoutSeconds
    this.paused = false

    this.bindInterfaceToGame()
  }

  private bindInterfaceToGame() {
    const openMenu = document.getElementById('open-menu')!
    const closeMenu = document.getElementById('menu__close')!

    this.togglePause = this.togglePause.bind(this);
    [openMenu, closeMenu].forEach(btn => {
      btn.addEventListener('click', this.togglePause)
    });

    const newGameBtn = document.getElementById('menu__start')!
    const handler = () => {
      this.cleanup()
      newGameBtn.removeEventListener('click', handler);
      [openMenu, closeMenu].forEach(btn => {
        btn.removeEventListener('click', this.togglePause)
      })
    }
    newGameBtn.addEventListener('click', handler)
  }

  private togglePause() {
    if(!this.gameoverTimer) return

    if(this.paused) {
      clock.start()
      this.gameoverTimer.start()
      this.paused = false
    } else {
      clock.stop()
      this.gameoverTimer.stop()
      this.paused = true
    }
  }

  public cleanup() {
    this.root.style.display = 'none'
    this.gameoverTimer?.stop()
    clock.stop()
    for(const row of this.layer) {
      for(const elem of row) {
        elem.remove()
      }
    }
  }

  private clickBoard(event: MouseEvent, type: 'left' | 'right', pos: Position) {
    if(this.state !== GameState.IN_PROCESS) return

    if(!this.gameoverTimer) {
      clock.start(this.timeoutSeconds)
      this.gameoverTimer = new Timer(() => {
        this.state = GameState.LOSS
      }, (this.timeoutSeconds + 1) * 1000)
      this.gameoverTimer.start()
    }

    if(type === 'left') {
      this.board.defuse(pos)
        .then(() => {
          this.state = this.board.checkGameState()
        })
    } else {
      event.preventDefault()
      this.board.toggleFlag(pos)
      this.state = this.board.checkGameState()
    }
  }
}