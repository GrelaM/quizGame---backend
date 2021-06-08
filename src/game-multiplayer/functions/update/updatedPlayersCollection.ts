import { getDb } from '../../../database/mongodb'
import DbCollections from '../../../constants/Collections'

export const updatedPlayersCollection = async (
  passedRoomId: string,
  passedGameId: string
) => {
  const db = getDb()
  const allPlayers = await db
    .collection(DbCollections.MULTIPLAYER_PLAYERS)
    .find({ roomId: passedRoomId, gameId: passedGameId })
    .toArray()

  const allPlayersArray: string[] = []
  allPlayers.forEach((el) => allPlayersArray.push(el.nickname))

  return allPlayersArray
}
