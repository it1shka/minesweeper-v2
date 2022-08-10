import { Timer } from "./utils.js";
class Clock {
    constructor() {
        this._time = 0;
        this._clock = document.getElementById('clock');
        this.time = 0;
        this.tick = this.tick.bind(this);
        this._timer = new Timer(this.tick, 1000, true);
    }
    get time() {
        return this._time;
    }
    set time(value) {
        this._time = value;
        this._clock.innerText = Clock.formatTime(value);
    }
    start(time) {
        if (time) {
            this.time = time;
            this._timer.rewind();
        }
        this._timer.start();
    }
    stop() {
        this._timer.stop();
    }
    tick() {
        if (this.time <= 0) {
            this.stop();
            return;
        }
        this.time--;
    }
    static formatTime(time) {
        const date = new Date(0);
        date.setSeconds(time);
        const timestr = date.toISOString();
        return timestr.substring(14, 19);
    }
}
export const clock = new Clock();
class StatusBar {
    constructor() {
        this._status = "Active \uD83E\uDD78" /* IN_PROCESS */;
        this._statusbar = document.getElementById('status');
        this.status = "Active \uD83E\uDD78" /* IN_PROCESS */;
    }
    get status() {
        return this._status;
    }
    set status(value) {
        this._status = value;
        this._statusbar.innerText = value;
    }
}
export const statusBar = new StatusBar();
class Menu {
    constructor() {
        this._root = document.getElementById('menu');
        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
        const openBtn = document.getElementById('open-menu');
        openBtn.onclick = this.open;
        // const closeBtn = document.getElementById('menu__close')!
        // closeBtn.onclick = this.close
        const btns = this._root.querySelectorAll('button');
        for (const button of Array.from(btns)) {
            button.onclick = this.close;
        }
    }
    open() {
        this._root.style.transform = 'translateX(0%)';
    }
    close() {
        this._root.style.transform = 'translateX(-100%)';
    }
}
export const menu = new Menu();
class StartGameForm {
    constructor() {
        const formId = 'new-game-form';
        this._form = document.getElementById(formId);
        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
        this._form.querySelector('button')
            .addEventListener('click', this.close);
        document.getElementById('menu__start')
            .addEventListener('click', this.open);
        this._boardsize = this.findInput('boardsize_inp');
        this._bombsamount = this.findInput('bombsamount_inp');
        this._timeout = this.findInput('timeout_inp');
    }
    get boardSize() {
        return Number(this._boardsize.value);
    }
    get bombsAmount() {
        return Number(this._bombsamount.value);
    }
    get timeout() {
        return Number(this._timeout.value);
    }
    findInput(id) {
        const input = this._form
            .querySelector(`#${id}`);
        if (!input) {
            throw new Error(`${id} input not found!`);
        }
        return input;
    }
    open() {
        this._form.style.display = 'flex';
    }
    close() {
        this._form.style.display = 'none';
    }
}
export const startForm = new StartGameForm();
