function fmtime(time: number) {
  const date = new Date(0)
  date.setSeconds(time)
  const timestr = date.toISOString()
  return timestr.substring(14, 19)
}

export function createClock(timeout: number) {
  const clock = document.getElementById('clock')!
  clock.innerText = fmtime(timeout)
  let currentTime = timeout
  const interval = setInterval(() => {
    currentTime--
    if(currentTime <= 0) {
      clearInterval(interval)
    }
    clock.innerText = fmtime(currentTime)
  }, 1000)
  return interval
}

const statusElement = document.getElementById('status')!
export function setGameStatus(status: string) {
  statusElement.innerText = status
}