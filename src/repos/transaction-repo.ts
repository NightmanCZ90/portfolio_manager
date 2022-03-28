import pool from '../database/pool';
import { BaseTransaction, Transaction } from '../models/transaction';
import { toCamelCase } from '../utils/helpers';

class TransactionRepo {

  static async findById(id: number): Promise<Transaction> {
    const { rows } = await pool.query(
      'SELECT * FROM transactions WHERE id = $1;',
      [id]
    ) || {};

    return toCamelCase(rows!)[0];
  }

  static async findAllByUserId(id: number): Promise<Transaction[]> {
    const { rows } = await pool.query(
      'SELECT * FROM transactions WHERE user_id = $1 ORDER BY transaction_time;',
      [id]
    ) || {};

    return toCamelCase(rows!);
  }

  static async findAllByPortfolioId(id: number): Promise<Transaction[]> {
    const { rows } = await pool.query(
      'SELECT * FROM transactions WHERE portfolio_id = $1 ORDER BY transaction_time;',
      [id]
    ) || {};

    return toCamelCase(rows!);
  }

  static async insert(transaction: BaseTransaction): Promise<Transaction> {
    const { stockName, stockSector, transactionTime, transactionType, numShares, price, currency, execution, commissions, notes, portfolioId } = transaction;

    const { rows } = await pool.query(`
      INSERT INTO transactions (stock_name, stock_sector, transaction_time, transaction_type, num_shares, price, currency, execution, commissions, notes, portfolio_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *;
      `, [stockName, stockSector, transactionTime, transactionType, numShares, price, currency, execution, commissions, notes, portfolioId]
    ) || {};

    return toCamelCase(rows!)[0];
  }

  static async update(transaction: Transaction): Promise<Transaction> {
    const { stockName, stockSector, transactionTime, transactionType, numShares, price, currency, execution, commissions, notes, portfolioId, id } = transaction;

    const { rows } = await pool.query(`
      UPDATE transactions
      SET stock_name = $1, stock_sector = $2, transaction_time = $3, transaction_type = $4, num_shares = $5, price = $6, currency = $7, execution = $8, commissions = $9, notes = $10, portfolio_id = $11, updated_at = NOW()
      WHERE id = $12 RETURNING *;
    `, [stockName, stockSector, transactionTime, transactionType, numShares, price, currency, execution, commissions, notes, portfolioId, id]
    ) || {};

    return toCamelCase(rows!)[0];
  }

  static async delete(id: string): Promise<Transaction> {
    const { rows } = await pool.query(
      'DELETE FROM transactions WHERE id = $1 RETURNING *;',
      [id]
    ) || {};

    return toCamelCase(rows!)[0];
  }
}

export default TransactionRepo;
