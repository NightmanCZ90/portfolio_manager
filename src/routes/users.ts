import { Router } from 'express';

import usersController from '../controllers/users';
import isAuth from '../middlewares/is-auth';

const router = Router();

router.get('/users', isAuth, usersController.getAllUsers);

export default router;
