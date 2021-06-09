import { getDb } from '../../../database/mongodb'
import { updatedPlayersCollection } from '../../functions/update/updatedPlayersCollection'
import { Player } from '../../../constants/Interfaces'
import DbCollections from '../../../constants/Collections'
import LocalDataStorage from '../../../data/LocalDataStorage'
import SocketNames from '../../../constants/Sockets'

export const joinSocket = async (
  socket: any,
  socketId: string,
  roomId: string,
  nickname: string
) => {
  const db = getDb()
  const newPlayer: Player = {
    socketId: socketId,
    roomId: roomId,
    nickname: nickname,
    correctAnswers: 0,
    incorrectAnswers: 0,
    lastTwoAnswers: 0,
    points: 0
  }

  try {
    await db.collection(DbCollections.MULTIPLAYER_PLAYERS).insertOne(newPlayer)

    const playersCollectionUpdate = await updatedPlayersCollection(roomId)
    const localPlayersCollectionUpdate = LocalDataStorage.addNewPlayer(roomId, newPlayer)

    if (!localPlayersCollectionUpdate) {
      throw new Error()
    }

    socket.join(roomId)
    socket.emit(SocketNames.PLAYERS_UPDATE, {
      type: 'success',
      title: `${nickname}`,
      message: `Welcome in game ${roomId}!`,
      allPlayers: playersCollectionUpdate
    })

    socket.broadcast.to(roomId).emit(SocketNames.PLAYERS_UPDATE, {
      type: 'success',
      title: 'New Player',
      message: `${nickname} has joined the game!`,
      allPlayers: playersCollectionUpdate
    })
  } catch (e) {
    console.log(e)
    socket.emit(SocketNames.PLAYERS_UPDATE, {
      type: 'error',
      title: `${nickname}`,
      message: `Connection error! You are not admitted to game room! Please try again...`,
      allPlayers: []
    })
  }
}
