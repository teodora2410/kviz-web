import type { LoginDto, UserDto } from "../models/models"

export interface IAuthService {
  login(data: LoginDto): Promise<string | null>
  register(user: UserDto): Promise<string | null>
}