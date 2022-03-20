import { Router } from 'express';

import { User } from '../models/user';
import UserRepo from '../repos/user-repo'

// type RequestBody = { email: string };
// type RequestParams = { userId: string };


// local temporary database
// let users: User[] = [];

const router = Router();

router.get('/users', async (req, res, next) => {
  const users = await UserRepo.find();

  res.status(200).json({ users });
});

router.post('/users', async (req, res, next) => {
  const { email, password, role } = req.body as User;
  // const newUser: User = {
  //   email,
  //   password,
  //   role,
  // }

  const user = await UserRepo.insert(email, password, role);

  return res.status(201).json({ user });
});

export default router;
