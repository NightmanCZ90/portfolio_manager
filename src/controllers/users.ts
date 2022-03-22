import { NextFunction, Request, Response } from 'express';
import { AuthRequest } from '../models/routes';
import UserRepo from '../repos/user-repo';
import { StatusError } from '../server';

const usersController = {
  getAllUsers: async (req: Request, res: Response, next: NextFunction) => {
    const users = await UserRepo.find();
    res.status(200).json({ users });
  },
  getUser: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const userId = parseInt(id);
      const user = await UserRepo.findById(userId);

      if (!user) {
        const error: StatusError = new Error('User with this id does not exist.');
        error.statusCode = 404;
        throw error;
      }

      if (req.body.userId !== userId) {
        const error: StatusError = new Error('Not authenticated.');
        error.statusCode = 403;
        throw error;
      }
      res.status(200).json({ user });
    } catch (err: any) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    };
  },

  // TODO: get users you manage
}

export default usersController;
