import React, { useState, useEffect } from 'react';
import './App.css';

const SaaSUNOLanding = () => {
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
    const duration = 1800; // 1.8 seconds total loading time
    const intervalTime = 20; // Update every 20ms for smooth progress
    const totalSteps = duration / intervalTime;
    const increment = 100 / totalSteps;

    const loadingInterval = setInterval(() => {
      progress += increment;
      if (progress >= 100) {
        progress = 100;
        clearInterval(loadingInterval);
        
        // Immediately transition after reaching 100%
        setTimeout(() => {
          setIsLoading(false);
          document.body.classList.remove('loading');
          document.body.classList.add('loaded');
        }, 100); // Very short delay to show 100%
      }
      setLoadingProgress(progress);
    }, intervalTime);

    // Set body class for loading state
    document.body.classList.add('loading');

    return () => {
      clearInterval(loadingInterval);
      document.body.classList.remove('loading');
    };
  }, []);

  // Carousel and other existing useEffect
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
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Thank you for your inquiry! We will contact you soon.');
    setFormData({ name: '', email: '', company: '', message: '' });
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
              <img src={`${process.env.PUBLIC_URL}/images/1.png`} alt="SaaS Platform" />
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
                <img src={`${process.env.PUBLIC_URL}/images/7.png`} alt="Workflow Integration" />
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
              <img src={`${process.env.PUBLIC_URL}/images/2.png`} alt="Development Process" />
            </div>
          </div>
        </section>

        {/* Big Client Showcase - Like Pactle.co */}
        <section id="clients" className="client-showcase">
          <div className="container">
            <div className="client-showcase-content">
              <div className="client-info">
                <h2>Featured Client</h2>
                <h3>Seal Freight</h3>
                <p className="client-industry">Logistics & Supply Chain</p>
                <p className="client-description">
                  We revolutionized Seal Freight's logistics operations with a comprehensive SaaS solution 
                  featuring real-time tracking, automated workflows, and advanced analytics. The platform 
                  seamlessly integrates with their existing systems while providing actionable insights 
                  for operational excellence.
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
                      <div
                        key={index}
                        className="carousel-slide"
                      >
                        <img 
                          src={`${process.env.PUBLIC_URL}/images/${image}`} 
                          alt={`Seal Freight Solution ${index + 1}`}
                        />
                      </div>
                    ))}
                  </div>
                  
                  {/* Navigation arrows */}
                  <button className="carousel-btn carousel-btn-prev" onClick={goToPrev}>
                    ‹
                  </button>
                  <button className="carousel-btn carousel-btn-next" onClick={goToNext}>
                    ›
                  </button>
                  
                  {/* Dots indicator */}
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
                    <p>We work with you to understand your business goals and define clear objectives for your digital transformation.</p>
                  </li>
                  <li>
                    <strong>Analyze Requirements</strong>
                    <p>Comprehensive analysis of your business processes, technical requirements, and user needs.</p>
                  </li>
                  <li>
                    <strong>Develop Solutions</strong>
                    <p>Agile development of tailored software solutions that address your specific challenges.</p>
                  </li>
                  <li>
                    <strong>Launch & Optimize</strong>
                    <p>Seamless deployment followed by continuous optimization and support services.</p>
                  </li>
                </ol>
              </div>
              <div className="action-image">
                <img src={`${process.env.PUBLIC_URL}/images/5.png`} alt="Action Plan" />
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="contact">
          <div className="container">
            <h2>Start Your Digital Transformation</h2>
            <p className="contact-subtitle">Contact us for a comprehensive consultation and project assessment</p>
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
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    name="company"
                    placeholder="Company Name"
                    value={formData.company}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <textarea
                    name="message"
                    placeholder="Tell us about your project requirements, challenges, and goals..."
                    value={formData.message}
                    onChange={handleInputChange}
                    rows="5"
                    required
                  ></textarea>
                </div>
                <button type="submit" className="submit-btn">Send Request</button>
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
                <a href="#workflow" onClick={(e) => { e.preventDefault(); scrollToSection('workflow'); }}>Solutions</a>
                <a href="#process" onClick={(e) => { e.preventDefault(); scrollToSection('process'); }}>Process</a>
                <a href="#contact" onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }}>Contact</a>
              </div>
            </div>
            <div className="footer-bottom">
              <p>&copy; 2024 SaasUNO Technologies. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default SaaSUNOLanding;