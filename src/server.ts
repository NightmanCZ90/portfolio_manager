import express from 'express';
import usersRoutes from './routes/users';

// without body-parser for now

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(usersRoutes);

export default app;
