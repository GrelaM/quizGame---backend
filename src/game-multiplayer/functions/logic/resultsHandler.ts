import { getDb } from '../../../database/mongodb'
import { ObjectId } from 'mongodb'
import { Player } from '../../../constants/Interfaces'
import Game from '../../../models/MultiplayerGame'
import DbCollections from '../../../constants/Collections'

const resultsHandler = async (roomId: string, gameId: string) => {
  const db = getDb()
  const convertedGameId = new ObjectId(gameId)
  try {
    const game: Game = await db
      .collection(DbCollections.MULTIPLAYER_GAMES)
      .findOne({ roomId: roomId, _id: convertedGameId })

    const totalQuestions = game.questionsTotalNumber

    let finalResults: {
      name: string
      correctAnswers: number
      totalQuestions: number
      points: number
    }[] = []
    const allPlayers: Player[] = await db
      .collection(DbCollections.MULTIPLAYER_PLAYERS)
      .find({ roomId: roomId })
      .toArray()

    allPlayers.map((el) => {
      const data: {
        name: string
        correctAnswers: number
        totalQuestions: number
        points: number
      } = {
        name: el.nickname,
        correctAnswers: el.correctAnswers,
        totalQuestions: totalQuestions,
        points: el.points
      }
      finalResults.push(data)
    })

    finalResults.sort((a, b) => (a.points < b.points ? 1 : -1))
    
    return finalResults
  } catch (e) {
    throw e
  }
}

export default resultsHandler
