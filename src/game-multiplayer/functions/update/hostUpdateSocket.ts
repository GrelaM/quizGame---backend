import { getDb } from '../../../database/mongodb'
import DbCollections from '../../../constants/Collections'

export const hostUpdateSocket = async (
  room: string,
  passedSocketId: string
) => {
  const db = getDb()

  await db.collection(DbCollections.MULTIPLAYER_HOSTS).deleteOne({ socketId: passedSocketId })

//   io.to(room).emit('host-Update', {
//     type: 'warning',
//     message: `Host has left the game...`
//   })
}
