import { Portfolio } from '@prisma/client';
import { BasePortfolio } from '../models/portfolio';
import { prisma } from '../server';

class PortfolioRepo {

  static async findById(id: number): Promise<Portfolio | null> {
    const portfolio = await prisma.portfolio.findUnique({ where: { id: Number(id) } });

    return portfolio;
  }

  static async findAllByUserId(id: number): Promise<Portfolio[]> {
    const portfolios = await prisma.portfolio.findMany({
      where: {
        userId: Number(id)
      },
      orderBy: {
        id: 'asc'
      }
    });

    return portfolios;
  }

  static async findAllByPmId(id: number): Promise<Portfolio[]> {
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

  static async insert(portfolio: BasePortfolio): Promise<Portfolio> {
    const { name, description, color, url, userId, pmId } = portfolio;
    const createdPortfolio = await prisma.portfolio.create({
      data: {
        name,
        description,
        color,
        url,
        userId: Number(userId),
        pmId: Number(pmId) || null,
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

  static async delete(id: number): Promise<Portfolio> {
    const deletedPortfolio = await prisma.portfolio.delete({ where: { id: Number(id) } });

    return deletedPortfolio;
  }
}

export default PortfolioRepo;
