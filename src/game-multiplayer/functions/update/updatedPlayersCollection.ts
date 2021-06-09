import { getDb } from '../../../database/mongodb'
import DbCollections from '../../../constants/Collections'

export const updatedPlayersCollection = async (passedRoomId: string) => {
  try {
    const db = getDb()
    const allPlayers = await db
      .collection(DbCollections.MULTIPLAYER_PLAYERS)
      .find({ roomId: passedRoomId })
      .toArray()

    const allPlayersArray: string[] = []
    allPlayers.forEach((el) => allPlayersArray.push(el.nickname))

    return allPlayersArray
  } catch (e) {
    throw e
  }
}
