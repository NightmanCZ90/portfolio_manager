/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.sql(`
    CREATE TABLE IF NOT EXISTS transactions (
      id SERIAL PRIMARY KEY NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      stock_name VARCHAR(20),
      stock_sector VARCHAR(20),
      transaction_time TIMESTAMP WITH TIME ZONE NOT NULL,
      transaction_type VARCHAR(40),
      num_shares INTEGER,
      price NUMERIC,
      currency VARCHAR(4),
      commissions NUMERIC,
      notes TEXT,
      user_id INTEGER NOT NULL REFERENCES users(id),
      transaction_made_by_pm BOOLEAN
    );
  `);
};

exports.down = pgm => {
  pgm.sql(`
    DROP TABLE transactions;
  `);
};
