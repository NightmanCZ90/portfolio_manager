import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';

import { User } from '../models/user';
import UserRepo from '../repos/user-repo';
import { TypedRequestBody } from '../models/routes';
import { ValidationError } from '../server';

export default {
  signup: async (req: TypedRequestBody<User>, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    try {
      if (!errors.isEmpty()) {
        const error: ValidationError = { ...new Error('Validation failed.')};
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
  }
}
