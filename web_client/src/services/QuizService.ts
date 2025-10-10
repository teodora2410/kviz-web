import axios from "axios";
import type { QuizDto } from "../models/models";
import type { IQuizService } from "./IQuizService";

const API_BASE_URL = import.meta.env.VITE_BACKEND;

export class QuizService implements IQuizService {
  private readonly baseUrl = `${API_BASE_URL}/quizzes`;

  async getAll(): Promise<QuizDto[] | null> {
    try {
      const response = await axios.get<QuizDto[]>(this.baseUrl);
      return response.data;
    } catch {
      return null;
    }
  }

  async getById(id: number): Promise<QuizDto | null> {
    try {
      const response = await axios.get<QuizDto>(`${this.baseUrl}/${id}`);
      return response.data;
    } catch {
      return null;
    }
  }

  async create(quiz: QuizDto): Promise<boolean> {
    try {
      await axios.post(`${this.baseUrl}/create`, quiz, {
        headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
      });
      return true;
    } catch {
      return false;
    }
  }

  async update(id: number, quiz: QuizDto): Promise<boolean> {
    try {
      await axios.put(`${this.baseUrl}/${id}`, quiz, {
        headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
      });
      return true;
    } catch {
      return false;
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      await axios.delete(`${this.baseUrl}/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
      });
      return true;
    } catch {
      return false;
    }
  }
}
