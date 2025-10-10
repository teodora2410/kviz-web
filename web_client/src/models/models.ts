export interface LoginDto {
  username: string
  password: string
}

export interface UserDto {
  id: number
  username: string
  email: string
  password: string
  profileImage: string
  isAdmin: boolean
}

export interface AnswerDto {
  id: number
  quizId: number
  questionId: number
  text: string
  correct: boolean
}

export interface QuestionDto {
  id: number
  quizId: number
  title: string
  type: number
  answers: AnswerDto[]
}

export interface QuizDto {
  id: number
  title: string
  description: string
  categories: string
  timeLimit: number
  level: string
  isDeleted: boolean
  originalQuizId: number
  questions: QuestionDto[]
}

export interface ResultAnswerDto {
  id: number
  resultId: number
  questionId: number
  userAnswer: string
}

export interface ResultDto {
  id: number
  quizId: number
  userId: number
  username: string
  solvedAt: string
  quizDto: QuizDto
  userAnswers: ResultAnswerDto[]
}
