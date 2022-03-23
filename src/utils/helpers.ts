import { Role } from '../models/user'

export const isRoleValid = (role: string) =>
  role === Role.Investor
  || role === Role.PortfolioManager
  || role === Role.Administrator;

export const toCamelCase = (rows: any[]) => rows.map(row => {
  const replaced: any = {};

  for (let key in row) {
    const camelCase = key.replace(/([-_][a-z])/gi, ($1) => $1.toUpperCase().replace('_', ''));
    replaced[camelCase] = row[key];
  }
  return replaced;
});
