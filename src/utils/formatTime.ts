export function formatTime(timeInSeconds: number) {

  const minutes = Math.floor(timeInSeconds / 60)
  const seconds = timeInSeconds % 60

  if (seconds < 10) {
    return `${minutes}:0${seconds}`
  } else {
    return `${minutes}:${seconds}`
  }
}