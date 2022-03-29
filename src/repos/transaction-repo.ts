import { Transaction } from '@prisma/client';
import pool from '../database/pool';
import { BaseTransaction } from '../models/transaction';
import { prisma } from '../server';
import { toCamelCase } from '../utils/helpers';

class TransactionRepo {

  static async findById(id: number): Promise<Transaction | null> {
    const transaction = await prisma.transaction.findUnique({ where: { id } });

    return transaction;
  }

  static async findAllByUserId(id: number): Promise<Transaction[]> {
    // const portfolioIds = await prisma.portfolio.findMany({ where: { userId: id }, select: { id: true } });
    // const transactions = await prisma.transaction.findMany({ where: { portfolioId: []}})
    // const portfolios = await prisma.portfolio.findMany({ where: { userId: id }, include: { transactions: true } });

    // const transactions = portfolios.map(portfolio => portfolio.transactions);

    // return ...transactions;

    const transactions = await prisma.transaction.findMany({
      where: {
        portfolio: {
          userId: id,
        },
      },
    });

    return transactions;
  }

  static async findAllByPortfolioId(id: number): Promise<Transaction[]> {
    const transactions = await prisma.transaction.findMany({ where: { portfolioId: id } });

    return transactions;
  }

  static async insert(transaction: BaseTransaction): Promise<Transaction> {
    const createdTransaction = await prisma.transaction.create({ data: transaction });

    return createdTransaction;
  }

  static async update(transaction: Transaction): Promise<Transaction> {
    const { stockName, stockSector, transactionTime, transactionType, numShares, price, currency, execution, commissions, notes, portfolioId, id } = transaction;
    const updatedTransaction = await prisma.transaction.update({
      where: { id },
      data: {
        stockName,
        stockSector,
        transactionTime,
        transactionType,
        numShares,
        price,
        currency,
        execution,
        commissions,
        notes,
        portfolioId,
      }
    });

    return updatedTransaction;
  }

  static async delete(id: number): Promise<Transaction> {
    const deletedTransaction = await prisma.transaction.delete({ where: { id }});

    return deletedTransaction;
  }
}

export default TransactionRepo;
