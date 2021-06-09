import { RequestHandler } from 'express'
import { getDb } from '../../database/mongodb'
import { ObjectId } from 'mongodb'
import LocalStorage from '../../data/LocalSettingsStorage'
import DbCollections from '../../constants/Collections'

export const singleGameResultsHandler: RequestHandler = async (
  req,
  res,
  next
) => {
  const settingsId = LocalStorage.databaseSettingsCollectionId
  const gameId = new ObjectId(req.params.gameid)
  const db = getDb()

  try {
    const game = await db
      .collection(DbCollections.SINGLEPLAYER_GAMES)
      .findOne({ _id: gameId })

    if (!game) {
      res.status(404).json({
        message: 'This game does not exist!',
        points: null,
        givenCorrectAnswers: null,
        questions: null
      })
    }

    const questions = game.questionsTotalNumber
    const correctAnswers = game.correctAnswers
    const points = game.points

    await db.collection(DbCollections.SINGLEPLAYER_GAMES).updateOne(
      { _id: gameId },
      {
        $set: { gameStatus: false, finishedAt: new Date() }
      }
    )

    await db.collection(DbCollections.SETTINGS).updateOne(
      { _id: settingsId },
      {
        $inc: { finishedSinglePlayer: 1 }
      }
    )

    res.status(200).json({
      message: 'This game is ended!',
      points: points,
      givenCorrectAnswers: correctAnswers,
      questions: questions
    })
  } catch (e) {
    // console.log(e)
    res.status(500).json({
      message: 'Server faced some issues. Please try again later.',
      points: null,
      givenCorrectAnswers: null,
      questions: null
    })
  }
}
