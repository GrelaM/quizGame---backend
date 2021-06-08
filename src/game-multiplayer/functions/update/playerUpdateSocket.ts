import { io } from '../../../app'
import { getDb } from '../../../database/mongodb'
import { Player } from '../../../constants/Interfaces'
import { updatedPlayersCollection } from './updatedPlayersCollection'
import DbCollections from '../../../constants/Collections'
import LocalDataStorage from '../../../data/LocalDataStorage'
import SocketNames from '../../../constants/Sockets'

export const playerUpdateSocket = async (
  player: Player,
  passedSocketId: string
) => {
  const db = getDb()
  const room = player.roomId
  const nickname = player.nickname
  const gameId = player.gameId

  await db
    .collection(DbCollections.MULTIPLAYER_PLAYERS)
    .deleteOne({ socketId: passedSocketId })

  const playersCollectionUpdate = await updatedPlayersCollection(room, gameId)

  LocalDataStorage.deletePlayer(player)

  io.to(room).emit(SocketNames.PLAYERS_UPDATE, {
    type: 'info',
    message: `${nickname} has left the game...`,
    allPlayers: playersCollectionUpdate
  })
}
