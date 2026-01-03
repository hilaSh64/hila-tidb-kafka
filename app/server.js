import express from 'express';
import cors from 'cors';
import { createConnection } from './db/connection.js';
import itemsRouter from './routes/items.js';
import authRouter from './routes/auth.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors()); // Enable CORS for frontend requests
app.use(express.json()); // Parse JSON request bodies

// Initialize database connection
const db = await createConnection();

// Routes
app.use('/api/auth', authRouter);
app.use('/api/items', itemsRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export { db };

