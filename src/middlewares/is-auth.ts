import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';
import { ValidationError } from '../server';

const isAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    const error: ValidationError = new Error('Not authenticated.');
    error.statusCode = 401;
    throw error;
  }
  const token = authHeader.split(' ')[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, config.tokenSecret) as jwt.JwtPayload;
  } catch (err: any) {
    err.statusCode = 500;
    throw err;
  }
  if (!decodedToken) {
    const error: ValidationError = new Error('Not authenticated.');
    error.statusCode = 401;
    throw error;
  }

  req.body.email = decodedToken.email;
  req.body.userId = decodedToken.sub;
  next();
};

export default isAuth;
