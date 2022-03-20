import { Router } from 'express';

import { User } from '../models/user';

type RequestBody = { username: string };
// type RequestParams = { userId: string };


// local temporary database
let users: User[] = [];

const router = Router();

router.get('/', (req, res, next) => {
  res.status(200).json({ users });
});

router.post('/user', (req, res, next) => {
  const body = req.body as RequestBody;
  const newUser: User = {
    id: new Date().toISOString(),
    username: body.username,
  }

  users.push(newUser);

  return res.status(201).json({
    message: 'Added user',
    users,
  });
});

export default router;
