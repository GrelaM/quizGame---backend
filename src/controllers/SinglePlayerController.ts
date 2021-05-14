import { RequestHandler } from 'express'
import { getDb } from '../database/mongodb'
import { ObjectId } from 'mongodb'
import { AnswerObject } from '../constants/Interfaces'

export const singleGameQuestionHandler: RequestHandler = (req, res, next) => {
  const gameId = new ObjectId(req.params.gameid)
  const db = getDb()

  db.collection('games')
    .findOne({ _id: gameId })
    .then((data) => {
      if (!data) {
        res.status(404).json({
          message: 'This game does not exist!'
        })
      }
      return data
    })
    .then((game) => {
      const question = game.questions[game.givenAnswers]
      let hintsArray: string[] = []
      hintsArray.push(question.Hint_1, question.Hint_2, question.Hint_3)

      let status = true
      if (game.givenAnswers === game.questionsTotalNumber - 1) {
        status = false
      }
      
      const answersSortedArray = sortArrayHandler(
        question.Correct,
        question.Incorrect_1,
        question.Incorrect_2,
        question.Incorrect_3
      )

      const data = {
        category: question.Category,
        questionNumber: game.givenAnswers + 1, // Answers begin with 0...
        question: question.Question,
        hints: hintsArray,
        answers: answersSortedArray,
        gameStatus: status
      }

      res.status(200).json({
        message: 'This is your game data.',
        question: data
      })
    })
    .catch((err) => {
      console.log(err)
      res.status(500).json({
        message: 'Server error...'
      })
    })
}

export const singleGameAnswerHandler: RequestHandler = (req, res, next) => {
  const gameId = new ObjectId(req.params.gameid)
  const currentQuestionObjIndex = +req.params.question
  const passedAnswer: AnswerObject = {code: req.body.code, value: req.body.value}
  
  const db = getDb()

  db.collection('games')
    .findOne({ _id: gameId })
    .then((data) => {
      if (!data) {
        res.status(404).json({
          message: 'We could not check the answer. Game does not exist!'
        })
      }
      return data
    })
    .then((game) => {
      let data
      if (
        passedAnswer.code === 0 &&
        passedAnswer.value === game.questions[currentQuestionObjIndex].Correct
      ) {
        data = {
          givenAnswers: 1,
          correctAnswers: 1,
          points: 1
        }
      } else {
        data = { givenAnswers: 1, incorrectAnswers: 1 }
      }

      db.collection('games')
        .updateOne(
          { _id: gameId },
          {
            $inc: data
          }
        )
        .then(() => {
          res.status(200).json({
            message: 'Answer has been accepted.',
            status: true
          })
        })
        .catch((err) => console.log(err))
    })
    .catch((err) => {
      console.log(err)
      res.status(500).json({
        message: 'Server error...'
      })
    })
}

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

// VALIDATION OF BODY???
