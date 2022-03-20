import express from 'express';

// without body-parser for now

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

export default app;
