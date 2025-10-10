import axios from "axios";
import type { LoginDto, UserDto } from "../models/models";
import type { IAuthService } from "./IAuth";

const BASE_URL = import.meta.env.VITE_BACKEND;

export class AuthService implements IAuthService {
  async login(data: LoginDto): Promise<string | null> {
    try {
      const response = await axios.post(`${BASE_URL}/auth/login`, data);
      return response.data;
    } catch {
      return null;
    }
  }

  async register(user: UserDto): Promise<string | null> {
    try {
      const response = await axios.post(`${BASE_URL}/auth/register`, user);
      return response.data;
    } catch {
      return null;
    }
  }
}
