const express = require('express');
const cors = require('cors');
const savingsRoutes = require('./routes/savingsRoutes');
const { PrismaClient } = require('@prisma/client'); 

const prisma = new PrismaClient();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/savings', savingsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));