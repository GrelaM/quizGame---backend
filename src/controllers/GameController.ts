import { RequestHandler } from 'express'

import { Game } from '../models/Game'
import { gamesStorage } from '../data/GamesStorage'

export const startNewGame: RequestHandler = (req, res, next) => {
  const id: string = gamesStorage.generateNewId()
  const totalQuestionNum: number = req.body.totalQuestionNum || 10
  const questions = gamesStorage.getQuestionsPackage(totalQuestionNum)
  const answers = 0
  const points = 0
  const gameStatus: boolean = true
  const timer: number = req.body.timer || 9 // We need this to change!!!
  const cratedAt = new Date()

  const newGame: Game = new Game(
    id,
    totalQuestionNum,
    questions,
    answers,
    points,
    gameStatus,
    timer,
    cratedAt
  )
  gamesStorage.addNewGame(newGame)

  res.status(201).json({
    message: 'New Game was created!',
    gameId: newGame.gameId,
    timer: newGame.timer
  })
}
