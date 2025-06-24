const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const accountsRoutes = require('./routes/accounts.routes');
const authRoutes = require('./routes/auth.routes');
const transactionRoutes = require('./routes/transaction.routes');

const app = express();

// Middleware
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173", // ✅ Your frontend origin exactly
    credentials: true,               // ✅ Allows cookies & Authorization header
  })
);
app.use(express.json());

// Global Rate Limiter: 100 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use(limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/accounts', accountsRoutes);
app.use('/api/transactions', transactionRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));