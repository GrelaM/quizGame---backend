import { RequestHandler } from 'express'
import { getDb } from '../../database/mongodb'
import { ObjectId } from 'mongodb'
import { AnswerObject } from '../../constants/Interfaces'
import DbCollections from '../../constants/Collections'

export const singleGameQuestionHandler: RequestHandler = async (
  req,
  res,
  next
) => {
  const gameId = new ObjectId(req.params.gameid)
  const db = getDb()

  try {
    const singleGame = await db.collection(DbCollections.SINGLEPLAYER_GAMES).findOne({ _id: gameId })

    if (!singleGame) {
      res.status(404).json({
        message: 'Sorry. This game does not exist!'
      })
    }

    const question = singleGame.questions[singleGame.givenAnswers]
    let hintsArray: string[] = []
    hintsArray.push(question.Hint_1, question.Hint_2, question.Hint_3)

    let status = true
    if (singleGame.givenAnswers === singleGame.questionsTotalNumber - 1) {
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
      questionNumber: singleGame.givenAnswers + 1, // Answers begin with 0...
      question: question.Question,
      hints: hintsArray,
      answers: answersSortedArray,
      gameStatus: status
    }

    res.status(200).json({
      message: 'We successfully fetched your data.',
      question: data
    })
  } catch (e) {
    res.status(500).json({
      message: 'We sincerely apologize. Server faced some issues.'
    })
  }
}

export const singleGameAnswerHandler: RequestHandler = async (
  req,
  res,
  next
) => {
  const db = getDb()
  const gameId = new ObjectId(req.params.gameid)
  const currentQuestionObjIndex = +req.params.question
  const passedAnswer: AnswerObject = {
    code: req.body.code,
    value: req.body.value
  }

  try {
    const singleGame = await db.collection(DbCollections.SINGLEPLAYER_GAMES).findOne({ _id: gameId })

    if (!singleGame) {
      res.status(404).json({
        message:
          'Sorry. We could not check the answer. This game does not exist!'
      })
    }

    let data
    if (
      passedAnswer.code === 0 &&
      passedAnswer.value ===
        singleGame.questions[currentQuestionObjIndex].Correct
    ) {
      data = {
        givenAnswers: 1,
        correctAnswers: 1,
        points: 1
      }
    } else {
      data = { givenAnswers: 1, incorrectAnswers: 1 }
    }

    const answer = await db.collection(DbCollections.SINGLEPLAYER_GAMES).updateOne(
      { _id: gameId },
      {
        $inc: data
      }
    )

    if (answer) {
      res.status(200).json({
        message: 'Answer has been accepted.',
        status: true
      })
    }
  } catch (e) {
    res.status(500).json({
      message: 'We sincerely apologize. Server faced some issues.'
    })
  }
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
