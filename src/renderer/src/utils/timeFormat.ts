function pad(string): string {
  return ('0' + string).slice(-2)
}

function formatTime(seconds): string {
  if (isNaN(seconds)) {
    return `00:00`
  }

  const date = new Date(seconds * 1000)
  const hh = date.getUTCHours()
  const mm = date.getUTCMinutes()
  const ss = pad(date.getUTCSeconds())

  if (hh) {
    return `${hh}:${pad(mm)}:${ss}`
  }

  return `${mm}:${ss}`
}

export default formatTime
