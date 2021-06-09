import { io } from '../../../app'
import { Player } from '../../../constants/Interfaces'
import Game from '../../../models/MultiplayerGame'
import SocketNames from '../../../constants/Sockets'
import LocalDataStorage from '../../../data/LocalDataStorage'

import fetchingGameData from '../logic/fetchingGameData'
import countingDown from '../logic/countingDown'
import questionHandler from '../logic/questionHandler'
import answersHandler from '../logic/answersHandler'
import engine from '../logic/engine'
import gameUpdate from '../logic/gameUpdate'
import resultsHandler from '../logic/resultsHandler'

export const multiplayer = async (
  socket: any,
  roomId: string,
  gameId: string
) => {
  try {
    const gameStatus = LocalDataStorage.getLocalGameStatus(roomId)

    if (!gameStatus) {
      throw new Error('Sorry. Server failed.')
    }
    // COUNTING DOWN
    await countingDown(roomId, 3)

    while (gameStatus.gameShouldGoOn) {
      // GAME DETAILS
      const data: { game: Game; players: Player[] } = await fetchingGameData(
        roomId,
        gameId
      )
      // QUESTION
      questionHandler(data, roomId)
      await engine(data.game.timer, gameStatus)
      // UPDATE
      await answersHandler(roomId, data.game)
      await gameUpdate(gameId, roomId)
    }

    if (!gameStatus.gameShouldGoOn) {
      io.to(roomId).emit(SocketNames.END_GAME, { status: true })
      const results = await resultsHandler(roomId, gameId)
      io.to(roomId).emit(SocketNames.RESULTS, { results: results })
    }
  } catch (e) {
    socket.broadcast.to(roomId).emit(SocketNames.FATAL_ERROR, {
      message: 'Sorry. Fatal error occurred.'
    })
    console.log(e)
  }
}
