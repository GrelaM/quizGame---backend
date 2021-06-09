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
      return true
    } else {
      console.log('ERROR (Data File) - could not update local game status')
      return false
    }
  }

  resetGameAnswersState(roomId: string) {
    const game = this.games.find((el) => el.roomId === roomId)
    if (game) {
      game.receivedAnswers = 0
      return true
    } else {
      console.log('ERROR (Data File) - could not reset answer status')
      return false
    }
  }

  removeLocalGameStatus(roomId: string) {
    const index = this.games.findIndex((el) => el.roomId === roomId)

    if (index !== -1) {
      this.games.splice(index, 1)
      return true
    } else {
      console.log('ERROR (Data File) - could not remove game')
      return false
    }
  }

  // PLAYERS

  addNewPlayer(roomId: string, passedNewPlayerData: Player) {
    const game = this.games.find((el) => el.roomId === roomId)

    if (game) {
      const newPlayer: LocalPlayerInfo = {
        socketId: passedNewPlayerData.socketId,
        roomId: passedNewPlayerData.roomId,
        currentAnswer: {
          code: -1,
          hints: 0
        }
      }
      game.players.push(newPlayer)
      return true
    } else {
      console.log('ERROR (Data File) - could not add new player')
      return false
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
      return true
    } else {
      console.log(
        'ERROR (Data File) - could not find the game and update player'
      )
      return false
    }
  }

  deletePlayer(player: Player) {
    let status: boolean = false
    const game = this.games.find((el) => el.roomId === player.roomId)
    if (game) {
      const playerIndex = game.players.findIndex(
        (el) => el.socketId === player.socketId
      )

      if (playerIndex !== -1) {
        game.players.splice(playerIndex, 1)
        status = true
      } else {
        console.log('ERROR (Data File) - could not remove player')
        status = false
      }
    }
    return status
  }
}
