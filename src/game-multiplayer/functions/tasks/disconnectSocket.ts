import { getDb } from '../../../database/mongodb'
import { playerUpdateSocket } from '../update/playerUpdateSocket'
import { hostUpdateSocket } from '../update/hostUpdateSocket'
import { Host } from '../../connection/multiplayerGameHandler'
import { Player } from '../../../constants/Interfaces'
import DbCollections from '../../../constants/Collections'


export const disconnectSocket = async (socket: any) => {
  const db = getDb()
  try {
    const player: Player = await db
      .collection(DbCollections.MULTIPLAYER_PLAYERS)
      .findOne({ socketId: socket.id })

    const host: Host = await db
      .collection(DbCollections.MULTIPLAYER_HOSTS)
      .findOne({ socketId: socket.id })

    if (player) {
      await playerUpdateSocket(player, socket.id)
    }

    if (host) {
      await hostUpdateSocket(host.room, socket.id)
    }
  } catch (e) {
    console.log(e)
  }
}
