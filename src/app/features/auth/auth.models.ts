export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
}

export interface LoginRequest {
  login: string;
  password: string;
}

export interface VerifyEmailRequest {
  token: string;
}

export interface ResendVerificationRequest {
  email: string;
}

export interface AuthResponse {
  token: string;
}

export interface MessageResponse {
  message: string;
}
