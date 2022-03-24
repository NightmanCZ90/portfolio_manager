/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.sql(`
    CREATE TABLE IF NOT EXISTS portfolios (
      id SERIAL PRIMARY KEY NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      name VARCHAR(20) NOT NULL,
      description VARCHAR(240),
      color CHAR(6),
      url TEXT,
      user_id INTEGER NOT NULL REFERENCES users(id),
      pm_id INTEGER REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS transactions (
      id SERIAL PRIMARY KEY NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      stock_name VARCHAR(20) NOT NULL,
      stock_sector VARCHAR(20),
      transaction_time TIMESTAMP WITH TIME ZONE NOT NULL,
      transaction_type VARCHAR(40) NOT NULL,
      num_shares NUMERIC NOT NULL,
      price NUMERIC NOT NULL,
      currency VARCHAR(4) NOT NULL,
      execution VARCHAR(20) NOT NULL,
      commissions NUMERIC,
      notes TEXT,
      user_id INTEGER NOT NULL REFERENCES users(id),
      portfolio_id INTEGER NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE
    );
  `);
};

exports.down = pgm => {
  pgm.sql(`
    DROP TABLE transactions;
    DROP TABLE portfolios;
  `);
};
