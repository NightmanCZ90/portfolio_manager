import { Router } from 'express';
import { body } from 'express-validator';

import authController from '../controllers/auth';
import UserRepo from '../repos/user-repo';

const router = Router();

router.post('/signup', [
  body('email')
    .isEmail()
    .withMessage('Invalid email')
    .custom((value, { req }) => {
      return UserRepo.findByEmail(value)
        .then(user => {
          if (user) {
            return Promise.reject('User with this email address already exists');
          }
        })
    })
    .normalizeEmail(),
  body('password')
    .trim()
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage("Password must be greater than 8 and contain at least one uppercase letter, one lowercase letter, one number, and one symbol"),
  body('confirmPassword')
    .trim()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Password confirmation does not match password');
      }
      return true;
    })
], authController.signup);

router.post('/login', [
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email')
    .normalizeEmail(),
  body('password')
    .trim(),
], authController.login);

export default router;
