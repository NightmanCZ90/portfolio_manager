import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextFunction, Response } from 'express';

import { User } from '../models/user';
import UserRepo from '../repos/user-repo';
import { StatusError } from '../server';
import { Auth } from '../models/auth';
import config from '../config';
import { RequestBody } from '../models/routes';

const tokenForUser = (user: User) => {
  return jwt.sign(
    {
      email: user.email,
      sub: user.id,
    },
    config.tokenSecret,
    { expiresIn: config.jwtExpirySeconds }
    );
}

const authController = {
  signup: async (req: RequestBody<Auth>, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        const error: StatusError = new Error('Validation failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
      }
      const { email, password } = req.body;
      const hashedPw = await bcrypt.hash(password, 12);

      const user = await UserRepo.register({
        email,
        password: hashedPw,
      });

      const token = tokenForUser(user);

      res.status(201).json({ message: 'User has been created', token, userId: user.id });

    } catch (err: any) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    };
  },
  login: async (req: RequestBody<Auth>, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const user = await UserRepo.findByEmail(email);

      if (!user) {
        const error: StatusError = new Error('A user with this email does not exist.');
        error.statusCode = 404;
        throw error;
      }
      const isEqual = await bcrypt.compare(password, user.password);
      if (!isEqual) {
        const error: StatusError = new Error('Wrong password.');
        error.statusCode = 401;
        throw error;
      }
      const token = tokenForUser(user);
      res.status(200).json({ token, userId: user.id });
      return;
    } catch (err: any) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
      return err;
    };
  },
}

export default authController;
