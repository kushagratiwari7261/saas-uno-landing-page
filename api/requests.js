// api/requests.js
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      message: 'Method not allowed' 
    });
  }
  
  try {
    const { name, email, company, message } = req.body;
    
    console.log('📨 Form submission received:', { name, email, company });
    
    // Validation
    if (!name || !email || !company || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'All fields are required' 
      });
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please enter a valid email address' 
      });
    }
    
    // If no MongoDB URI, just return success (for testing)
    if (!MONGODB_URI) {
      console.log('⚠️ MONGODB_URI not set, skipping database save');
      return res.status(200).json({
        success: true,
        message: 'Thank you! Your request has been submitted.',
        timestamp: new Date().toISOString(),
        note: 'Database connection not configured'
      });
    }
    
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    // Define schema
    const contactSchema = new mongoose.Schema({
      name: String,
      email: String,
      company: String,
      message: String,
      submittedAt: { type: Date, default: Date.now },
      status: { type: String, default: 'pending' }
    });
    
    const Contact = mongoose.models.Contact || mongoose.model('Contact', contactSchema);
    
    // Save contact
    const contact = new Contact({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      company: company.trim(),
      message: message.trim()
    });
    
    await contact.save();
    
    console.log(`✅ Contact saved to database: ${email}`);
    
    return res.status(200).json({
      success: true,
      message: 'Thank you! Your request has been submitted.',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('💥 Error:', error);
    
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}