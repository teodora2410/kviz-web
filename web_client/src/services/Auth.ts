import axios from "axios";
import type { LoginDto, UserDto } from "../models/models";
import type { IAuthService } from "./IAuth";

const BASE_URL = import.meta.env.VITE_BACKEND;

export class AuthService implements IAuthService {
  async login(data: LoginDto): Promise<string | null> {
    try {
      const response = await axios.post(`${BASE_URL}/auth/login`, data);
      localStorage.setItem("img", response.data.user.profileImage);
      return response.data.token;
    } catch {
      return null;
    }
  }

  async register(user: UserDto): Promise<string | null> {
    try {
      const response = await axios.post(`${BASE_URL}/auth/register`, user);
      localStorage.setItem("img", response.data.user.profileImage);
      return response.data.token;
    } catch {
      return null;
    }
  }
}
