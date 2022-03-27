import { NextFunction, Response } from 'express';
import { validationResult } from 'express-validator';
import { AuthRequest, AuthRequestBody } from '../models/routes';
import { BaseTransaction } from '../models/transaction';
import PortfolioRepo from '../repos/portfolio-repo';
import TransactionRepo from '../repos/transaction-repo';
import { StatusError } from '../server';
import { checkAndReturnPortfolio } from './portfolios';

/**
 * Helpers
 */

const checkAndReturnTransaction = async (req: AuthRequest) => {

}

/**
 * Controllers
 */

 const transactionsController = {

  createTransaction: async (req: AuthRequestBody<BaseTransaction>, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        const error: StatusError = new Error('Validation failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
      }
      const portfolioId = parseInt(req.params.pId);
      await checkAndReturnPortfolio(req, portfolioId);

      const transaction = await TransactionRepo.insert({ ...req.body, portfolioId });

      res.status(200).json({ transaction });
    } catch (err: any) {
      if (!err.statusCode) {
        err.statusCode = 500;
        err.message = 'Creating portfolio failed.';
      }
      next(err);
    };
  },
}

export default transactionsController;
