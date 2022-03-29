import { Transaction } from '@prisma/client';
import { BaseTransaction } from '../models/transaction';
import { prisma } from '../server';

class TransactionRepo {

  static async findById(id: number): Promise<Transaction | null> {
    const transaction = await prisma.transaction.findUnique({ where: { id: Number(id) } });

    return transaction;
  }

  static async findAllByUserId(id: number): Promise<Transaction[]> {
    const transactions = await prisma.transaction.findMany({
      where: {
        portfolio: {
          userId: Number(id),
        },
      },
      orderBy: {
        transactionTime: 'asc'
      }
    });

    return transactions;
  }

  static async findAllByPortfolioId(id: number): Promise<Transaction[]> {
    const transactions = await prisma.transaction.findMany({
      where: {
        portfolioId: Number(id)
      },
      orderBy: {
        transactionTime: 'asc'
      }
    });

    return transactions;
  }

  static async insert(transaction: BaseTransaction): Promise<Transaction> {
    const { stockName, stockSector, transactionTime, transactionType, numShares, price, currency, execution, commissions, notes, portfolioId } = transaction;
    const createdTransaction = await prisma.transaction.create({
      data: {
        stockName,
        stockSector,
        transactionTime,
        transactionType,
        numShares: Number(numShares),
        price: Number(price),
        currency,
        execution,
        commissions: Number(commissions),
        notes,
        portfolioId: Number(portfolioId)
      }
    });

    return createdTransaction;
  }

  static async update(transaction: Transaction): Promise<Transaction> {
    const { stockName, stockSector, transactionTime, transactionType, numShares, price, currency, execution, commissions, notes, portfolioId, id } = transaction;
    const updatedTransaction = await prisma.transaction.update({
      where: { id: Number(id) },
      data: {
        updatedAt: new Date(),
        stockName,
        stockSector,
        transactionTime,
        transactionType,
        numShares: Number(numShares),
        price: Number(price),
        currency,
        execution,
        commissions: Number(commissions),
        notes,
        portfolioId: Number(portfolioId),
      }
    });

    return updatedTransaction;
  }

  static async delete(id: number): Promise<Transaction> {
    const deletedTransaction = await prisma.transaction.delete({ where: { id: Number(id) }});

    return deletedTransaction;
  }
}

export default TransactionRepo;
