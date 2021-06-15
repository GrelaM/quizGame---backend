import { io } from '../../../app'
import SocketNames from '../../../constants/Sockets'
import { Player } from '../../../constants/Interfaces'
import { MultiplayerGameType } from '../../../constants/Interfaces'

export interface Question {
  category: string
  question: string
  difficulty: number
  hints: string[]
  answers: {
    code: number
    value: string
  }[]
}

const questionHandler = (
  data: { game: MultiplayerGameType; players: Player[] },
  roomId: string
) => {
  const hostData = {
    roomId: data.game.roomId,
    timer: data.game.timer,
    questionsLeft: data.game.questionsTotalNumber - data.game.givenAnswers
  }
  const playerData = {
    roomId: data.game.roomId,
    timer: data.game.timer,
    questionNumber: data.game.givenAnswers + 1,
    totalQuestions: data.game.questionsTotalNumber
  }

  const currentQuestion = data.game.questions[data.game.givenAnswers]
  const mergedHints = [
    currentQuestion.Hint_1,
    currentQuestion.Hint_2,
    currentQuestion.Hint_3
  ]
  const answersArray = sortArrayHandler(
    currentQuestion.Correct,
    currentQuestion.Incorrect_1,
    currentQuestion.Incorrect_2,
    currentQuestion.Incorrect_3
  )

  const payload: Question = {
    category: currentQuestion.Category,
    difficulty: currentQuestion.Difficulty,
    question: currentQuestion.Question,
    hints: mergedHints,
    answers: answersArray
  }

  io.to(roomId).emit(SocketNames.QUESTION, {
    host: hostData,
    playerData: playerData,
    questionUpdate: payload
  })
}

export default questionHandler

// HANDLERS
const sortArrayHandler = (
  correct: string,
  incorrect_1: string,
  incorrect_2: string,
  incorrect_3: string
) => {
  const primaryArray = [
    { code: 0, value: correct },
    { code: 1, value: incorrect_1 },
    { code: 2, value: incorrect_2 },
    { code: 3, value: incorrect_3 }
  ]
  const shuffeledArray = primaryArray.sort(() => Math.random() - 0.5)
  return shuffeledArray
}
