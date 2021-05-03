import { RequestHandler } from 'express'
import { getDb } from '../database/mongodb'
import Game from '../models/Game'

export const startNewGame: RequestHandler = (req, res, next) => {
  const reqSettings = {
    quantity: Number(req.body.quantity),
    time: Number(req.body.time),
    level: Number(req.body.level)
  }
    
  const db = getDb()
  return db
    .collection('questions')
    .aggregate([
      { $match: { Difficulty: reqSettings.level } }, // LATER WE CAN CHOOSE DIFFICULTY LEVEL
      { $sample: { size: reqSettings.quantity } }
    ])
    .toArray()
    .then((questions) => {
      const newGame = new Game(reqSettings.quantity, questions, reqSettings.time)
      newGame
        .save()
        .then((game) => {
          res
            .status(200)
            .json({
              message: 'New Game has been created...',
              gameId: game._id,
              artificialGameId: game.artificialGameId,
              timer: game.timer
            })
        })
        .catch((err) => console.log(err))
    })
    .catch((err) => console.log(err))
}
