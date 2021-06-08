const triggerAfter = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export default triggerAfter