import app from './server';
import pool from './database/pool';
import config from './config';

const port = Number(config.port || 8080);

pool.connect({
  host: config.pgHost,
  port: config.pgPort,
  database: config.pgDatabase,
  user: config.pgUser,
  password: config.pgPassword,
})
  .then(() => {
    app.listen(port, () => {
      console.log('Listening on port: ' + port);
    });
  })
  .catch((err) => console.error(err));
