import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { AuthRequest, AuthRequestBody } from '../models/routes';
import { BaseUser } from '../models/user';
import UserRepo from '../repos/user-repo';
import { StatusError } from '../server';

/**
 * Helpers
 */

const isCurrentUser = async (req: AuthRequest) => {
  const { id } = req.params;
  const userId = parseInt(id);

  if (req.body.userId !== userId) {
    const error: StatusError = new Error('Not authorized to access this user.');
    error.statusCode = 403;
    throw error;
  }

  const user = await UserRepo.findById(userId);

  if (!user) {
    const error: StatusError = new Error('User with this id does not exist.');
    error.statusCode = 404;
    throw error;
  }

  return user;
}

/**
 * Controllers
 */

const usersController = {
  getAllUsers: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await UserRepo.find();
      res.status(200).json({ users });
    } catch (err: any) {
      if (!err.statusCode) {
        err.statusCode = 500;
        err.message = 'Retrieving users failed.';
      }
      next(err);
    }
  },

  getCurrentUser: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const user = await UserRepo.findById(req.body.userId);

      res.status(200).json({ ...user });
    } catch (err: any) {
      if (!err.statusCode) {
        err.statusCode = 500;
        err.message = 'Retrieving user failed.';
      }
      next(err);
    };
  },

  getUser: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const user = await isCurrentUser(req);

      res.status(200).json({ ...user });
    } catch (err: any) {
      if (!err.statusCode) {
        err.statusCode = 500;
        err.message = 'Retrieving user failed.';
      }
      next(err);
    };
  },

  updateUser: async (req: AuthRequestBody<BaseUser>, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        const error: StatusError = new Error('Validation failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
      }

      const user = await isCurrentUser(req);
      const { firstName, lastName, role } = req.body;
      const updatedUser = await UserRepo.update({ ...user, firstName, lastName, role });

      res.status(200).json({ ...updatedUser });
    } catch (err: any) {
      if (!err.statusCode) {
        err.statusCode = 500;
        err.message = 'Updating user failed.';
      }
      next(err);
    };
  }
  // TODO: get users you manage
}

export default usersController;
