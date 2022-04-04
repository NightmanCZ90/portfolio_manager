export interface Auth {
  email: string;
  password: string;
  confirmPassword?: string;
}

export interface Refresh {
  email: string;
  refreshToken: string;
}
