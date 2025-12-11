require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Parse FRONTEND_URL as comma-separated list for multiple origins
const allowedOrigins = process.env.FRONTEND_URL 
  ? process.env.FRONTEND_URL.split(',').map(url => url.trim())
  : ['http://localhost:3000'];

console.log('🌐 Allowed CORS Origins:', allowedOrigins);

// Simplified CORS configuration - more permissive for development
const corsOptions = {
  origin: function (origin, callback) {
    // Allow all origins in development
    if (process.env.NODE_ENV === 'development') {
      return callback(null, true);
    }
    
    // In production, check against allowed list
    if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
      return callback(null, true);
    }
    
    console.log(`🚫 CORS blocked: ${origin}`);
    return callback(new Error('CORS not allowed'), false);
  },
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
let mongoConnected = false;

(async () => {
  mongoConnected = await connectDB();
  console.log(`📡 MongoDB Status: ${mongoConnected ? '✅ Connected' : '⚠️ Not Connected'}`);
})();

// Routes
const contactRoutes = require('./routes/contactRoutes');
const adminRoutes = require('./routes/adminRoutes');

app.use('/api/contacts', contactRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  const mongoose = require('mongoose');
  const dbStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected';
  
  res.json({ 
    status: 'OK', 
    timestamp: new Date(),
    server: 'Running',
    mongodb: dbStatus,
    environment: process.env.NODE_ENV || 'development'
  });
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ 
    message: '🚀 Backend is working!',
    timestamp: new Date(),
    mongodb: mongoConnected ? 'Connected' : 'Not Connected'
  });
});

// Root
app.get('/', (req, res) => {
  res.json({
    message: '🎯 SaaSuno Backend API',
    status: 'Live',
    mongodb: mongoConnected ? '✅ Connected' : '⚠️ Not Connected'
  });
});

// Start server
app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log(`🚀 SERVER STARTED on port ${PORT}`);
  console.log(`🌐 URL: http://localhost:${PORT}`);
  console.log(`🌍 CORS: ${process.env.NODE_ENV === 'development' ? 'All origins allowed (development)' : 'Restricted origins'}`);
  console.log(`📡 MongoDB: ${mongoConnected ? '✅ Connected' : '⚠️ Not Connected'}`);
  console.log('='.repeat(50));
});