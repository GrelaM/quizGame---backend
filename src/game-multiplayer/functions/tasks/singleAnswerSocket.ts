import { SingleAnswerData } from '../../connection/multiplayerGameHandler'
import LocalDataStorage from '../../../data/LocalDataStorage'

export const singleAnswerSocket = (socket: any, data: SingleAnswerData) => {
  LocalDataStorage.updatePlayer(
    data.roomId,
    socket.id,
    data.code,
    data.hints
  )
}
