import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import { NextFunction, Response } from 'express';

import UserRepo from '../repos/user-repo';
import { StatusError } from '../server';
import { Auth, Refresh } from '../models/auth';
import config from '../config';
import { RequestBody } from '../models/routes';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/helpers';

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

      const accessToken = generateAccessToken(user.email, user.id);
      const refreshToken = generateRefreshToken(user.email, user.id);

      res.status(201).json({ message: 'User has been created', accessToken, refreshToken, expiresIn: config.jwtExpirySeconds, userId: user.id });

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
      const accessToken = generateAccessToken(user.email, user.id);
      const refreshToken = generateRefreshToken(user.email, user.id);

      //pridat refreshToken
      res.status(200).json({ accessToken, refreshToken, expiresIn: config.jwtExpirySeconds, userId: user.id });
      return;
    } catch (err: any) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
      return err;
    };
  },

  refresh: async (req: RequestBody<Refresh>, res: Response, next: NextFunction) => {
    const { email, refreshToken } = req.body;

    const { isValid, userId } = verifyRefreshToken(email, refreshToken);

    if (!isValid) {
      return res.status(401).json({ success: false, error: "Invalid token, try login again." });
    }
    const accessToken = generateAccessToken(email, Number(userId));
    return res.status(200).json({ success: true, accessToken });
  }
}

export default authController;
