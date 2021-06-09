import { multiplayer } from '../functions/tasks/multiplayer'
import { gameHostSocket } from '../functions/tasks/gameHostSocket'
import { joinSocket } from '../functions/tasks/joinSocket'
import { disconnectSocket } from '../functions/tasks/disconnectSocket'
import { singleAnswerSocket } from '../functions/tasks/singleAnswerSocket'
import SocketNames from '../../constants/Sockets'

type GameHostSocket = { gameId: string; roomId: string }

export type Host = { socketId: any; room: string }

export type OnOpenRoom = {
  roomState: boolean
  alert: {
    type: string
    status: boolean
    title: string
    message: string
  }
}
export type UserData = {
  id: string
  room: string
  nickname: string
  gameid: string
}

export type SingleAnswerData = {
  code: number
  hints: number
  roomId: string
  gameId: string
}

const multiplayerGameHandler = (socket: any) => {
  socket.on(
    SocketNames.HOST,
    (data: GameHostSocket, callback: (data: OnOpenRoom) => void) => {
      gameHostSocket(socket, data.gameId, data.roomId, callback)
    }
  )

  socket.on(
    SocketNames.JOIN,
    ({ id = socket.id, room, nickname, gameid }: UserData) => {
      joinSocket(socket, id, room, nickname)
    }
  )

  socket.on(
    SocketNames.START_GAME,
    (data: { roomId: string; gameId: string }) => {
      multiplayer(socket, data.roomId, data.gameId)
    }
  )

  socket.on(
    SocketNames.ANSWER,
    (data: SingleAnswerData) => {
      singleAnswerSocket(socket, data)
    }
  )

  socket.on(SocketNames.SOCKET_DISCONNECT, async () => {
    disconnectSocket(socket)
  })
}

export default multiplayerGameHandler
