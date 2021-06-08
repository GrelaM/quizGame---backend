import DbCollections from '../../../constants/Collections'
import Game from '../../../models/MultiplayerGame'
import { getDb } from '../../../database/mongodb'
import { ObjectId } from 'mongodb'
import { Player } from '../../../constants/Interfaces'


const fetchingGameData = async (room: string, gameId: string) => {
  const gameIdMongoDBFormat = new ObjectId(gameId)
  const db = getDb()

  const game: Game = await db
    .collection(DbCollections.MULTIPLAYER_GAMES)
    .findOne({ _id: gameIdMongoDBFormat })
  const players: Player[] = await db
    .collection(DbCollections.MULTIPLAYER_PLAYERS)
    .find({ gameId: gameId, roomId: room })
    .toArray()

  if (!game || players.length <= 0) {
    throw new Error(
      'We have a problem. Game does not exist or there are no players!!!'
    )
  }

  return {game: game, players: players}
}

export default fetchingGameData