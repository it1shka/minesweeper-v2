function fmtime(time) {
    const date = new Date(0);
    date.setSeconds(time);
    const timestr = date.toISOString();
    return timestr.substring(14, 19);
}
export function createClock(timeout) {
    const clock = document.getElementById('clock');
    clock.innerText = fmtime(timeout);
    let currentTime = timeout;
    const interval = setInterval(() => {
        currentTime--;
        if (currentTime <= 0) {
            clearInterval(interval);
        }
        clock.innerText = fmtime(currentTime);
    }, 1000);
}
