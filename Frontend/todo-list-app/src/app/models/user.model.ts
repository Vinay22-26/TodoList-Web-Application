export interface User {
  id: string;
  username: string;
  createdAt: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthSession {
  user: User;
  token: string;
}
