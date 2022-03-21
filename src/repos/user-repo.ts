import pool from '../database/pool';
import { Auth } from '../models/auth';
import { User } from '../models/user';
import toCamelCase from './utils/to-camel-case';

class UserRepo {
  static async find() {
    const { rows } = await pool.query('SELECT * FROM users;', []) || {};
    if (!rows) return null;

    return toCamelCase(rows);
  }

  static async findById(id: number) {
    const { rows } = await pool.query(
      'SELECT * FROM users WHERE id = $1;',
      [id]
    ) || {};
    if (!rows) return null;

    return toCamelCase(rows)[0];
  }

  static async findByEmail(email: string) {
    const { rows } = await pool.query(
      'SELECT * FROM users WHERE email = $1;',
      [email]
    ) || {};
    if (!rows) return null;

    return toCamelCase(rows)[0];
  }

  static async register({ email, password }: Auth) {
    const { rows } = await pool.query(
      'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *;',
      [email, password]
    ) || {};
    if (!rows) return null;

    return toCamelCase(rows)[0];
  }

  static async insert(user: User) {
    const { email, password, firstName, lastName, role } = user;
    const { rows } = await pool.query(
      'INSERT INTO users (email, password, first_name, last_name, role) VALUES ($1, $2, $3, $4, $5) RETURNING *;',
      [email, password, firstName, lastName, role]
    ) || {};
    if (!rows) return null;

    return toCamelCase(rows)[0];
  }

  // static async update(id, username, bio) {
  //   const { rows } = await pool.query(
  //     'UPDATE users SET username = $1, bio = $2 WHERE id = $3 RETURNING *;',
  //     [username, bio, id]
  //   ) || {};

  //   return toCamelCase(rows)[0];
  // }

  // static async delete(id) {
  //   const { rows } = await pool.query(
  //     'DELETE FROM users WHERE id = $1 RETURNING *;',
  //     [id]
  //   ) || {};

  //   return toCamelCase(rows)[0];
  // }

  // static async count() {
  //   const { rows } = await pool.query('SELECT COUNT(*) FROM users;') || {};

  //   return parseInt(rows[0].count);
  // }
}

export default UserRepo;
