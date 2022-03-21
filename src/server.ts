import express, { NextFunction, Request, Response } from 'express';
import usersRoutes from './routes/users';
import authRoutes from './routes/auth';
import cors from 'cors';

export interface ValidationError extends Error {
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

/** Global error handling */
app.use((error: ValidationError, req: Request, res: Response, next: NextFunction) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message, data });
});

export default app;
