export interface User {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
  portfolioManager?: number;
}

export enum Role {
  Investor = 'investor',
  PortfolioManager = 'portfolioManager',
  Administrator = 'administrator'
}
