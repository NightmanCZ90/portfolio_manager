import { Portfolio, User } from '@prisma/client';
import { BasePortfolio } from '../models/portfolio';
import { prisma } from '../server';

class PortfolioRepo {

  static async findById(id: number): Promise<Portfolio | null> {
    const portfolio = await prisma.portfolio.findUnique({ where: { id: Number(id) } });

    return portfolio;
  }

  static async findAllByUserId(id: number): Promise<(Portfolio & { portfolioManager: User | null })[]> {
    const portfolios = await prisma.portfolio.findMany({
      where: {
        userId: Number(id)
      },
      orderBy: {
        id: 'asc'
      },
      include: {
        portfolioManager: true,
      },
    });

    return portfolios;
  }

  static async findAllByPmId(id: number): Promise<(Portfolio & { user: User })[]> {
    const portfolios = await prisma.portfolio.findMany({
      where: {
        pmId: Number(id)
      },
      orderBy: {
        id: 'asc'
      },
      include: {
        user: true
      }
    });

    return portfolios;
  }

  static async insert(portfolio: BasePortfolio, userId: number): Promise<Portfolio> {
    const { name, description, color, url, investorId } = portfolio;
    const createdPortfolio = await prisma.portfolio.create({
      data: {
        name,
        description,
        color,
        url,
        userId: investorId || Number(userId),
        pmId: investorId ? userId : null,
        confirmed: !Boolean(investorId),
      }
    });

    return createdPortfolio;
  }

  static async update(portfolio: Portfolio): Promise<Portfolio> {
    const { name, description, color, url, id } = portfolio;
    const updatedPortfolio = await prisma.portfolio.update({
      where: { id: Number(id) },
      data: {
        updatedAt: new Date(),
        name,
        description,
        color,
        url
      },
      include: {
        user: true,
        portfolioManager: true,
      }
    });

    return updatedPortfolio;
  }

  static async confirmPortfolio(portfolioId: number): Promise<Portfolio> {
    const confirmedPortfolio = await prisma.portfolio.update({
      where: { id: Number(portfolioId) },
      data: {
        updatedAt: new Date(),
        confirmed: true,
      }
    });

    return confirmedPortfolio;
  }

  static async linkPortfolio(portfolio: Portfolio, userId: number, investorId: number): Promise<Portfolio & { user: User, portfolioManager: User | null }> {
    const linkedPortfolio = await prisma.portfolio.update({
      where: { id: Number(portfolio.id) },
      data: {
        updatedAt: new Date(),
        confirmed: false,
        userId: investorId,
        pmId: userId,
      },
      include: {
        user: true,
        portfolioManager: true
      }
    });

    return linkedPortfolio;
  }

  static async unlinkPortfolio(portfolio: Portfolio, userId: number): Promise<Portfolio & { user: User } | null> {
    const newUserId = portfolio.userId !== userId ? portfolio.pmId : portfolio.userId;

    if (!newUserId) return null;

    const unlinkedPortfolio = await prisma.portfolio.update({
      where: { id: Number(portfolio.id) },
      data: {
        updatedAt: new Date(),
        confirmed: true,
        userId: newUserId,
        pmId: null,
      },
      include: {
        user: true,
      }
    });

    return unlinkedPortfolio;
  }

  static async delete(id: number): Promise<Portfolio> {
    const deletedPortfolio = await prisma.portfolio.delete({ where: { id: Number(id) } });

    return deletedPortfolio;
  }
}

export default PortfolioRepo;
