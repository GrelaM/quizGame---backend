import { RequestHandler } from 'express'
import { getDb } from '../database/mongodb'
import { ObjectId } from 'mongodb'

export const singleGameResultsHandler: RequestHandler = (req, res, next) => {
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
      const questions = game.totalQuestionNumber
      const correctAnswers = game.correctAnswers
      const points = game.points

      res.status(200).json({
        message: 'This game is ended!',
        points: points,
        givenCorrectAnswers: correctAnswers,
        totalQuestionNumber: questions
      })
    })
    .then(() => {
      db.collection('games').updateOne(
        { _id: gameId },
        {
          $set: { gameStatus: false, finishedAt: new Date() }
        }
      )
    })
    .catch((err) => {
      console.log(err)
      res.status(500).json({
        message: 'Server error...'
      })
    })
}
