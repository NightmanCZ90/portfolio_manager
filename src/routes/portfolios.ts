import { Router } from 'express';
import { body } from 'express-validator';

import portfoliosController from '../controllers/portfolios';
import isAuth from '../middlewares/is-auth';

/**
 * Validations
 */

const portfolioValidation = [
  body('name')
    .notEmpty()
    .withMessage('Portfolio name must not be empty.')
    .isLength({
      max: 20,
    })
    .withMessage('Max length of portfolio name is 20 chars.'),
  body('description')
    .optional()
    .isLength({
      max: 240,
    })
    .withMessage('Max length of portfolio description is 240 chars.'),
  body('color')
    .isLength({
      min: 6,
      max: 6,
    })
    .withMessage('Length of portfolio color must be 6 chars.'),
  body('url')
    .optional()
    .isString()
];

/**
 * Routes
 */

const router = Router();

router.get(
  '/portfolios',
  isAuth,
  portfoliosController.getUsersPortfolios
);

router.post(
  '/portfolios',
  isAuth,
  portfolioValidation,
  portfoliosController.createPortfolio
);

router.get(
  '/portfolios/:id',
  isAuth,
  portfoliosController.getPortfolio
);

router.put(
  '/portfolios/:id',
  isAuth,
  portfolioValidation,
  portfoliosController.updatePortfolio
);

router.delete(
  '/portfolios/:id',
  isAuth,
  portfoliosController.deletePortfolio
);

export default router;
