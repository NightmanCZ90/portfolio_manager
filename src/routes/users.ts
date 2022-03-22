import { Router } from 'express';

import usersController from '../controllers/users';
import isAuth from '../middlewares/is-auth';

const router = Router();

// TODO: Refactor to only show users you manage with limited data
router.get('/users', isAuth, usersController.getAllUsers);

router.get('/users/:id', isAuth, usersController.getUser);

router.post('/users/:id', isAuth, usersController.getAllUsers);

export default router;
