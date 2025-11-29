export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{success: boolean, message: string}>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface LoginResponse {
  user: User;
}