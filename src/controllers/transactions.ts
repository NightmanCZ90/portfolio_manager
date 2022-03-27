import { NextFunction, Response } from 'express';
import { validationResult } from 'express-validator';
import { AuthRequest, AuthRequestBody } from '../models/routes';
import { BaseTransaction, Transaction } from '../models/transaction';
import TransactionRepo from '../repos/transaction-repo';
import { StatusError } from '../server';
import { checkAndReturnPortfolio } from './portfolios';

/**
 * Helpers
 */

const checkAndReturnTransaction = async (req: AuthRequest, transactionId: number) => {
  const transaction = await TransactionRepo.findById(transactionId);

  if (!transaction) {
    const error: StatusError = new Error('Transaction with this id does not exist.');
    error.statusCode = 404;
    throw error;
  }

  if (req.body.userId !== transaction.userId) {
    const error: StatusError = new Error('Not authorized to access this transaction.');
    error.statusCode = 403;
    throw error;
  }

  return transaction;
}

/**
 * Controllers
 */

 const transactionsController = {

  getPortfolioTransactions: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const portfolioId = parseInt(req.params.pId);
      await checkAndReturnPortfolio(req, portfolioId);
      const transactions = await TransactionRepo.findAllByPortfolioId(portfolioId);

      res.status(200).json({ transactions });
    } catch (err: any) {
      if (!err.statusCode) {
        err.statusCode = 500;
        err.message = 'Retrieving portfolios failed.';
      }
      next(err);
    }
  },

  getTransaction: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const transaction = await checkAndReturnTransaction(req, Number(req.params.id));

      res.status(200).json({ transaction });
    } catch (err: any) {
      if (!err.statusCode) {
        err.statusCode = 500;
        err.message = 'Retrieving transaction failed.';
      }
      next(err);
    }
  },

  getTransactions: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const transactions = await TransactionRepo.findAllByUserId(req.body.userId);

      res.status(200).json({ transactions });
    } catch (err: any) {
      if (!err.statusCode) {
        err.statusCode = 500;
        err.message = 'Retrieving transaction failed.';
      }
      next(err);
    }
  },

  createTransaction: async (req: AuthRequestBody<BaseTransaction>, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        const error: StatusError = new Error('Validation failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
      }
      const { portfolioId } = req.body;
      await checkAndReturnPortfolio(req, portfolioId);

      const transaction = await TransactionRepo.insert(req.body);

      res.status(200).json({ transaction });
    } catch (err: any) {
      if (!err.statusCode) {
        err.statusCode = 500;
        err.message = 'Creating portfolio failed.';
      }
      next(err);
    };
  },

  updateTransaction: async (req: AuthRequestBody<Transaction>, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        const error: StatusError = new Error('Validation failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
      }

      const { portfolioId } = req.body;
      await checkAndReturnPortfolio(req, portfolioId);
      const transactionId = parseInt(req.params.id);
      await checkAndReturnTransaction(req, transactionId);

      const updatedTransaction = await TransactionRepo.update({ ...req.body, id: transactionId });

      res.status(200).json({ transaction: updatedTransaction });
    } catch (err: any) {
      if (!err.statusCode) {
        err.statusCode = 500;
        err.message = 'Updating portfolio failed.';
      }
      next(err);
    };
  },

  deleteTransaction: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const transactionId = parseInt(req.params.id);
      await checkAndReturnTransaction(req, transactionId);

      const transaction = await TransactionRepo.delete(req.params.id);

      res.status(200).json({ transaction });
    } catch (err: any) {
      if (!err.statusCode) {
        err.statusCode = 500;
        err.message = 'Updating portfolio failed.';
      }
      next(err);
    };
  },
}

export default transactionsController;
