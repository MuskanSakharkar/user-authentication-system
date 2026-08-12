export interface User {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthApiResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
}

export interface HealthApiResponse {
  status: string;
  message: string;
  timestamp: string;
  database?: {
    status: string;
    connected: boolean;
  };
}

export type AuthView = 'login' | 'register' | 'welcome';
