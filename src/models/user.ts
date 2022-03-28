export enum Role {
  Investor = 'investor',
  PortfolioManager = 'portfolioManager',
  Administrator = 'administrator'
}

export interface BaseUser {
  email: string;
  password: string;
  firstName: string | null;
  lastName: string | null;
  role: string | null;
}
