import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    contacted: 0,
    archived: 0,
    today: 0
  });
  
  const [filters, setFilters] = useState({
    status: 'all',
    dateRange: 'all',
    search: ''
  });
  
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authToken, setAuthToken] = useState('');

  // Check if already authenticated
  useEffect(() => {
    const auth = localStorage.getItem('admin_auth');
    const token = localStorage.getItem('admin_token');
    
    if (auth === 'true' && token) {
      setIsAuthenticated(true);
      setAuthToken(token);
      fetchRequests(token);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setError('');
      const apiUrl = window.location.hostname === 'localhost' 
        ? 'http://localhost:3000/api/admin/auth'
        : '/api/admin/auth';
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (data.success && data.token) {
        setIsAuthenticated(true);
        setAuthToken(data.token);
        localStorage.setItem('admin_auth', 'true');
        localStorage.setItem('admin_token', data.token);
        fetchRequests(data.token);
      } else {
        setError(data.message || 'Invalid password');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Network error. Please try again.');
      
      // Fallback: Use local mode or test data
      if (window.location.hostname === 'localhost') {
        setIsAuthenticated(true);
        setAuthToken('test-token');
        localStorage.setItem('admin_auth', 'true');
        localStorage.setItem('admin_token', 'test-token');
        loadTestData();
      }
    }
  };

  const fetchRequests = async (token) => {
    try {
      setLoading(true);
      setError('');
      
      const apiUrl = window.location.hostname === 'localhost' 
        ? 'http://localhost:3000/api/admin/requests'
        : '/api/admin/requests';
      
      console.log('Fetching from:', apiUrl);
      
      const response = await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        setRequests(data.requests || []);
        updateStats(data.requests || []);
      } else {
        setError(data.message || 'Failed to fetch requests');
        
        // If 401 (unauthorized), logout
        if (response.status === 401) {
          logout();
        }
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setError('Network error. Please check your connection.');
      
      // For localhost or if API fails, load test data
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        loadTestData();
      }
    } finally {
      setLoading(false);
    }
  };

  const loadTestData = () => {
    const testData = [
      {
        _id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        company: 'Tech Corp',
        message: 'Interested in SaaS development services for our new project. We need a custom CRM solution.',
        submittedAt: new Date().toISOString(),
        status: 'pending',
        contactedAt: null,
        notes: '',
        ip: '192.168.1.1',
        userAgent: 'Chrome/120.0.0.0'
      },
      {
        _id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        company: 'Startup Inc',
        message: 'Looking for digital transformation consultation for our e-commerce platform.',
        submittedAt: new Date(Date.now() - 86400000).toISOString(), // Yesterday
        status: 'contacted',
        contactedAt: new Date(Date.now() - 43200000).toISOString(),
        notes: 'Called customer, scheduled follow-up meeting',
        ip: '192.168.1.2',
        userAgent: 'Firefox/119.0'
      },
      {
        _id: '3',
        name: 'Bob Johnson',
        email: 'bob@example.com',
        company: 'Enterprise Solutions',
        message: 'Need help migrating our legacy systems to cloud infrastructure.',
        submittedAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        status: 'archived',
        contactedAt: new Date(Date.now() - 86400000).toISOString(),
        notes: 'Project completed successfully',
        ip: '192.168.1.3',
        userAgent: 'Safari/17.0'
      }
    ];
    
    setRequests(testData);
    updateStats(testData);
    setLoading(false);
  };

  const updateStats = (requestsList) => {
    const total = requestsList.length;
    const pending = requestsList.filter(r => r.status === 'pending').length;
    const contacted = requestsList.filter(r => r.status === 'contacted').length;
    const archived = requestsList.filter(r => r.status === 'archived').length;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayCount = requestsList.filter(r => 
      new Date(r.submittedAt) >= today
    ).length;
    
    setStats({ total, pending, contacted, archived, today: todayCount });
  };

  const updateRequestStatus = async (id, newStatus, notes = '') => {
    try {
      const apiUrl = window.location.hostname === 'localhost' 
        ? `http://localhost:3000/api/admin/requests?id=${id}`
        : `/api/admin/requests?id=${id}`;
      
      const response = await fetch(apiUrl, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ 
          status: newStatus,
          notes: notes
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        
        if (data.success) {
          // Update local state with returned data
          setRequests(prevRequests =>
            prevRequests.map(request =>
              request._id === id 
                ? { 
                    ...request, 
                    status: newStatus,
                    notes: notes || request.notes,
                    contactedAt: newStatus === 'contacted' ? new Date().toISOString() : request.contactedAt
                  } 
                : request
            )
          );
          
          updateStats(requests.map(req => 
            req._id === id ? { ...req, status: newStatus, notes } : req
          ));
          
          setSelectedRequest(null);
          setAdminNotes('');
          
          alert(`✅ Status updated to ${newStatus}`);
        }
      } else {
        // If API fails, update local state anyway (for demo purposes)
        setRequests(prevRequests =>
          prevRequests.map(request =>
            request._id === id 
              ? { 
                  ...request, 
                  status: newStatus,
                  notes: notes || request.notes,
                  contactedAt: newStatus === 'contacted' ? new Date().toISOString() : request.contactedAt
                } 
              : request
          )
        );
        
        alert(`✅ Status updated to ${newStatus} (local update)`);
      }
    } catch (error) {
      console.error('Update error:', error);
      // Update local state anyway for demo
      setRequests(prevRequests =>
        prevRequests.map(request =>
          request._id === id 
            ? { 
                ...request, 
                status: newStatus,
                notes: notes || request.notes
              } 
            : request
        )
      );
      
      alert(`✅ Status updated locally to ${newStatus}`);
    }
  };

  const deleteRequest = async (id) => {
    if (!window.confirm('Are you sure you want to delete this request?')) {
      return;
    }
    
    try {
      const apiUrl = window.location.hostname === 'localhost' 
        ? `http://localhost:3000/api/admin/requests?id=${id}`
        : `/api/admin/requests?id=${id}`;
      
      const response = await fetch(apiUrl, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      
      if (response.ok) {
        setRequests(prevRequests => prevRequests.filter(r => r._id !== id));
        updateStats(requests.filter(r => r._id !== id));
        alert('✅ Request deleted successfully');
      } else {
        // If API fails, delete locally anyway
        setRequests(prevRequests => prevRequests.filter(r => r._id !== id));
        alert('✅ Request deleted locally');
      }
    } catch (error) {
      console.error('Delete error:', error);
      // Delete locally for demo
      setRequests(prevRequests => prevRequests.filter(r => r._id !== id));
      alert('✅ Request deleted locally');
    }
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Company', 'Message', 'Status', 'Submitted', 'Contacted'];
    const csvContent = [
      headers.join(','),
      ...requests.map(request => [
        `"${request.name.replace(/"/g, '""')}"`,
        request.email,
        `"${request.company.replace(/"/g, '""')}"`,
        `"${request.message.replace(/"/g, '""')}"`,
        request.status,
        new Date(request.submittedAt).toLocaleString(),
        request.contactedAt ? new Date(request.contactedAt).toLocaleString() : 'Not contacted'
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `contact-requests-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const filteredRequests = requests.filter(request => {
    // Status filter
    if (filters.status !== 'all' && request.status !== filters.status) {
      return false;
    }
    
    // Date range filter
    if (filters.dateRange !== 'all') {
      const requestDate = new Date(request.submittedAt);
      const today = new Date();
      
      switch(filters.dateRange) {
        case 'today':
          const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
          if (requestDate < startOfToday) return false;
          break;
        case 'week':
          const oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
          if (requestDate < oneWeekAgo) return false;
          break;
        case 'month':
          const oneMonthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
          if (requestDate < oneMonthAgo) return false;
          break;
      }
    }
    
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return (
        request.name.toLowerCase().includes(searchLower) ||
        request.email.toLowerCase().includes(searchLower) ||
        request.company.toLowerCase().includes(searchLower) ||
        request.message.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const logout = () => {
    localStorage.removeItem('admin_auth');
    localStorage.removeItem('admin_token');
    setIsAuthenticated(false);
    setRequests([]);
    setPassword('');
    setAuthToken('');
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-login">
        <div className="login-container">
          <h2>🔐 Admin Dashboard Login</h2>
          <p className="login-subtitle">Enter admin password to access contact requests</p>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                required
                autoFocus
              />
            </div>
            {error && <div className="error-message">{error}</div>}
            <button type="submit" className="login-button">
              Login
            </button>
            <div className="login-info">
              <p>Default password: <strong>admin123</strong></p>
              <p>To change, set ADMIN_PASSWORD in Vercel environment variables</p>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <header className="admin-header">
        <div className="header-left">
          <h1>📊 Contact Requests Dashboard</h1>
          <p className="header-subtitle">Manage all contact form submissions</p>
        </div>
        <div className="header-actions">
          <button className="btn-refresh" onClick={() => fetchRequests(authToken)} disabled={loading}>
            {loading ? '🔄 Refreshing...' : '🔄 Refresh'}
          </button>
          <button className="btn-export" onClick={exportToCSV}>
            📥 Export CSV
          </button>
          <button className="btn-logout" onClick={logout}>
            👋 Logout
          </button>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="stats-container">
        <div className="stat-card total">
          <div className="stat-icon">📋</div>
          <div className="stat-content">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total Requests</div>
          </div>
        </div>
        
        <div className="stat-card pending">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <div className="stat-value">{stats.pending}</div>
            <div className="stat-label">Pending</div>
          </div>
        </div>
        
        <div className="stat-card contacted">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <div className="stat-value">{stats.contacted}</div>
            <div className="stat-label">Contacted</div>
          </div>
        </div>
        
        <div className="stat-card today">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <div className="stat-value">{stats.today}</div>
            <div className="stat-label">Today</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-container">
        <div className="filter-group">
          <label>Status:</label>
          <select 
            value={filters.status} 
            onChange={(e) => setFilters({...filters, status: e.target.value})}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="contacted">Contacted</option>
            <option value="archived">Archived</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label>Date Range:</label>
          <select 
            value={filters.dateRange} 
            onChange={(e) => setFilters({...filters, dateRange: e.target.value})}
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
          </select>
        </div>
        
        <div className="filter-group search">
          <label>Search:</label>
          <input
            type="text"
            placeholder="Search by name, email, company..."
            value={filters.search}
            onChange={(e) => setFilters({...filters, search: e.target.value})}
          />
        </div>
      </div>

      {/* Requests Table */}
      <div className="requests-container">
        {error && <div className="error-banner">{error}</div>}
        
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading contact requests...</p>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3>No contact requests found</h3>
            <p>{filters.status !== 'all' || filters.search ? 'Try changing your filters' : 'No submissions yet'}</p>
            <button className="btn-test" onClick={loadTestData}>
              Load Test Data
            </button>
          </div>
        ) : (
          <div className="table-container">
            <table className="requests-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Company</th>
                  <th>Message</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((request) => (
                  <tr key={request._id} className={`status-${request.status}`}>
                    <td className="date-cell">
                      <div className="date-main">{formatDate(request.submittedAt)}</div>
                      {request.contactedAt && (
                        <div className="date-sub">Contacted: {formatDate(request.contactedAt)}</div>
                      )}
                    </td>
                    <td className="name-cell">{request.name}</td>
                    <td className="email-cell">
                      <a href={`mailto:${request.email}`}>{request.email}</a>
                    </td>
                    <td className="company-cell">{request.company}</td>
                    <td className="message-cell">
                      <div className="message-preview">
                        {request.message.length > 100 
                          ? `${request.message.substring(0, 100)}...` 
                          : request.message}
                      </div>
                      {request.notes && (
                        <div className="admin-notes">
                          <strong>Notes:</strong> {request.notes}
                        </div>
                      )}
                    </td>
                    <td className="status-cell">
                      <span className={`status-badge status-${request.status}`}>
                        {request.status}
                      </span>
                    </td>
                    <td className="actions-cell">
                      <div className="action-buttons">
                        <button 
                          className="btn-view"
                          onClick={() => setSelectedRequest(request)}
                        >
                          👁️ View
                        </button>
                        
                        {request.status === 'pending' && (
                          <button 
                            className="btn-contact"
                            onClick={() => updateRequestStatus(request._id, 'contacted')}
                          >
                            ✅ Contacted
                          </button>
                        )}
                        
                        <button 
                          className="btn-archive"
                          onClick={() => updateRequestStatus(request._id, 'archived')}
                        >
                          📁 Archive
                        </button>
                        
                        <button 
                          className="btn-delete"
                          onClick={() => deleteRequest(request._id)}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <div className="table-footer">
              <div className="count-info">
                Showing {filteredRequests.length} of {requests.length} requests
              </div>
              <div className="last-updated">
                Last updated: {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Request Details Modal */}
      {selectedRequest && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Contact Request Details</h2>
              <button className="modal-close" onClick={() => setSelectedRequest(null)}>
                ×
              </button>
            </div>
            
            <div className="modal-content">
              <div className="detail-row">
                <label>Name:</label>
                <span>{selectedRequest.name}</span>
              </div>
              
              <div className="detail-row">
                <label>Email:</label>
                <span>
                  <a href={`mailto:${selectedRequest.email}`}>{selectedRequest.email}</a>
                </span>
              </div>
              
              <div className="detail-row">
                <label>Company:</label>
                <span>{selectedRequest.company}</span>
              </div>
              
              <div className="detail-row">
                <label>Submitted:</label>
                <span>{formatDate(selectedRequest.submittedAt)}</span>
              </div>
              
              <div className="detail-row">
                <label>Status:</label>
                <span className={`status-badge status-${selectedRequest.status}`}>
                  {selectedRequest.status}
                </span>
              </div>
              
              <div className="detail-row full">
                <label>Message:</label>
                <div className="message-full">{selectedRequest.message}</div>
              </div>
              
              {selectedRequest.notes && (
                <div className="detail-row full">
                  <label>Admin Notes:</label>
                  <div className="notes-display">{selectedRequest.notes}</div>
                </div>
              )}
              
              <div className="detail-row full">
                <label>Add/Edit Notes:</label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add notes about this request..."
                  rows="3"
                />
              </div>
              
              <div className="detail-row">
                <label>IP Address:</label>
                <span className="ip-address">{selectedRequest.ip || 'N/A'}</span>
              </div>
              
              <div className="detail-row">
                <label>Browser:</label>
                <span className="user-agent">{selectedRequest.userAgent || 'N/A'}</span>
              </div>
            </div>
            
            <div className="modal-actions">
              <button 
                className="btn-save"
                onClick={() => {
                  if (adminNotes.trim()) {
                    updateRequestStatus(selectedRequest._id, selectedRequest.status, adminNotes);
                  }
                  setSelectedRequest(null);
                }}
              >
                💾 Save Notes
              </button>
              
              <button 
                className="btn-mark-contact"
                onClick={() => {
                  updateRequestStatus(selectedRequest._id, 'contacted', adminNotes);
                }}
                disabled={selectedRequest.status === 'contacted'}
              >
                ✅ Mark as Contacted
              </button>
              
              <button 
                className="btn-close"
                onClick={() => setSelectedRequest(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;