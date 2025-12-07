// api/admin/requests.js
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Simple authentication check
  const authHeader = req.headers.authorization;
  const ADMIN_SECRET = process.env.ADMIN_SECRET || 'admin-secret-key';
  
  if (!authHeader || authHeader !== `Bearer ${ADMIN_SECRET}`) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized'
    });
  }
  
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      success: false, 
      message: 'Method not allowed' 
    });
  }
  
  try {
    // For now, return empty array or test data
    // You can add MongoDB connection later
    
    return res.status(200).json({
      success: true,
      requests: [],
      message: 'No data yet. Set up MongoDB to see submissions.',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('💥 Admin API error:', error);
    
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}