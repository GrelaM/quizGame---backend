export interface QuestionObject {
  Category: string
  Question: string
  Difficulty: number
  Hint_1: string
  Hint_2: string
  Hint_3: string
  Correct: string
  Incorrect_1: string
  Incorrect_2: string
  Incorrect_3: string
}

export interface AnswerObject {
  code: number
  value: string
}

export interface MultiplayerGameType {
  roomId: string
  questionsTotalNumber: number
  questions: QuestionObject[]
  givenAnswers: number
  gameStatus: boolean
  timer: number
  establishedAt: Date
}

export type Player = {
  socketId: string
  gameId: string
  roomId: string
  nickname: string
  correctAnswers: number
  incorrectAnswers: number
  lastTwoAnswers: number
  points: number
}

export type LocalPlayerInfo = {
  socketId: string
  gameId: string
  roomId: string
  currentAnswer: {
    code: number
    hints: number
  }
}

export type Game = {
  gameId: string
  roomId: string
  players: LocalPlayerInfo[]
  receivedAnswers: number
  gameShouldGoOn: boolean
}
