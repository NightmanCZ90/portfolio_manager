import pool from '../database/pool';
import { BasePortfolio, Portfolio } from '../models/portfolio';
import { toCamelCase } from '../utils/helpers';

class PortfolioRepo {

  static async findById(id: number): Promise<Portfolio> {
    const { rows } = await pool.query(
      'SELECT * FROM portfolios WHERE id = $1;',
      [id]
    ) || {};

    return toCamelCase(rows!)[0];
  }

  static async findAllByUserId(id: number): Promise<Portfolio[]> {
    const { rows } = await pool.query(
      'SELECT * FROM portfolios WHERE user_id = $1 ORDER BY id;',
      [id]
    ) || {};

    return toCamelCase(rows!);
  }

  static async findAllByPmId(id: number): Promise<Portfolio[]> {
    const { rows } = await pool.query(
      'SELECT * FROM portfolios WHERE pm_id = $1 ORDER BY id;',
      [id]
    ) || {};

    return toCamelCase(rows!);
  }

  static async insert(portfolio: BasePortfolio): Promise<Portfolio> {
    const { name, description, color, url, userId, pmId } = portfolio;
    const { rows } = await pool.query(`
      INSERT INTO portfolios (name, description, color, url, user_id, pm_id)
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;
      `, [name, description, color, url, userId, pmId]
    ) || {};

    return toCamelCase(rows!)[0];
  }

  static async update(portfolio: Portfolio): Promise<Portfolio> {
    const { name, description, color, url, id } = portfolio;
    const { rows } = await pool.query(`
      UPDATE portfolios
      SET name = $1, description = $2, color = $3, url = $4, updated_at = NOW()
      WHERE id = $5 RETURNING *;
    `, [name, description, color, url, id]
    ) || {};

    return toCamelCase(rows!)[0];
  }

  static async delete(id: string): Promise<Portfolio> {
    const { rows } = await pool.query(
      'DELETE FROM portfolios WHERE id = $1 RETURNING *;',
      [id]
    ) || {};

    return toCamelCase(rows!)[0];
  }
}

export default PortfolioRepo;
