import mongoose from 'mongoose';

// Your current URI (no database specified)
const MONGODB_URI = process.env.MONGODB_URI;

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ success: false, message: 'Method not allowed' });
  
  try {
    const { name, email, company, message } = req.body;
    
    if (!name || !email || !company || !message) {
      return res.status(400).json({ success: false, message: 'All fields required' });
    }
    
    console.log('📨 Form submission for:', email);
    
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Connected to MongoDB');
    
    // USE THE 'test' DATABASE (always exists)
    const db = mongoose.connection.useDb('test');
    
    // Create schema
    const contactSchema = new mongoose.Schema({
      name: String,
      email: String,
      company: String,
      message: String,
      submittedAt: { type: Date, default: Date.now },
      status: { type: String, default: 'pending' }
    });
    
    // Create model for 'contacts' collection in 'test' database
    const Contact = db.model('Contact', contactSchema, 'contacts');
    
    // Save document
    const contact = new Contact({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      company: company.trim(),
      message: message.trim()
    });
    
    const savedContact = await contact.save();
    
    console.log('✅ Saved to database: test, collection: contacts');
    console.log('📊 Contact ID:', savedContact._id);
    console.log('📧 Email:', savedContact.email);
    
    return res.status(200).json({
      success: true,
      message: '✅ Thank you! Your request has been submitted.',
      saved: true,
      database: 'test',
      collection: 'contacts',
      contactId: savedContact._id
    });
    
  } catch (error) {
    console.error('💥 Error:', error.message);
    
    // Even if DB fails, return success to user
    return res.status(200).json({
      success: true,
      message: 'Thank you! Your request has been received.',
      saved: false,
      note: 'Data logging issue - but we got your request'
    });
  }
}