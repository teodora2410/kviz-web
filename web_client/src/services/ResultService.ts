import axios from "axios";
import type { ResultDto } from "../models/models";
import type { IResultService } from "./IResultService";

export class ResultService implements IResultService {
  private readonly baseUrl = `${import.meta.env.VITE_BACKEND}/results`;

  async recordResult(result: ResultDto): Promise<boolean> {
    try {
      await axios.post(`${this.baseUrl}/record`, result, {
        headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
      });
      return true;
    } catch {
      return false;
    }
  }

  async getAllResults(): Promise<ResultDto[]> {
    try {
      const response = await axios.get<ResultDto[]>(this.baseUrl, {
        headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
      });
      return Array.isArray(response.data) ? response.data : [];
    } catch {
      return [];
    }
  }
}