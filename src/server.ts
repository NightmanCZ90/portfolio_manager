import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { PrismaClient } from '@prisma/client'

import usersRoutes from './routes/users';
import authRoutes from './routes/auth';
import portfoliosRoutes from './routes/portfolios';
import transactionsRoutes from './routes/transactions';

export interface StatusError extends Error {
  statusCode?: number;
  data?: any;
}

export const prisma = new PrismaClient();

/** App initialization */
const app = express();

/** App configuration */
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/** Routing */
app.use(usersRoutes);
app.use(authRoutes);
app.use(portfoliosRoutes);
app.use(transactionsRoutes);

/** Global error handling */
app.use((error: StatusError, req: Request, res: Response, next: NextFunction) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message, data });
});

export default app;
