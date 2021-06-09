import DbCollections from '../../../constants/Collections'
import Game from '../../../models/MultiplayerGame'
import { getDb } from '../../../database/mongodb'
import { ObjectId } from 'mongodb'
import { Player } from '../../../constants/Interfaces'

const fetchingGameData = async (room: string, gameId: string) => {
  const gameIdMongoDBFormat = new ObjectId(gameId)
  const db = getDb()

  try {
    const game: Game = await db
      .collection(DbCollections.MULTIPLAYER_GAMES)
      .findOne({ _id: gameIdMongoDBFormat })
    const players: Player[] = await db
      .collection(DbCollections.MULTIPLAYER_PLAYERS)
      .find({ gameId: gameId, roomId: room })
      .toArray()

    return { game: game, players: players }
  } catch (e) {
    throw e
  }
}

export default fetchingGameData
