import { User } from '@prisma/client';
import jwt from 'jsonwebtoken';

import config from '../config';
import { ExecutionType, TransactionType } from '../models/transaction';
import { Role } from '../models/user'

export const isRoleValid = (role: string) =>
  role === Role.Investor ||
  role === Role.PortfolioManager ||
  role === Role.Administrator;

export const isTransactionTypeValid = (transactionType: string) =>
  transactionType === TransactionType.Buy ||
  transactionType === TransactionType.Sell ||
  transactionType === TransactionType.BuyToCover ||
  transactionType === TransactionType.SellShort ||
  transactionType === TransactionType.DRIP ||
  transactionType === TransactionType.Dividends ||
  transactionType === TransactionType.Split;

export const isExecutionTypeValid = (execution: string) =>
  execution === ExecutionType.FIFO ||
  execution === ExecutionType.LIFO ||
  execution === ExecutionType.WeightedAverage ||
  execution === ExecutionType.SpecificLots ||
  execution === ExecutionType.HighCost ||
  execution === ExecutionType.LowCost;

export const toCamelCase = (rows: any[]) => rows.map(row => {
  const replaced: any = {};

  for (let key in row) {
    const camelCase = key.replace(/([-_][a-z])/gi, ($1) => $1.toUpperCase().replace('_', ''));
    replaced[camelCase] = row[key];
  }
  return replaced;
});

export const generateAccessToken = (email: string, userId: number) => {
  return jwt.sign(
    {
      email,
      sub: userId,
    },
    config.accessTokenSecret,
    { expiresIn: config.jwtExpirySeconds }
  );
}

export const generateRefreshToken = (email: string, userId: number) => {
  return jwt.sign(
    {
      email,
      sub: userId,
    },
    config.refreshTokenSecret,
    { expiresIn: config.jwtRefreshExpirySeconds }
  );
}

export const verifyRefreshToken = (email: string, refreshToken: string) => {
  try {
    const decodedToken = jwt.verify(refreshToken, config.refreshTokenSecret) as jwt.JwtPayload;
    return { userId: decodedToken.sub, isValid: decodedToken.email === email };
  } catch (err: any) {
    return { isValid: false };
  }
};
