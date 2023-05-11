export function formatTime(timeInSeconds: number, displayHours: boolean) {
  let hours: number | string = Math.floor(timeInSeconds / 3600)
  const rest = timeInSeconds % 3600
  let minutes: number | string = Math.floor(rest / 60)
  let seconds: number | string = rest % 60

  if (hours < 10) {
    hours = `0${hours}`
  }
  if (minutes < 10 && displayHours) {
    minutes = `0${minutes}`
  }
  if (seconds < 10) {
    seconds = `0${seconds}`
  }

  if (displayHours) {
    return `${hours}:${minutes}:${seconds}`
  } else {
    return `${minutes}:${seconds}`
  }
}
