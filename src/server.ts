import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';

import usersRoutes from './routes/users';
import authRoutes from './routes/auth';
import portfoliosRoutes from './routes/portfolios';
import transactionsRoutes from './routes/transactions';

export interface StatusError extends Error {
  statusCode?: number;
  data?: any;
}

/** App initialization */
const app = express();

/** App use */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/** CORS */
app.use(cors());

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
