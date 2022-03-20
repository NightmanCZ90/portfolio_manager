import pg from 'pg';

// wrapping Pool for testing purposes
// and being able to reconnect to a different database
class Pool {
  _pool: pg.Pool | null = null;

  connect(options: pg.PoolConfig) {
    this._pool = new pg.Pool(options);
    return this._pool.query('SELECT 1 + 1;');
  }

  close() {
    if (!this._pool) return;
    return this._pool.end();
  }

  query(sql: any, params: any) {
    if (!this._pool) return;
    return this._pool.query(sql, params);
  }
}

export default new Pool();
