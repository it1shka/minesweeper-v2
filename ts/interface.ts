import { Timer } from "./utils.js"

class Clock {

  private _clock: HTMLElement
  private _time: number = 0
  private _timer: Timer

  public get time() {
    return this._time
  }

  public set time(value: number) {
    this._time = value
    this._clock.innerText = Clock.formatTime(value)
  }

  constructor() {
    this._clock = document.getElementById('clock')!
    this.time = 0
    this.tick = this.tick.bind(this)
    this._timer = new Timer(this.tick, 1000, true)
  }

  public start(time?: number) {
    if(time) {
      this.time = time
      this._timer.rewind()
    }
    this._timer.start()
  }

  public stop() {
    this._timer.stop()
  }

  private tick() {
    if(this.time <= 0) {
      this.stop()
      return
    }

    this.time--
  }

  public static formatTime(time: number) {
    const date = new Date(0)
    date.setSeconds(time)
    const timestr = date.toISOString()
    return timestr.substring(14, 19)
  }

}
export const clock = new Clock()

export const enum Status {
  IN_PROCESS = 'Active 🥸',
  LOSS = 'Loss 🔥',
  WIN = 'Win 😎'
}

class StatusBar {

  private _statusbar: HTMLElement
  private _status: Status = Status.IN_PROCESS

  public get status() {
    return this._status
  }

  public set status(value: Status) {
    this._status = value
    this._statusbar.innerText = value
  }

  constructor() {
    this._statusbar = document.getElementById('status')!
    this.status = Status.IN_PROCESS
  }

}
export const statusBar = new StatusBar()

class Menu {

  private _root: HTMLElement

  constructor() {
    this._root = document.getElementById('menu')!
    this.open = this.open.bind(this)
    this.close = this.close.bind(this)

    const openBtn = document.getElementById('open-menu')!
    openBtn.onclick = this.open
    // const closeBtn = document.getElementById('menu__close')!
    // closeBtn.onclick = this.close
    const btns = this._root.querySelectorAll('button')
    for(const button of Array.from(btns)) {
      button.onclick = this.close
    }
  }

  private open() {
    this._root.style.transform = 'translateX(0%)'
  }

  private close() {
    this._root.style.transform = 'translateX(-100%)'
  }
}
export const menu = new Menu()

class StartGameForm {

  private _form: HTMLFormElement
  private _boardsize!: HTMLInputElement
  private _bombsamount!: HTMLInputElement
  private _timeout!: HTMLInputElement

  constructor() {
    const formId = 'new-game-form'
    this._form = document.getElementById(formId) as HTMLFormElement
    this.open = this.open.bind(this)
    this.close = this.close.bind(this)

    this._form.querySelector('button')!
      .addEventListener('click', this.close)
    
    document.getElementById('menu__start')!
      .addEventListener('click', this.open)

    this._boardsize = this.findInput('boardsize_inp')
    this._bombsamount = this.findInput('bombsamount_inp')
    this._timeout = this.findInput('timeout_inp')
  }

  public get boardSize() {
    return Number(this._boardsize.value)
  }

  public get bombsAmount() {
    return Number(this._bombsamount.value)
  }

  public get timeout() {
    return Number(this._timeout.value)
  }

  private findInput(id: string) {
    const input = this._form
      .querySelector(`#${id}`) as
        HTMLInputElement
    if(!input) {
      throw new Error(`${id} input not found!`)
    }
    return input
  }

  private open() {
    this._form.style.display = 'flex'
  }

  private close() {
    this._form.style.display = 'none'
  }
}
export const startForm = new StartGameForm()