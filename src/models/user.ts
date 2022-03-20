export interface User {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
  portfolioManager?: number;
}
