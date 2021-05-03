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
