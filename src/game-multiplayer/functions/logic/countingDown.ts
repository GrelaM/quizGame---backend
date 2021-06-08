import { io } from '../../../app'
import SocketNames from '../../../constants/Sockets'
import triggerAfter from '../../../function/triggerAfter'

const countingDown = async (room: string, time: number) => {
  const counter: number = time
  io.to(room).emit(SocketNames.COUNTER, {
    message: 'Get ready!',
    counter: counter
  })

  await Promise.all([triggerAfter(counter * 1000)])
}

export default countingDown
