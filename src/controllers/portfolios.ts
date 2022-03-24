import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { Portfolio } from '../models/portfolio';
import { AuthRequest, AuthRequestBody } from '../models/routes';
import PortfolioRepo from '../repos/portfolio-repo';
import { StatusError } from '../server';

/**
 * Helpers
 */

const checkAndReturnPortfolio = async (req: AuthRequest) => {
  const { id } = req.params;
  const portfolioId = parseInt(id);

  const portfolio = await PortfolioRepo.findById(portfolioId);

  if (!portfolio) {
    const error: StatusError = new Error('Portfolio with this id does not exist.');
    error.statusCode = 404;
    throw error;
  }

  if (req.body.userId !== portfolio.userId) {
    const error: StatusError = new Error('Not authorized.');
    error.statusCode = 403;
    throw error;
  }

  return portfolio;
}

/**
 * Controllers
 */

const portfoliosController = {

  getUsersPortfolios: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const portfolios = await PortfolioRepo.findAllByUserId(req.body.userId);
      res.status(200).json({ portfolios });
    } catch (err: any) {
      if (!err.statusCode) {
        err.statusCode = 500;
        err.message = 'Retrieving portfolios failed.';
      }
      next(err);
    }
  },

  getPortfolio: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        const error: StatusError = new Error('Validation failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
      }
      const portfolio = await checkAndReturnPortfolio(req);

      res.status(200).json({ portfolio });
    } catch (err: any) {
      if (!err.statusCode) {
        err.statusCode = 500;
        err.message = 'Retrieving portfolio failed.';
      }
      next(err);
    };
  },

  createPortfolio: async (req: AuthRequestBody<Portfolio>, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        const error: StatusError = new Error('Validation failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
      }

      const { name, description, color, url, userId } = req.body;

      // TODO: implement Portfolio Manager - pmId
      const portfolio = await PortfolioRepo.insert({ name, description, color, url, userId, pmId: null });

      res.status(200).json({ portfolio });
    } catch (err: any) {
      if (!err.statusCode) {
        err.statusCode = 500;
        err.message = 'Creating portfolio failed.';
      }
      next(err);
    };
  },

  updatePortfolio: async (req: AuthRequestBody<Portfolio>, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        const error: StatusError = new Error('Validation failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
      }

      const portfolio = await checkAndReturnPortfolio(req);
      const { name, description, color, url } = req.body;

      const updatedPortfolio = await PortfolioRepo.update({ ...portfolio, name, description, color, url });

      res.status(200).json({ portfolio: updatedPortfolio });
    } catch (err: any) {
      if (!err.statusCode) {
        err.statusCode = 500;
        err.message = 'Updating portfolio failed.';
      }
      next(err);
    };
  },

  deletePortfolio: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        const error: StatusError = new Error('Validation failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
      }

      await checkAndReturnPortfolio(req);
      await PortfolioRepo.delete(req.params.id);

      res.status(200).json({ message: 'Success.' });
    } catch (err: any) {
      if (!err.statusCode) {
        err.statusCode = 500;
        err.message = 'Deleting portfolio failed.';
      }
      next(err);
    };
  }
}

export default portfoliosController;
