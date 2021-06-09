import DbCollections from '../../../constants/Collections'
import Game from '../../../models/MultiplayerGame'
import { getDb } from '../../../database/mongodb'
import { ObjectId } from 'mongodb'
import LocalDataStorage from '../../../data/LocalDataStorage'

const gameUpdate = async (gameId: string, roomId: string) => {
  const db = getDb()
  const mongodbGameId = new ObjectId(gameId)
  try {
    const updatedGame = await db.collection(DbCollections.MULTIPLAYER_GAMES).findOneAndUpdate(
      { _id: mongodbGameId },
      { $inc: { givenAnswers: 1 } },
      { returnOriginal: false }
    )

    if(updatedGame) {
      const statusCheck: () => boolean = () => {
        const fetchedData: Game = updatedGame.value
        if (fetchedData.questionsTotalNumber === fetchedData.givenAnswers) {
          return false // Game is finished
        } else {
          return true // Game should continue
        }
      }
      LocalDataStorage.updateLocalGameStatus(roomId, statusCheck())
    }

  } catch (e) {
    throw e
  }
}

export default gameUpdate
