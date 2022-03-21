import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextFunction, Response } from 'express';

import { User } from '../models/user';
import UserRepo from '../repos/user-repo';
import { TypedRequestBody } from '../models/routes';
import { ValidationError } from '../server';
import { Auth } from '../models/auth';

export default {
  signup: async (req: TypedRequestBody<User>, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    try {
      if (!errors.isEmpty()) {
        const error: ValidationError = new Error('Validation failed.');
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

      res.status(201).json({ message: 'User has been created', user });

    } catch (err: any) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    };
  },
  login: async (req: TypedRequestBody<Auth>, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    try {
      const user = await UserRepo.findByEmail(email);

      if (!user) {
        const error: ValidationError = new Error('A user with this email does not exist.');
        error.statusCode = 401;
        throw error;
      }
      const isEqual = await bcrypt.compare(password, user.password);
      if (!isEqual) {
        const error: ValidationError = new Error('Wrong password.');
        error.statusCode = 401;
        throw error;
      }
      const token = jwt.sign(
        {
          email: user.email,
          userId: user.id,
        },
        'somesupersecretstring',
        { expiresIn: '1h' }
      );
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
