import pool from '../database/pool';
import { Auth } from '../models/auth';
import { BaseUser, User } from '../models/user';
import { toCamelCase } from '../utils/helpers';

class UserRepo {

  static async find(): Promise<User[]> {
    const { rows } = await pool.query('SELECT * FROM users;', []) || {};

    return toCamelCase(rows!);
  }

  static async findById(id: number): Promise<User> {
    const { rows } = await pool.query(
      'SELECT * FROM users WHERE id = $1;',
      [id]
    ) || {};

    return toCamelCase(rows!)[0];
  }

  static async findByEmail(email: string): Promise<User> {
    const { rows } = await pool.query(
      'SELECT * FROM users WHERE email = $1;',
      [email]
    ) || {};

    return toCamelCase(rows!)[0];
  }

  static async register({ email, password }: Auth): Promise<User> {
    const { rows } = await pool.query(
      'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *;',
      [email, password]
    ) || {};

    return toCamelCase(rows!)[0];
  }

  // for testing purposes
  static async _insert(user: BaseUser): Promise<User> {
    const { email, password, firstName, lastName, role } = user;
    const { rows } = await pool.query(
      'INSERT INTO users (email, password, first_name, last_name, role) VALUES ($1, $2, $3, $4, $5) RETURNING *;',
      [email, password, firstName, lastName, role]
    ) || {};

    return toCamelCase(rows!)[0];
  }

  static async update(user: User): Promise<User> {
    const { id, firstName, lastName, role } = user;
    const { rows } = await pool.query(`
      UPDATE users
      SET first_name = $1, last_name = $2, role = $3, updated_at = NOW()
      WHERE id = $4 RETURNING *;
    `, [firstName, lastName, role, id]
    ) || {};

    return toCamelCase(rows!)[0];
  }
}

export default UserRepo;
