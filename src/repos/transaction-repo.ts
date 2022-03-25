import pool from '../database/pool';
import { Transaction } from '../models/transaction';
import { toCamelCase } from '../utils/helpers';

class TransactionRepo {

  static async insert(transaction: Transaction) {
    const { stockName, stockSector, transactionTime, transactionType, numShares, price, currency, execution, commissions, notes, userId, portfolioId } = transaction;
    const { rows } = await pool.query(`
      INSERT INTO transactions (stock_name, stock_sector, transaction_time, transaction_type, num_shares, price, currency, execution, commissions, notes, user_id, portfolio_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *;
      `, [stockName, stockSector, transactionTime, transactionType, numShares, price, currency, execution, commissions, notes, userId, portfolioId]
    ) || {};
    if (!rows) return null;

    return toCamelCase(rows)[0];
  }
}

export default TransactionRepo;
