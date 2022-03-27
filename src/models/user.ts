export enum Role {
  Investor = 'investor',
  PortfolioManager = 'portfolioManager',
  Administrator = 'administrator'
}

export interface BaseUser {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
  portfolioManager?: number;
}

export interface User extends BaseUser {
  id: number;
  createdAt: string;
  updatedAt: string;
}
