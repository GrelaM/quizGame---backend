import { RequestHandler } from 'express'
import { getDb } from '../database/mongodb'
import { ObjectId } from 'mongodb'
import Game from '../models/Game'
import LocalDataStorage from '../data/LocalDataStorage'
import MultiplayerGame from '../models/MultiplayerGame'
import LocalSettingsStorage from '../data/LocalSettingsStorage'
import DbCollections from '../constants/Collections'

export const startNewGame: RequestHandler = async (req, res, next) => {
  const settingsId = LocalSettingsStorage.databaseSettingsCollectionId
  const db = getDb()

  const reqSettings = {
    quantity: Number(req.body.quantity),
    time: Number(req.body.time),
    level: Number(req.body.level)
  }

  try {
    const questions = await db
      .collection(DbCollections.QUESTIONS)
      .aggregate([
        { $match: { Difficulty: reqSettings.level } },
        { $sample: { size: reqSettings.quantity } }
      ])
      .toArray()

    const newGame = new Game(reqSettings.quantity, questions, reqSettings.time)

    const savedGame = await newGame.save()

    if (savedGame) {
      await db.collection(DbCollections.SETTINGS).updateOne(
        { _id: settingsId },
        {
          $inc: { requestedSinglePlayer: 1 }
        }
      )

      res.status(200).json({
        message: 'New Game has been created...',
        gameId: savedGame._id,
        artificialGameId: savedGame.artificialGameId,
        timer: savedGame.timer
      })
    }
  } catch (e) {
    res.status(500).json({
      message:
        'We sincerely apologize. Something went wrong. We could not create this game.'
    })
  }
}

export const singlePlayerRecoveryMode: RequestHandler = async (
  req,
  res,
  next
) => {
  const gameId = new ObjectId(req.params.gameid)
  const db = getDb()

  try {
    const recoveredGame = await db
      .collection(DbCollections.SINGLEPLAYER_GAMES)
      .findOne({ _id: gameId })

    if (recoveredGame) {
      res.status(200).json({
        message: 'Game recovered successfully.',
        nextQuestion: recoveredGame.givenAnswers
      })
    }
  } catch (e) {
    res.status(500).json({
      message:
        'We sincerely apologize. Something went wrong. We could not recover this game.',
      nextQuestion: null
    })
  }
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
      .collection(DbCollections.QUESTIONS)
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

    const savedNewGame = await newGame.save()

    const newLocalGameStatus = {
      gameId: savedNewGame._id,
      roomId: newGame.roomId,
      players: [],
      receivedAnswers: 0,
      gameShouldGoOn: true
    }

    LocalDataStorage.saveLocalGameStatus(newLocalGameStatus)

    res.status(200).json({
      message: 'New Game has been created...',
      gameId: savedNewGame._id,
      roomId: savedNewGame.roomId
    })
  } catch (e) {
    res.status(500).json({
      message:
        'We sincerely apologize. Something went wrong. We could not create this game.'
    })
  }
}

export const multiplayerRecoveryMode: RequestHandler = async (
  req,
  res,
  next
) => {
  const gameId = new ObjectId(req.params.gameid)
  const db = getDb()

  try {
    const recoveredGame = await db
      .collection(DbCollections.MULTIPLAYER_GAMES)
      .findOne({ _id: gameId })

    if (recoveredGame) {
      res.status(200).json({
        message: 'Game recovered successfully.'
      })
    }
  } catch (e) {
    res.status(500).json({
      message:
        'We sincerely apologize. Something went wrong. We could not recover this game.'
    })
  }
}
