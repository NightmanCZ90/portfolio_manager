import { Role } from '../models/user'

export const isRoleValid = (role: string) =>
  role === Role.Investor
  || role === Role.PortfolioManager
  || role === Role.Administrator;
