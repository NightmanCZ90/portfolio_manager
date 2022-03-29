import app, { prisma } from './server';
import config from './config';

const port = config.port || 8080;

try {
  prisma.$connect();
  app.listen(port, () => {
    console.log('Listening on port: ' + port);
  });
} catch (err) {
  console.error(err);
}
