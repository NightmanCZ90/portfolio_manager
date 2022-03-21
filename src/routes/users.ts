import { Router } from 'express';

import usersController from '../controllers/users';

const router = Router();

router.get('/users', usersController.getAllUsers);

export default router;
