import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import contentRoutes from './routes/content.routes.js';
import approvalRoutes from './routes/approval.routes.js';
import broadcastRoutes from './routes/broadcast.routes.js';

dotenv.config();

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/auth', authRoutes);
app.use('/content', broadcastRoutes); 
app.use('/content', contentRoutes);
app.use('/approval', approvalRoutes);

// Basic health check route
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Content Broadcasting API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

export default app;

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});