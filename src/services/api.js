const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const apiService = {
  // Submit contact form
  async submitContact(formData) {
    const response = await fetch(`${API_URL}/contacts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    });
    return await response.json();
  },

  // Admin login (simplified)
  async adminLogin(credentials) {
    // In real app, this would be a proper login endpoint
    // For now, return a mock token
    return {
      success: true,
      token: 'admin123'
    };
  },

  // Get contacts for admin
  async getContacts(token, filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    const response = await fetch(`${API_URL}/admin/contacts?${queryParams}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return await response.json();
  },

  // Update contact status
  async updateContactStatus(token, contactId, status) {
    const response = await fetch(`${API_URL}/admin/contacts/${contactId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });
    return await response.json();
  },

  // Get statistics
  async getStatistics(token) {
    const response = await fetch(`${API_URL}/admin/statistics`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return await response.json();
  }
};