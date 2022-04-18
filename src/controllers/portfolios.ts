import { NextFunction, Response } from 'express';
import { validationResult } from 'express-validator';
import { BasePortfolio } from '../models/portfolio';
import { AuthRequest, AuthRequestBody } from '../models/routes';
import PortfolioRepo from '../repos/portfolio-repo';
import { StatusError } from '../server';

/**
 * Helpers
 */

export const checkAndReturnPortfolio = async (req: AuthRequest, portfolioId: number) => {
  const portfolio = await PortfolioRepo.findById(portfolioId);

  if (!portfolio) {
    const error: StatusError = new Error('Portfolio with this id does not exist.');
    error.statusCode = 404;
    throw error;
  }

  if (req.body.userId !== portfolio.userId && req.body.userId !== portfolio.pmId) {
    const error: StatusError = new Error('Not authorized to access this portfolio.');
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
      const managing = await PortfolioRepo.findAllByPmId(req.body.userId);

      const personal = portfolios.filter(portfolio => !portfolio.pmId);
      const managed = portfolios.filter(portfolio => portfolio.pmId);

      res.status(200).json({ managed, managing, personal });
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
      const portfolio = await checkAndReturnPortfolio(req, parseInt(req.params.id));

      res.status(200).json({ ...portfolio });
    } catch (err: any) {
      if (!err.statusCode) {
        err.statusCode = 500;
        err.message = 'Retrieving portfolio failed.';
      }
      next(err);
    };
  },

  createPortfolio: async (req: AuthRequestBody<BasePortfolio>, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        const error: StatusError = new Error('Validation failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
      }

      const { name, description, color, url, userId, investorId } = req.body;

      const portfolio = await PortfolioRepo.insert({ name, description, color, url, investorId }, userId);

      res.status(200).json({ ...portfolio });
    } catch (err: any) {
      if (!err.statusCode) {
        err.statusCode = 500;
        err.message = 'Creating portfolio failed.';
      }
      next(err);
    };
  },

  updatePortfolio: async (req: AuthRequestBody<BasePortfolio>, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        const error: StatusError = new Error('Validation failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
      }

      const portfolio = await checkAndReturnPortfolio(req, parseInt(req.params.id));
      const { name, description, color, url, userId } = req.body;

      /** Check whether portfolio is managed. Only PM can update managed portfolio */
      if (portfolio.pmId && portfolio.pmId !== userId) {
        const error: StatusError = new Error('Only portfolio managers can update this portfolio.');
        error.statusCode = 403;
        throw error;
      }

      const updatedPortfolio = await PortfolioRepo.update({ ...portfolio, name, description, color, url });

      res.status(200).json({ ...updatedPortfolio });
    } catch (err: any) {
      if (!err.statusCode) {
        err.statusCode = 500;
        err.message = 'Updating portfolio failed.';
      }
      next(err);
    };
  },

  confirmPortfolio: async (req: AuthRequestBody<BasePortfolio>, res: Response, next: NextFunction) => {
    try {
      const portfolio = await checkAndReturnPortfolio(req, parseInt(req.params.id));

      const confirmedPortfolio = await PortfolioRepo.confirmPortfolio(portfolio.id);

      res.status(200).json({ ...confirmedPortfolio });
    } catch (err: any) {
      if (!err.statusCode) {
        err.statusCode = 500;
        err.message = 'Confirming portfolio failed.';
      }
      next(err);
    };
  },

  unlinkPortfolio: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        const error: StatusError = new Error('Validation failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
      }

      const portfolio = await checkAndReturnPortfolio(req, parseInt(req.params.id));
      const { userId } = req.body;

      const updatedPortfolio = await PortfolioRepo.unlinkPortfolio(portfolio, userId);

      if (!updatedPortfolio) {
        const error: StatusError = new Error('Unlinking portfolio failed.');
        error.statusCode = 500;
        throw error;
      }

      res.status(200).json({ ...updatedPortfolio });
    } catch (err: any) {
      if (!err.statusCode) {
        err.statusCode = 500;
        err.message = 'Unlinking portfolio failed.';
      }
      next(err);
    };
  },

  deletePortfolio: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const portfolioId = Number(req.params.id);
      const portfolio = await checkAndReturnPortfolio(req, portfolioId);

      /** Check whether portfolio is managed. Only PM can delete managed portfolio */
      if (portfolio.pmId && portfolio.pmId !== req.body.userId) {
        const error: StatusError = new Error('Only portfolio managers can delete this portfolio.');
        error.statusCode = 403;
        throw error;
      }

      await PortfolioRepo.delete(portfolioId);

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
