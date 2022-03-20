import { NextFunction, Request, Response } from 'express';
import UserRepo from '../repos/user-repo';

export default {
  getAllUsers: async (req: Request, res: Response, next: NextFunction) => {
    const users = await UserRepo.find();
    res.status(200).json({ users });
  },

  // TODO: get users you manage
}
