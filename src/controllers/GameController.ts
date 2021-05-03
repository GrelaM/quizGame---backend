import { RequestHandler } from 'express'
import { getDb } from '../database/mongodb'
import Game from '../models/Game'

export const startNewGame: RequestHandler = (req, res, next) => {
  const db = getDb()
  return db
    .collection('questions')
    .aggregate([
      // { $match: { Difficulty: 2 } }, // LATER WE CAN CHOOSE DIFFICULTY LEVEL
      { $sample: { size: 10 } }
    ])
    .toArray()
    .then((questions) => {
      const newGame = new Game(10, questions, 15)
      newGame
        .save()
        .then((game) => {
          res
            .status(200)
            .json({
              message: 'New Game has been created...',
              gameId: game._id,
              artificialGameId: game.artificialGameId
            })
        })
        .catch((err) => console.log(err))
    })
    .catch((err) => console.log(err))
}
