import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import { connectDB } from './config/db.js';

import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import purchaseRoutes from './routes/purchases.js';
import reportRoutes from './routes/reports.js';
import shoppingRoutes from './routes/shopping.js';
import stockHistoryRoutes from './routes/stockHistory.js';

const app = express();

// ========================================
// MIDDLEWARE
// ========================================

app.use(helmet());

// ========================================
// CORS
// ========================================

const allowedOrigins = [
  'https://home-stock-mu.vercel.app',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without an Origin header
      // (Postman, server-to-server, health checks, etc.)
      if (!origin) {
        return callback(null, true);
      }

      // Allow deployed Vercel frontend
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Allow local Vite development on any port
      if (
        origin.startsWith('http://localhost:') ||
        origin.startsWith('http://127.0.0.1:')
      ) {
        return callback(null, true);
      }

      return callback(new Error(`Not allowed by CORS: ${origin}`));
    },

    credentials: true,

    methods: [
      'GET',
      'POST',
      'PUT',
      'PATCH',
      'DELETE',
      'OPTIONS'
    ],

    allowedHeaders: [
      'Content-Type',
      'Authorization'
    ]
  })
);

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

app.use(morgan('dev'));

// ========================================
// HEALTH / TEST ROUTE
// ========================================

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'HomeStock API is running'
  });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    service: 'HomeStock API'
  });
});

// ========================================
// API ROUTES
// ========================================

app.use('/api/auth', authRoutes);

app.use('/api/products', productRoutes);

app.use('/api/purchases', purchaseRoutes);

app.use('/api/reports', reportRoutes);

app.use('/api/shopping', shoppingRoutes);

app.use('/api/stock-history', stockHistoryRoutes);

// ========================================
// 404 HANDLER
// ========================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`
  });
});

// ========================================
// ERROR HANDLER
// ========================================

app.use((err, req, res, next) => {
  console.error('Server Error:', err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// ========================================
// START SERVER
// ========================================

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`HomeStock API running on ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();