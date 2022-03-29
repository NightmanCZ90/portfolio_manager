import { Portfolio } from '@prisma/client';
import pool from '../database/pool';
import { BasePortfolio } from '../models/portfolio';
import { prisma } from '../server';
import { toCamelCase } from '../utils/helpers';

class PortfolioRepo {

  static async findById(id: number): Promise<Portfolio | null> {
    const portfolio = await prisma.portfolio.findUnique({ where: { id } });

    return portfolio;
  }

  static async findAllByUserId(id: number): Promise<Portfolio[]> {
    const portfolios = await prisma.portfolio.findMany({ where: { userId: id } });

    return portfolios;
  }

  static async findAllByPmId(id: number): Promise<Portfolio[]> {
    const portfolios = await prisma.portfolio.findMany({ where: { pmId: id } });

    return portfolios;
  }

  static async insert(portfolio: BasePortfolio): Promise<Portfolio> {
    const createdPortfolio = await prisma.portfolio.create({ data: portfolio });

    return createdPortfolio;
  }

  static async update(portfolio: Portfolio): Promise<Portfolio> {
    const { name, description, color, url, id } = portfolio;
    const updatedPortfolio = await prisma.portfolio.update({
      where: { id },
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

  static async delete(id: number): Promise<Portfolio> {
    const deletedPortfolio = await prisma.portfolio.delete({ where: { id } });

    return deletedPortfolio;
  }
}

export default PortfolioRepo;
