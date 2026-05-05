export interface AuthRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  tokenType: string;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string>;
}
