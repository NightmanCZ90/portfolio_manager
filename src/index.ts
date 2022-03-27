import app from './server';
import pool from './database/pool';
import config from './config';

const port = config.port || 8080;

/** Connecting to database */
pool.connect({
  host: config.pgHost,
  port: config.pgPort,
  database: config.pgDatabase,
  user: config.pgUser,
  password: config.pgPassword,
})
  .then(() => {
    /** Server activation */
    app.listen(port, () => {
      console.log('Listening on port: ' + port);
    });
  })
  .catch((err) => console.error(err));
