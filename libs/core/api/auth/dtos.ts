export interface LoginRequestDto {
  username: string;
  password: string;
}

export interface AuthUserDto {
  id: string;
  email: string;
  name?: string;
  role?: string;
}
