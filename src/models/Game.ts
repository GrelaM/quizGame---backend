import { QuestionObject } from '../constants/Interfaces'
import { getDb } from '../database/mongodb'
import idGenerator from '../function/idGenerator'

export default class Game {
  artificialGameId: string
  questionsTotalNumber: number
  questions: QuestionObject[]
  givenAnswers: number
  correctAnswers: number
  incorrectAnswers: number
  lastTwoAnswers: number
  points: number
  gameStatus: boolean
  timer: number
  establishedAt: Date

  constructor(
    questionsTotalNumber: number,
    questions: QuestionObject[],
    timer: number
  ) {
    this.artificialGameId = idGenerator(6)
    this.questionsTotalNumber = questionsTotalNumber
    this.questions = questions
    this.givenAnswers = 0
    this.correctAnswers = 0
    this.incorrectAnswers = 0
    this.lastTwoAnswers = 0
    this.points = 0
    this.gameStatus = true
    this.timer = timer
    this.establishedAt = new Date()
  }

  save() {
    const db = getDb()

    return db
      .collection('games')
      .insertOne(this)
      .then((result) => {
        const newGame = result.ops[0]
        return newGame
      })
      .catch((err) => console.log(err))
  }
}
