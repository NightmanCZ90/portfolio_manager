import { Router } from 'express';

import { User } from '../models/user';
import UserRepo from '../repos/user-repo'
import usersController from '../controllers/users';

// type RequestBody = { email: string };
// type RequestParams = { userId: string };


// local temporary database
// let users: User[] = [];

const router = Router();

router.get('/users', usersController.getAllUsers);

// signup / signin
router.post('/users', async (req, res, next) => {
  const { email, password, firstName, lastName, role } = req.body as User;
  // const newUser: User = {
  //   email,
  //   password,
  //   role,
  // }

  const user = await UserRepo.insert(req.body);

  return res.status(201).json({ user });
});

export default router;
