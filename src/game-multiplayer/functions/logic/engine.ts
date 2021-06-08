import { Game } from '../../../constants/Interfaces'

const engine = (ms: number, localGameStatus: Game) =>
  new Promise((resolve) => {
    const engineTimer: number = (ms * 1000) + 1000 // SHOULD IT BE?!
    const timer = setTimeout(() => {
      resolve(true)
      clearTimeout(timer)
      clearInterval(answerLengthCheck)
    }, engineTimer)
    const answerLengthCheck = setInterval(() => {
      if (localGameStatus.players.length === localGameStatus.receivedAnswers) {
        resolve(true)
        clearTimeout(timer)
        clearInterval(answerLengthCheck)
      }
    }, 200)
  })

export default engine
