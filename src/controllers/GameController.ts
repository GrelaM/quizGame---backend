import { RequestHandler } from 'express'
import { getDb } from '../database/mongodb'
import { ObjectId } from 'mongodb'
import Game from '../models/Game'
import MultiplayerGame from '../models/MultiplayerGame'
import LocalSettingsStorage from '../data/LocalSettingsStorage'

export const startNewGame: RequestHandler = (req, res, next) => {
  const settingsId = LocalSettingsStorage.databaseSettingsCollectionId
  const db = getDb()

  const reqSettings = {
    quantity: Number(req.body.quantity),
    time: Number(req.body.time),
    level: Number(req.body.level)
  }

  return db
    .collection('questions')
    .aggregate([
      { $match: { Difficulty: reqSettings.level } }, // LATER WE CAN CHOOSE DIFFICULTY LEVEL
      { $sample: { size: reqSettings.quantity } }
    ])
    .toArray()
    .then((questions) => {
      const newGame = new Game(
        reqSettings.quantity,
        questions,
        reqSettings.time
      )
      return newGame
        .save()
        .then((game) => {
          db.collection('settings')
            .updateOne(
              { _id: settingsId },
              {
                $inc: { requestedSinglePlayer: 1 }
              }
            )
            .catch((err) => console.log(err))
          return game
        })
        .then((game) => {
          res.status(200).json({
            message: 'New Game has been created...',
            gameId: game._id,
            artificialGameId: game.artificialGameId,
            timer: game.timer
          })
        })
    })
    .catch((err) => console.log(err))
}

export const singlePlayerRecoveryMode: RequestHandler = (req, res, next) => {
  const gameId = new ObjectId(req.params.gameid)
  const db = getDb()

  db.collection('games')
    .findOne({ _id: gameId })
    .then((data) => {
      res.status(200).json({
        message: 'Game recovered successfully.',
        nextQuestion: data.givenAnswers
      })
    })
    .catch((err) => console.log(err))
}

export const startNewMultiPlayerGame: RequestHandler = async (
  req,
  res,
  next
) => {
  const db = getDb()

  const reqSettings = {
    quantity: Number(req.body.quantity),
    time: Number(req.body.time),
    level: Number(req.body.level)
  }

  try {
    const questions = await db
      .collection('questions')
      .aggregate([
        { $match: { Difficulty: reqSettings.level } },
        { $sample: { size: reqSettings.quantity } }
      ])
      .toArray()

    const newGame = new MultiplayerGame(
      reqSettings.quantity,
      questions,
      reqSettings.time,
      8 // id_length
    )
      try {
        const saveNewGame = await newGame.save()
        res.status(200).json({
          message: 'New Game has been created.',
          questions: saveNewGame
        })
      } catch(e) {return e}
  } catch (e) {
    console.log(e)
  }
}
