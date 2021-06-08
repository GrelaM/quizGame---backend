import { Game, Player, LocalPlayerInfo } from '../constants/Interfaces'

export default class Data {
  games: Game[]

  constructor() {
    this.games = []
  }

  saveLocalGameStatus(game: Game) {
    this.games.push(game)
  }

  getLocalGameStatus(roomId: string) {
    const game = this.games.find((el) => el.roomId === roomId)
    return game
  }

  updateLocalGameStatus(roomId: string, status: boolean) {
    const game = this.games.find((el) => el.roomId === roomId)
    if (game) {
      game.gameShouldGoOn = status
    } else {
      console.log('ERROR (Data File) - could not update local game status')
    }
  }

  resetGameAnswersState(roomId: string) {
    const game = this.games.find((el) => el.roomId === roomId)
    if (game) {
      game.receivedAnswers = 0
    } else {
      console.log('ERROR (Data File) - could not reset answer status')
    }
  }

  removeLocalGameStatus(roomId: string) {
    const index = this.games.findIndex((el) => el.roomId === roomId)

    if (index !== -1) {
      this.games.splice(index, 1)
    } else {
      console.log('ERROR (Data File) - could not remove game')
    }
  }

  // PLAYERS

  addNewPlayer(roomId: string, passedNewPlayerData: Player) {
    const game = this.games.find((el) => el.roomId === roomId)

    if (game) {
      const newPlayer: LocalPlayerInfo = {
        socketId: passedNewPlayerData.socketId,
        gameId: passedNewPlayerData.gameId,
        roomId: passedNewPlayerData.roomId,
        currentAnswer: {
          code: -1,
          hints: 0
        }
      }
      game.players.push(newPlayer)
    } else {
      console.log('ERROR (Data File) - could not add new player')
    }
  }

  updatePlayer(
    roomId: string,
    socketId: string,
    passedCode: number,
    passedHints: number
  ) {
    const game = this.games.find((el) => el.roomId === roomId)

    if (game) {
      const player = game.players.find((el) => el.socketId === socketId)
      if (player) {
        player.currentAnswer.code = passedCode
        player.currentAnswer.hints = passedHints
      } else {
        console.log('ERROR (Data File) - could not update player')
      }
      game.receivedAnswers = game.receivedAnswers + 1
    } else {
      console.log(
        'ERROR (Data File) - could not find the game and update player'
      )
    }
  }

  deletePlayer(player: Player) {
    const game = this.games.find((el) => el.roomId === player.roomId)

    if (game) {
      const playerIndex = game.players.findIndex(
        (el) => el.socketId === player.socketId
      )

      if (playerIndex !== -1) {
        game.players.splice(playerIndex, 1)
      } else {
        console.log('ERROR (Data File) - could not remove player')
      }
    }
  }
}
