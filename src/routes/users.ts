import { Router } from 'express';
import { body } from 'express-validator';

import usersController from '../controllers/users';
import isAuth from '../middlewares/is-auth';
import { isRoleValid } from '../utils/helpers';

const router = Router();

// TODO: Refactor to only show users you manage with limited data
router.get('/users', isAuth, usersController.getAllUsers);

router.get('/users/:id', isAuth, usersController.getUser);

router.put('/users/:id', isAuth, [
  body('firstName')
    .isLength({
      max: 40,
    })
    .withMessage('Max length of first name is 40 chars.'),
  body('lastName')
    .isLength({
      max: 40,
    })
    .withMessage('Max length of last name is 40 chars.'),
  body('role')
    .custom(isRoleValid)
    .withMessage('Invalid user role'),
], usersController.updateUser);

export default router;
