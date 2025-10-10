import type { QuizDto } from "../models/models"

export interface IQuizService {
  getAll(): Promise<QuizDto[] | null>
  getById(id: number): Promise<QuizDto | null>
  create(quiz: QuizDto): Promise<boolean>
  update(id: number, quiz: QuizDto): Promise<boolean>
  delete(id: number): Promise<boolean>
}