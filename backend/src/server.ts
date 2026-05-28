import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';

import { connectDb } from './config/db';
import { analysisRouter } from './routes/analysisRoutes';
import { authRouter } from './routes/authRoutes';

dotenv.config();

const app = express();
const port = process.env.PORT ?? 5000;

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'sonaris-backend' });
});

app.use('/api/auth', authRouter);
app.use('/api/analyses', analysisRouter);

async function startServer() {
  await connectDb();

  app.listen(port);
}

startServer().catch((error) => {
  console.error('Failed to start Sonaris backend:', error);
  process.exit(1);
});
