import { QuestionObject } from '../constants/Interfaces'
import { getDb } from '../database/mongodb'
import idGenerator from '../function/idGenerator'

export default class Game {
  roomId: string
  questionsTotalNumber: number
  questions: QuestionObject[]
  givenAnswers: number
  user: {
    nickname: string
    correctAnswers: number
    incorrectAnswers: number
    lastTwoAnswers: number
    points: number
  }[]
  gameStatus: boolean
  timer: number
  establishedAt: Date

  constructor(
    questionsTotalNumber: number,
    questions: QuestionObject[],
    timer: number,
    idLength: number
  ) {
    this.roomId = idGenerator(idLength)
    this.questionsTotalNumber = questionsTotalNumber
    this.questions = questions
    this.givenAnswers = 0
    this.user = []
    this.gameStatus = true
    this.timer = timer
    this.establishedAt = new Date()
  }

  save() {
    const db = getDb()

    return db
      .collection('multiplayer-games')
      .insertOne(this)
      .then((result) => {
        const newGame = result.ops[0]
        return newGame
      })
      .catch((err) => console.log(err))
  }
}
