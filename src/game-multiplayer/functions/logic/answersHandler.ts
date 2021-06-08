import LocalDataStorage from '../../../data/LocalDataStorage'
import Game from '../../../models/MultiplayerGame'
import { getDb } from '../../../database/mongodb'
import { Player } from '../../../constants/Interfaces'
import DbCollections from '../../../constants/Collections'

const answersHandler = async (roomId: string, game: Game) => {
  const db = getDb()
  try {
    const localGame = LocalDataStorage.getLocalGameStatus(roomId)
    if (localGame) {
      const players: Player[] = await db
        .collection(DbCollections.MULTIPLAYER_PLAYERS)
        .find({ roomId: roomId })
        .toArray()

      players.forEach((mongoDbEl) => {
        const localPlayer = localGame.players.find(
          (e) => e.socketId === mongoDbEl.socketId
        )

        if (!localPlayer) {
          db.collection(DbCollections.MULTIPLAYER_PLAYERS).updateOne(
            { socketId: mongoDbEl.socketId },
            { $inc: { incorrectAnswers: 1 }, $set: { lastTwoAnswers: 0 } }
          )
        } else {
          const answerCheck = checkingHandler(
            localPlayer.currentAnswer,
            mongoDbEl.lastTwoAnswers
          )

          if (answerCheck.status === 'wrong') {
            db.collection(DbCollections.MULTIPLAYER_PLAYERS).updateOne(
              { socketId: mongoDbEl.socketId },
              { $inc: { incorrectAnswers: 1 }, $set: { lastTwoAnswers: 0 } }
            )
          } else if (answerCheck.status === 'good') {
            db.collection(DbCollections.MULTIPLAYER_PLAYERS).updateOne(
              { socketId: mongoDbEl.socketId },
              {
                $inc: {
                  correctAnswers: 1,
                  lastTwoAnswers: 1,
                  points: answerCheck.points
                }
              }
            )
          }
        }
      })
      LocalDataStorage.resetGameAnswersState(roomId)
    }
  } catch (e) {
    console.log(e)
  }
}

export default answersHandler

// Answer Handler

const checkingHandler = (
  singleAnswer: {
    code: number
    hints: number
  },
  bonus: number
) => {
  let data: {
    status: 'good' | 'wrong'
    incorrectAnswer: number
    correctAnswer: number
    points: number
  }
  const answerCheckResult: boolean = singleAnswer.code === 0 ? true : false
  const multiplier = hintsConverter(singleAnswer.hints)
  const bonusPoints: boolean = bonus >= 2 ? true : false

  if (!answerCheckResult) {
    return (data = {
      status: 'wrong',
      incorrectAnswer: 1,
      correctAnswer: 0,
      points: 0
    })
  } else if (answerCheckResult && bonusPoints) {
    const pointsCalc = 1 * multiplier * 2
    return (data = {
      status: 'good',
      incorrectAnswer: 0,
      correctAnswer: 1,
      points: pointsCalc
    })
  } else if (answerCheckResult) {
    const pointsCalc = 1 * multiplier
    return (data = {
      status: 'good',
      incorrectAnswer: 0,
      correctAnswer: 1,
      points: pointsCalc
    })
  } else {
    return (data = {
      status: 'wrong',
      incorrectAnswer: 1,
      correctAnswer: 0,
      points: 0
    })
  }
}

const hintsConverter = (hints: number) => {
  let pointsFactor: number = 0
  switch (hints) {
    case 1:
      return (pointsFactor = 3)
    case 2:
      return (pointsFactor = 2)
    case 3:
      return (pointsFactor = 1)
    default:
      return (pointsFactor = 0)
  }
}
