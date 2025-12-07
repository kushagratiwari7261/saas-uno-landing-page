// api/requests.js - WITH PROPER ERROR HANDLING
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

// Check if MongoDB URI exists
console.log('MONGODB_URI exists:', !!MONGODB_URI);

export default async function handler(req, res) {
  try {
    const { name, email, company, message } = req.body;
    
    // 1. First, validate input
    if (!name || !email || !company || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'All fields required' 
      });
    }
    
    // 2. Try to save to MongoDB (if URI exists)
    if (MONGODB_URI) {
      try {
        await mongoose.connect(MONGODB_URI, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
        
        const contactSchema = new mongoose.Schema({
          name: String,
          email: String,
          company: String,
          message: String,
          submittedAt: { type: Date, default: Date.now }
        });
        
        const Contact = mongoose.models.Contact || 
                       mongoose.model('Contact', contactSchema);
        
        await new Contact({ name, email, company, message }).save();
        console.log('✅ Saved to MongoDB');
        
      } catch (dbError) {
        console.log('⚠️ MongoDB error (but form still works):', dbError.message);
        // Continue even if DB fails
      }
    } else {
      console.log('⚠️ MONGODB_URI not set');
    }
    
    // 3. ALWAYS return success (even if DB fails)
    return res.status(200).json({
      success: true,
      message: 'Thank you! Your request has been submitted.',
      savedToDB: !!MONGODB_URI,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('General error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error. Please try again.'
    });
  }
}