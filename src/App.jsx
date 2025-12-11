import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Import Admin Dashboard Component
import AdminDashboard from './components/AdminDashboard';

// API URL Configuration - Production optimized
const API_URL = process.env.REACT_APP_API_URL || 'https://saasuno-backend.onrender.com';

console.log(' API URL:', API_URL);
console.log(' Environment:', process.env.NODE_ENV);

// Main Landing Page Component
const SaaSUNOLandingPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formMessage, setFormMessage] = useState({ type: '', text: '' });

  const sealFreightImages = [
    'seal1.png',
    'seal2.png',
    'seal3.png',
    'seal4.png',
    'seal5.png'
  ];

  // Fast loading simulation
  useEffect(() => {
    let progress = 0;
    const duration = 1200; // Faster for production
    const intervalTime = 20;
    const totalSteps = duration / intervalTime;
    const increment = 100 / totalSteps;

    const loadingInterval = setInterval(() => {
      progress += increment;
      if (progress >= 100) {
        progress = 100;
        clearInterval(loadingInterval);
        
        setTimeout(() => {
          setIsLoading(false);
          document.body.classList.remove('loading');
          document.body.classList.add('loaded');
        }, 50);
      }
      setLoadingProgress(progress);
    }, intervalTime);

    document.body.classList.add('loading');

    return () => {
      clearInterval(loadingInterval);
      document.body.classList.remove('loading');
    };
  }, []);

  // Carousel
  useEffect(() => {
    if (!isLoading) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => 
          prevIndex === sealFreightImages.length - 1 ? 0 : prevIndex + 1
        );
      }, 4000);

      return () => clearInterval(interval);
    }
  }, [sealFreightImages.length, isLoading]);

  // Smooth scroll function
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (submitSuccess) setSubmitSuccess(false);
    if (formMessage.text) setFormMessage({ type: '', text: '' });
  };

  const showMessage = (type, text) => {
    setFormMessage({ type, text });
    setTimeout(() => {
      setFormMessage({ type: '', text: '' });
    }, 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitSuccess(false);
    setFormMessage({ type: '', text: '' });
    
    // Validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.company.trim()) {
      showMessage('error', 'Please fill in all required fields');
      setSubmitting(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      showMessage('error', 'Please enter a valid email address');
      setSubmitting(false);
      return;
    }

    try {
      console.log(' Submitting form to:', `${API_URL}/contacts`);
      
      const response = await fetch(`${API_URL}/contacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          company: formData.company.trim(),
          message: formData.message.trim(),
          source: 'landing-page',
          timestamp: new Date().toISOString()
        }),
      });

      console.log(' Response status:', response.status);
      
      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        showMessage('error', 'Server error. Please try again later.');
        setSubmitting(false);
        return;
      }

      if (response.ok) {
        showMessage('success', data.message || 'Thank you! Your request has been submitted successfully.');
        setFormData({ name: '', email: '', company: '', message: '' });
        setSubmitSuccess(true);
        
        // Send notification (optional)
        try {
          await fetch(`${API_URL}/notify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'new_contact',
              data: { ...formData, submittedAt: new Date().toISOString() }
            })
          });
        } catch (notifyError) {
          console.log('Notification failed:', notifyError);
        }
      } else {
        showMessage('error', data.error || data.message || 'Submission failed. Please try again.');
      }
      
    } catch (error) {
      console.error('Submission error:', error);
      
      if (error.message.includes('Failed to fetch')) {
        showMessage('error', 'Network error. Please check your connection and try again.');
      } else if (error.message.includes('CORS')) {
        showMessage('error', 'Connection error. Please contact support.');
      } else {
        showMessage('error', 'An error occurred. Please try again.');
      }
      
    } finally {
      setSubmitting(false);
    }
  };

  const goToSlide = (index) => {
    setCurrentImageIndex(index);
  };

  const goToNext = () => {
    setCurrentImageIndex(current => 
      current === sealFreightImages.length - 1 ? 0 : current + 1
    );
  };

  const goToPrev = () => {
    setCurrentImageIndex(current => 
      current === 0 ? sealFreightImages.length - 1 : current - 1
    );
  };

  return (
    <div className="App">
      {/* Loading Screen */}
      {isLoading && (
        <div className="loading-screen">
          <div className="loading-logo">
            <h1>SaasUNO</h1>
            <div className="subtitle">Digital Transformation</div>
          </div>
          
          <div className="spinner">
            <div className="spinner-inner"></div>
          </div>

          <div className="loading-progress">
            <div 
              className="loading-progress-bar" 
              style={{ width: `${loadingProgress}%` }}
            ></div>
          </div>

          <div className="loading-percentage">
            {Math.min(100, Math.round(loadingProgress))}%
          </div>

          <div className="loading-dots">
            <div className="loading-dot"></div>
            <div className="loading-dot"></div>
            <div className="loading-dot"></div>
          </div>
        </div>
      )}

      {/* Main Content - Always rendered but hidden during loading */}
      <div style={{ display: isLoading ? 'none' : 'block' }}>
        {/* Navigation */}
        <nav className="navbar">
          <div className="nav-container">
            <div className="logo">
              <h2>SaasUNO</h2>
            </div>
            <div className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
              <a href="#services" onClick={(e) => { e.preventDefault(); scrollToSection('services'); }}>Services</a>
              <a href="#differentiators" onClick={(e) => { e.preventDefault(); scrollToSection('differentiators'); }}>Differentiators</a>
              <a href="#workflow" onClick={(e) => { e.preventDefault(); scrollToSection('workflow'); }}>Workflow</a>
              <a href="#process" onClick={(e) => { e.preventDefault(); scrollToSection('process'); }}>Process</a>
              <a href="#clients" onClick={(e) => { e.preventDefault(); scrollToSection('clients'); }}>Clients</a>
              <a href="#contact" className="cta-button" onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }}>Get Started</a>
            

            </div>
            <div className="hamburger" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="hero">
          <div className="hero-container">
            <div className="hero-content">
              <h1>Building Digital Excellence with SaaS Solutions</h1>
              <p>Transform your business with cutting-edge software solutions tailored to your unique needs and challenges.</p>
              <button 
                className="hero-cta" 
                onClick={() => scrollToSection('contact')}
              >
                Start Your Journey
              </button>
            </div>
            <div className="hero-image">
              <img src={`${process.env.PUBLIC_URL}/images/7.png`} alt="SaaS Platform" loading="lazy" />
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="services">
          <div className="container">
            <h2>Our Services</h2>
            <div className="services-grid">
              <div className="service-card">
                <h3>Development</h3>
                <ul>
                  <li>Web Development</li>
                  <li>Mobile App Development</li>
                  <li>SaaS Product Development</li>
                  <li>AI/ML Development</li>
                </ul>
              </div>
              <div className="service-card">
                <h3>Consulting</h3>
                <ul>
                  <li>Cloud Computing</li>
                  <li>UI/UX Design</li>
                  <li>Software Consulting</li>
                  <li>IT Support</li>
                </ul>
              </div>
              <div className="service-card">
                <h3>Solutions</h3>
                <ul>
                  <li>Digital Transformation</li>
                  <li>Workflow Automation</li>
                  <li>Data Analytics</li>
                  <li>System Integration</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* What Makes SaasUNO Different Section */}
        <section id="differentiators" className="differentiators">
          <div className="container">
            <h2>How SaasUNO Transforms Digital Ecosystems</h2>
            <p className="section-subtitle">
              Our integrated platform doesn't just solve problems—it transforms entire ecosystems. 
              See how our comprehensive approach delivers measurable impact across multiple dimensions.
            </p>
            
            <div className="differentiators-grid">
              <div className="differentiator-card">
                <div className="differentiator-icon"></div>
                <h3>End-to-End Research & Talent Orchestration</h3>
                <p>
                  Unlike fragmented systems, our unified platform seamlessly integrates Research Management, 
                  Fellowship Programs, Grant Lifecycle Management, and Mentor Networks.
                </p>
                <div className="differentiator-stats">
                  <div className="stat">
                    <span className="stat-value">40%</span>
                    <span className="stat-label">Faster Grant Processing</span>
                  </div>
                  <div className="stat">
                    <span className="stat-value">75%</span>
                    <span className="stat-label">Improved Mentor Matching</span>
                  </div>
                </div>
              </div>

              <div className="differentiator-card">
                <div className="differentiator-icon"></div>
                <h3>Comprehensive Startup & Investor Ecosystem</h3>
                <p>
                  We provide a complete ecosystem connecting startups, investors, and accelerators through 
                  Portfolio Management, Fund Administration, Real-time Analytics.
                </p>
                <div className="differentiator-stats">
                  <div className="stat">
                    <span className="stat-value">50%</span>
                    <span className="stat-label">Higher Funding Success</span>
                  </div>
                  <div className="stat">
                    <span className="stat-value">3.5x</span>
                    <span className="stat-label">ROI for Investors</span>
                  </div>
                </div>
              </div>

              <div className="differentiator-card">
                <div className="differentiator-icon"></div>
                <h3>Dynamic Learning & Community Platform</h3>
                <p>
                  Our platform creates thriving ecosystems by combining Learning Management, Community Engagement, 
                  Alumni Networks, and Communication Tools.
                </p>
                <div className="differentiator-stats">
                  <div className="stat">
                    <span className="stat-value">85%</span>
                    <span className="stat-label">User Engagement Rate</span>
                  </div>
                  <div className="stat">
                    <span className="stat-value">90%</span>
                    <span className="stat-label">Alumni Network Retention</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Workflow Integration */}
        <section id="workflow" className="workflow">
          <div className="container">
            <h2>Seamless Workflow Integration</h2>
            <div className="workflow-grid">
              <div className="workflow-features">
                <div className="feature">
                  <h4>Smart Search & Cloud Sync</h4>
                  <p>Advanced search capabilities with real-time cloud synchronization across all devices.</p>
                </div>
                <div className="feature">
                  <h4>Q4 Analytics & Reporting</h4>
                  <p>Comprehensive analytics dashboard with customizable reports and real-time insights.</p>
                </div>
                <div className="feature">
                  <h4>Secure Data Management</h4>
                  <p>Enterprise-grade security with end-to-end encryption and multi-platform support.</p>
                </div>
              </div>
              <div className="workflow-image">
                <img src={`${process.env.PUBLIC_URL}/images/1.png`} alt="Workflow Integration" loading="lazy" />
              </div>
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section id="process" className="process">
          <div className="container">
            <h2>Our Process</h2>
            <div className="process-steps">
              <div className="step">
                <h3>STRATEGY</h3>
                <p>Comprehensive analysis and planning to define your digital transformation roadmap.</p>
              </div>
              <div className="step">
                <h3>DESIGN</h3>
                <p>User-centric design approach creating intuitive and engaging user experiences.</p>
              </div>
              <div className="step">
                <h3>DEVELOPMENT</h3>
                <p>Agile development methodology ensuring quality and timely delivery.</p>
              </div>
              <div className="step">
                <h3>DEPLOYMENT</h3>
                <p>Seamless deployment with ongoing support and optimization services.</p>
              </div>
            </div>
            <div className="process-image">
              <img src={`${process.env.PUBLIC_URL}/images/2.png`} alt="Development Process" loading="lazy" />
            </div>
          </div>
        </section>

        {/* Big Client Showcase */}
        <section id="clients" className="client-showcase">
          <div className="container">
            <div className="client-showcase-content">
              <div className="client-info">
                <h2>Featured Client</h2>
                <h3>Seal Freight</h3>
                <p className="client-industry">Logistics & Supply Chain</p>
                <p className="client-description">
                  We revolutionized Seal Freight's logistics operations with a comprehensive SaaS solution 
                  featuring real-time tracking, automated workflows, and advanced analytics.
                </p>
                <div className="client-results">
                  <div className="result">
                    <span className="result-value">+45%</span>
                    <span className="result-label">Operational Efficiency</span>
                  </div>
                  <div className="result">
                    <span className="result-value">-30%</span>
                    <span className="result-label">Operating Costs</span>
                  </div>
                  <div className="result">
                    <span className="result-value">99.8%</span>
                    <span className="result-label">System Uptime</span>
                  </div>
                </div>
              </div>
              <div className="carousel-container">
                <div className="carousel">
                  <div className="carousel-slides" style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}>
                    {sealFreightImages.map((image, index) => (
                      <div key={index} className="carousel-slide">
                        <img 
                          src={`${process.env.PUBLIC_URL}/images/${image}`} 
                          alt={`Seal Freight Solution ${index + 1}`}
                          loading="lazy"
                        />
                      </div>
                    ))}
                  </div>
                  
                  <button className="carousel-btn carousel-btn-prev" onClick={goToPrev}>
                    ‹
                  </button>
                  <button className="carousel-btn carousel-btn-next" onClick={goToNext}>
                    ›
                  </button>
                  
                  <div className="carousel-dots">
                    {sealFreightImages.map((_, index) => (
                      <button
                        key={index}
                        className={`carousel-dot ${index === currentImageIndex ? 'active' : ''}`}
                        onClick={() => goToSlide(index)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Action Plan */}
        <section className="action-plan">
          <div className="container">
            <div className="action-content">
              <div className="action-text">
                <h2>Your Action Plan</h2>
                <ol>
                  <li>
                    <strong>Define Your Vision</strong>
                    <p>We work with you to understand your business goals and define clear objectives.</p>
                  </li>
                  <li>
                    <strong>Analyze Requirements</strong>
                    <p>Comprehensive analysis of your business processes and technical requirements.</p>
                  </li>
                  <li>
                    <strong>Develop Solutions</strong>
                    <p>Agile development of tailored software solutions for your specific challenges.</p>
                  </li>
                  <li>
                    <strong>Launch & Optimize</strong>
                    <p>Seamless deployment followed by continuous optimization and support services.</p>
                  </li>
                </ol>
              </div>
              <div className="action-image">
                <img src={`${process.env.PUBLIC_URL}/images/5.png`} alt="Action Plan" loading="lazy" />
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="contact">
          <div className="container">
            <h2>Start Your Digital Transformation</h2>
            <p className="contact-subtitle">Contact us for a comprehensive consultation and project assessment</p>
            
            {/* Form Messages */}
            {formMessage.text && (
              <div className={`form-message ${formMessage.type}`} style={{
                background: formMessage.type === 'success' ? '#d4edda' : '#f8d7da',
                color: formMessage.type === 'success' ? '#155724' : '#721c24',
                padding: '12px 20px',
                borderRadius: '6px',
                marginBottom: '20px',
                border: `1px solid ${formMessage.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`
              }}>
                {formMessage.type === 'success' ? '' : ''} {formMessage.text}
              </div>
            )}
            
            {submitSuccess && (
              <div className="success-message" style={{
                background: '#d4edda',
                color: '#155724',
                padding: '12px 20px',
                borderRadius: '6px',
                marginBottom: '20px',
                border: '1px solid #c3e6cb'
              }}>
                 Thank you! Your request has been submitted successfully.
              </div>
            )}
            
            <div className="contact-content">
              <div className="contact-info">
                <h3>Get In Touch</h3>
                <div className="contact-details">
                  <div className="contact-item">
                    <strong>Contact Person</strong>
                    <span>Amrit Kumar Sinha</span>
                  </div>
                  <div className="contact-item">
                    <strong>Company</strong>
                    <span>SaasUNO Technologies</span>
                  </div>
                  <div className="contact-item">
                    <strong>Services</strong>
                    <span>SaaS Development, Cloud Solutions, Digital Transformation</span>
                  </div>
                </div>
              </div>
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name *"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    disabled={submitting}
                  />
                </div>
                <div className="form-group">
                  <input
                    type="email"
                    name="email"
                    placeholder="Your Email *"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    disabled={submitting}
                  />
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    name="company"
                    placeholder="Company Name *"
                    value={formData.company}
                    onChange={handleInputChange}
                    required
                    disabled={submitting}
                  />
                </div>
                <div className="form-group">
                  <textarea
                    name="message"
                    placeholder="Tell us about your project requirements, challenges, and goals..."
                    value={formData.message}
                    onChange={handleInputChange}
                    rows="4"
                    disabled={submitting}
                  ></textarea>
                </div>
                <button 
                  type="submit" 
                  className="submit-btn" 
                  disabled={submitting}
                  style={{ position: 'relative' }}
                >
                  {submitting ? (
                    <>
                      <span style={{
                        display: 'inline-block',
                        width: '16px',
                        height: '16px',
                        border: '2px solid #fff',
                        borderTop: '2px solid transparent',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        marginRight: '8px'
                      }}></span>
                      Processing...
                    </>
                  ) : (
                    'Send Request'
                  )}
                </button>
                <style>{`
                  @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                  }
                `}</style>
                <p style={{
                  fontSize: '12px',
                  color: '#666',
                  marginTop: '10px',
                  textAlign: 'center'
                }}>
                  Your information is secure and will be saved to our database
                </p>
              </form>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="footer">
          <div className="container">
            <div className="footer-content">
              <div className="footer-brand">
                <h3>SaasUNO</h3>
                <p>Building your digital future, one innovative solution at a time.</p>
              </div>
              <div className="footer-links">
                <a href="#services" onClick={(e) => { e.preventDefault(); scrollToSection('services'); }}>Services</a>
                <a href="#differentiators" onClick={(e) => { e.preventDefault(); scrollToSection('differentiators'); }}>Differentiators</a>
                <a href="#workflow" onClick={(e) => { e.preventDefault(); scrollToSection('workflow'); }}>Solutions</a>
                <a href="#process" onClick={(e) => { e.preventDefault(); scrollToSection('process'); }}>Process</a>
                <a href="#contact" onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }}>Contact</a>
               
              </div>
            </div>
            <div className="footer-bottom">
              <p>&copy; {new Date().getFullYear()} SaasUNO Technologies. All rights reserved.</p>
              <p style={{ fontSize: '12px', color: '#999', marginTop: '5px' }}>
                Powered by React & MongoDB | Backend: Render.com
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

// Main App Component with Routing
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/" element={<SaaSUNOLandingPage />} />
      </Routes>
    </Router>
  );
};

export default App;