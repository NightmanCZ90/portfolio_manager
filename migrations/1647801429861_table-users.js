/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.sql(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      email VARCHAR(40) NOT NULL,
      password VARCHAR(40) NOT NULL,
      role VARCHAR(20)
    );
  `);
};

exports.down = pgm => {
  pgm.sql(`
    DROP TABLE users;
  `);
};
