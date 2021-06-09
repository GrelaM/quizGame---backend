import { ObjectId } from 'mongodb'
import { getDb } from '../../../database/mongodb'
import { Host, OnOpenRoom } from '../../connection/multiplayerGameHandler'
import MultiplayerGame from '../../../models/MultiplayerGame'
import DbCollections from '../../../constants/Collections'
import LocalDataStorage from '../../../data/LocalDataStorage'

export const gameHostSocket = async (
  socket: any,
  gameId: string,
  roomId: string,
  callback: (data: OnOpenRoom) => void
) => {
  const db = getDb()
  const mongodbId = new ObjectId(gameId)

  try {
    const game: MultiplayerGame = await db
      .collection(DbCollections.MULTIPLAYER_GAMES)
      .findOne({ _id: mongodbId })

    LocalDataStorage.saveLocalGameStatus({
      gameId: gameId,
      roomId: roomId,
      players: [],
      receivedAnswers: game.givenAnswers,
      gameShouldGoOn: true
    })

    const newHost: Host = {
      socketId: socket.id,
      room: roomId
    }

    await db.collection(DbCollections.MULTIPLAYER_HOSTS).insertOne(newHost)
    socket.join(
      roomId,
      callback({
        roomState: true,
        alert: {
          type: 'success',
          status: true,
          title: 'Success',
          message: 'You entered room successfully.'
        }
      })
    )
  } catch (e) {
    // console.log(e)
    callback({
      roomState: false,
      alert: {
        type: 'error',
        status: true,
        title: 'Sorry',
        message: 'Something went wrong...'
      }
    })
  }
}
