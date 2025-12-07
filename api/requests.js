// api/requests.js
import mongoose from 'mongoose';

// Use environment variable with fallback
const MONGODB_URI = process.env.MONGODB_URI;

// Simple test to see if URI exists
console.log('MONGODB_URI exists:', !!MONGODB_URI);
if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI is not defined in environment variables');
}

let isConnected = false;

async function connectDB() {
  if (isConnected) {
    console.log('✅ Using existing MongoDB connection');
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = true;
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    throw error;
  }
}

// Define Schema
const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  company: String,
  message: String,
  submittedAt: { type: Date, default: Date.now },
  status: { type: String, default: 'pending' }
});

// Use existing model or create new one
const Contact = mongoose.models.Contact || mongoose.model('Contact', contactSchema);

export default async function handler(req, res) {
  // Log the request
  console.log(`📨 ${req.method} request to /api/requests`);
  
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    console.log('🛫 Handling OPTIONS preflight request');
    return res.status(200).end();
  }
  
  // Only accept POST
  if (req.method !== 'POST') {
    console.log('❌ Method not allowed:', req.method);
    return res.status(405).json({ 
      success: false, 
      message: 'Method not allowed. Use POST.' 
    });
  }
  
  try {
    console.log('📊 Request body:', JSON.stringify(req.body));
    
    const { name, email, company, message } = req.body;
    
    // Basic validation
    if (!name || !email || !company || !message) {
      console.log('❌ Missing fields');
      return res.status(400).json({ 
        success: false, 
        message: 'All fields are required: name, email, company, message' 
      });
    }
    
    // Connect to database
    console.log('🔗 Connecting to MongoDB...');
    await connectDB();
    
    // Create and save contact
    const contact = new Contact({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      company: company.trim(),
      message: message.trim()
    });
    
    console.log('💾 Saving contact to database...');
    const savedContact = await contact.save();
    console.log('✅ Contact saved with ID:', savedContact._id);
    
    return res.status(201).json({
      success: true,
      message: 'Thank you! Your request has been submitted successfully.',
      requestId: savedContact._id,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('💥 Server error:', error);
    
    // Specific error handling
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error: ' + error.message
      });
    }
    
    if (error.name === 'MongoNetworkError' || error.name === 'MongoServerSelectionError') {
      return res.status(503).json({
        success: false,
        message: 'Database connection failed. Please try again later.'
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}