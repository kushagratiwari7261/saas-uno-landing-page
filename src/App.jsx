import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminDashboard from './components/AdminDashboard'; // Add this line

const API_URL = process.env.REACT_APP_API_URL || 'https://saasuno-backend.onrender.com';

// SVG Icons Component
const SVGIcon = ({ name, className = "", style = {} }) => {
  const icons = {
    // Platform Features
    performance: (
      <svg className={className} style={style} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M3.055 13H5.07a7.002 7.002 0 0 0 13.858 0h2.016a9.001 9.001 0 0 1-17.89 0Zm0-2a9.001 9.001 0 0 1 17.89 0H18.93a7.002 7.002 0 0 0-13.858 0H3.055Z" />
      </svg>
    ),
    security: (
      <svg className={className} style={style} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" d="M12.516 2.17a.75.75 0 0 0-1.032 0 11.209 11.209 0 0 1-7.877 3.08.75.75 0 0 0-.722.515A12.74 12.74 0 0 0 2.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 0 0 .374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 0 0-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08Zm3.094 8.016a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
      </svg>
    ),
    analytics: (
      <svg className={className} style={style} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75ZM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 0 1-1.875-1.875V8.625ZM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 0 1 3 19.875v-6.75Z" />
      </svg>
    ),
    automation: (
      <svg className={className} style={style} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" d="M7.502 6h7.128A3.375 3.375 0 0 1 18 9.375v9.375a3 3 0 0 0 3-3V6.108c0-1.505-1.125-2.811-2.664-2.94a48.972 48.972 0 0 0-.673-.05A3 3 0 0 0 15 1.5h-1.5a3 3 0 0 0-2.663 1.618c-.225.015-.45.032-.673.05C8.662 3.295 7.554 4.542 7.502 6ZM13.5 3A1.5 1.5 0 0 0 12 4.5h4.5A1.5 1.5 0 0 0 15 3h-1.5Z" clipRule="evenodd" />
        <path fillRule="evenodd" d="M3 9.375C3 8.339 3.84 7.5 4.875 7.5h9.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 0 1 3 20.625V9.375Zm9.586 4.594a.75.75 0 0 0-1.172-.938l-2.476 3.096-.908-.907a.75.75 0 0 0-1.06 1.06l1.5 1.5a.75.75 0 0 0 1.116-.062l3-3.75Z" clipRule="evenodd" />
      </svg>
    ),
    // Differentiator Icons
    research: (
      <svg className={className} style={style} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.25 4.533A9.707 9.707 0 0 0 6 3a9.735 9.735 0 0 0-3.25.555.75.75 0 0 0-.5.707v14.25a.75.75 0 0 0 1 .707A8.237 8.237 0 0 1 6 18.75c1.995 0 3.823.707 5.25 1.886V4.533ZM12.75 20.636A8.214 8.214 0 0 1 18 18.75c.966 0 1.89.166 2.75.47a.75.75 0 0 0 1-.708V4.262a.75.75 0 0 0-.5-.707A9.735 9.735 0 0 0 18 3a9.707 9.707 0 0 0-5.25 1.533v16.103Z" />
      </svg>
    ),
    startup: (
      <svg className={className} style={style} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" d="M9.315 7.584C12.195 3.883 16.695 1.5 21.75 1.5a.75.75 0 0 1 .75.75c0 5.056-2.383 9.555-6.084 12.436A6.75 6.75 0 0 1 9.75 22.5a.75.75 0 0 1-.75-.75v-4.131A15.838 15.838 0 0 1 6.382 15H2.25a.75.75 0 0 1-.75-.75 6.75 6.75 0 0 1 7.815-6.666ZM15 6.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z" clipRule="evenodd" />
        <path d="M5.26 17.242a.75.75 0 1 0-.897-1.203 5.243 5.243 0 0 0-2.05 5.022.75.75 0 0 0 .625.627 5.243 5.243 0 0 0 5.022-2.051.75.75 0 1 0-1.202-.897 3.744 3.744 0 0 1-3.008 1.51c0-1.23.592-2.323 1.51-3.008Z" />
      </svg>
    ),
    learning: (
      <svg className={className} style={style} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.7 2.805a.75.75 0 0 1 .6 0A60.65 60.65 0 0 1 22.83 8.72a.75.75 0 0 1-.231 1.337 49.949 49.949 0 0 0-9.902 3.912l-.003.002-.34.18a.75.75 0 0 1-.707 0A50.009 50.009 0 0 0 7.5 12.174v-.224c0-.131.067-.248.172-.311a54.614 54.614 0 0 1 4.653-2.52.75.75 0 0 0-.65-1.352 56.129 56.129 0 0 0-4.78 2.589 1.858 1.858 0 0 0-.859 1.228 49.803 49.803 0 0 0-4.634-1.527.75.75 0 0 1-.231-1.337A60.653 60.653 0 0 1 11.7 2.805Z" />
        <path d="M13.06 15.473a48.45 48.45 0 0 1 7.666-3.282c.134 1.414.22 2.843.255 4.285a.75.75 0 0 1-.46.71 47.878 47.878 0 0 0-8.105 4.342.75.75 0 0 1-.832 0 47.877 47.877 0 0 0-8.104-4.342.75.75 0 0 1-.461-.71c.035-1.442.121-2.87.255-4.286A48.4 48.4 0 0 1 6 13.18v1.27a1.5 1.5 0 0 0-.14 2.508c-.09.38-.222.753-.397 1.11.452.213.901.434 1.346.661a6.729 6.729 0 0 0 .551-1.608 1.5 1.5 0 0 0 .14-2.67v-.645a48.549 48.549 0 0 1 3.44 1.668 2.25 2.25 0 0 0 2.12 0Z" />
        <path d="M4.462 19.462c.42-.419.753-.89.991-1.394a.75.75 0 0 1 1.212.882 7.48 7.48 0 0 1-1.212 2.022.75.75 0 0 1-1.06-1.06c.37-.369.69-.77.96-1.193a.75.75 0 0 1 .11-.257Z" />
      </svg>
    ),
    // Uptime Icon
    uptime: (
      <svg className={className} style={style} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 0 0 0-1.5h-3.75V6Z" clipRule="evenodd" />
      </svg>
    ),
    search: (
      <svg className={className} style={style} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" clipRule="evenodd" />
      </svg>
    ),
    reporting: (
      <svg className={className} style={style} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" d="M3 6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V6Zm14.25 6a.75.75 0 0 1-.75.75H7.5v1.5h9a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-.75.75h-9A2.25 2.25 0 0 1 5.25 18v-3a2.25 2.25 0 0 1 2.25-2.25h9.75v-1.5H7.5a.75.75 0 0 1-.75-.75V6A.75.75 0 0 1 7.5 5.25h9a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-.75.75H9a2.25 2.25 0 0 0-2.25 2.25v3c0 .414.336.75.75.75h9.75a.75.75 0 0 1 .75-.75v-3Z" clipRule="evenodd" />
      </svg>
    ),
    dataManagement: (
      <svg className={className} style={style} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" d="M15.22 6.268a.75.75 0 0 1 .968-.431l5.942 2.28a.75.75 0 0 1 .431.97l-2.28 5.94a.75.75 0 1 1-1.4-.537l1.63-4.251-1.086.484a11.2 11.2 0 0 0-5.45 5.173.75.75 0 0 1-1.199.19L9 12.312l-6.22 6.22a.75.75 0 0 1-1.06-1.061l6.75-6.75a.75.75 0 0 1 1.06 0l3.606 3.606a12.695 12.695 0 0 1 5.68-4.974l1.086-.483-4.251-1.632a.75.75 0 0 1-.432-.97Z" clipRule="evenodd" />
      </svg>
    )
  };

  return icons[name] || null;
};



const PrudataLandingPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [formData, setFormData] = useState({ name: '', email: '', company: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formMessage, setFormMessage] = useState({ type: '', text: '' });
  const [visibleSections, setVisibleSections] = useState(new Set());

  const sectionRefs = useRef({});
  // Added seal1 to seal8 images
  const sealFreightImages = ['seal1.png', 'seal2.png', 'seal3.png', 'seal4.png', 'seal5.png', 'seal6.png', 'seal7.png', 'seal8.png'];

  const integrationLogos = {
    'WhatsApp': 'https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg',
    'Gmail': 'https://upload.wikimedia.org/wikipedia/commons/7/7e/Gmail_icon_%282020%29.svg',
    'Zoom': 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Zoom_Communications_Logo.svg',
    'Google Calendar': 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg',
    'Slack': 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Slack_icon_2019.svg',
    'Salesforce': 'https://upload.wikimedia.org/wikipedia/commons/f/f9/Salesforce.com_logo.svg',
    'Stripe': 'https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg',
  };

  const goToPrev = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? sealFreightImages.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === sealFreightImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToSlide = (index) => {
    setCurrentImageIndex(index);
  };

  useEffect(() => {
    const handleScroll = () => {
      const newScrollY = window.scrollY;
      setScrollY(newScrollY);
      
      // Check visibility of sections
      Object.keys(sectionRefs.current).forEach(sectionId => {
        const element = sectionRefs.current[sectionId];
        if (element) {
          const rect = element.getBoundingClientRect();
          const isVisible = rect.top < window.innerHeight * 0.8 && rect.bottom > 0;
          
          setVisibleSections(prev => {
            const newSet = new Set(prev);
            if (isVisible) {
              newSet.add(sectionId);
            }
            return newSet;
          });
        }
      });
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    let progress = 0;
    const loadingInterval = setInterval(() => {
      progress += 1.67;
      if (progress >= 100) {
        clearInterval(loadingInterval);
        setTimeout(() => setIsLoading(false), 50);
      }
      setLoadingProgress(progress);
    }, 20);
    return () => clearInterval(loadingInterval);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % sealFreightImages.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [isLoading, sealFreightImages.length]);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (submitSuccess) setSubmitSuccess(false);
    if (formMessage.text) setFormMessage({ type: '', text: '' });
  };

  const showMessage = (type, text) => {
    setFormMessage({ type, text });
    setTimeout(() => setFormMessage({ type: '', text: '' }), 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitSuccess(false);
    setFormMessage({ type: '', text: '' });
    
    if (!formData.name.trim() || !formData.email.trim() || !formData.company.trim()) {
      showMessage('error', 'Please fill in all required fields');
      setSubmitting(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      showMessage('error', 'Please enter a valid email address');
      setSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/contacts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          ...formData,
          name: formData.name.trim(),
          email: formData.email.trim(),
          company: formData.company.trim(),
          message: formData.message.trim(),
          source: 'landing-page',
          timestamp: new Date().toISOString()
        }),
      });

      let data;
      try { data = await response.json(); } 
      catch (parseError) {
        showMessage('error', 'Server error. Please try again later.');
        setSubmitting(false);
        return;
      }

      if (response.ok) {
        showMessage('success', data.message || 'Thank you! Your request has been submitted successfully.');
        setFormData({ name: '', email: '', company: '', message: '' });
        setSubmitSuccess(true);
      } else {
        showMessage('error', data.error || data.message || 'Submission failed. Please try again.');
      }
    } catch (error) {
      if (error.message.includes('Failed to fetch')) {
        showMessage('error', 'Network error. Please check your connection and try again.');
      } else {
        showMessage('error', 'An error occurred. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ background: '#0a0a0f', color: '#fff', minHeight: '100vh' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; overflow-x: hidden; }
        
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-20px); } }
        @keyframes slideInLeft { from { opacity: 0; transform: translateX(-50px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes slideInRight { from { opacity: 0; transform: translateX(50px); } to { opacity: 1; transform: translateX(0); } }
        
   /* Updated Loading Screen - Black and White Theme */
.loading-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: #000000;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  text-align: center;
  color: white;
  padding: 20px;
  box-sizing: border-box;
}

.loading-logo {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 40px;
  text-align: center;
}

.logo-container {
  margin-bottom: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.loading-logo-image {
  width: 150px;
  height: 150px;
  object-fit: contain;
  animation: pulse 2s ease-in-out infinite;
  filter: brightness(1.1) contrast(1.1); /* Makes logo stand out on black background */
}

@keyframes pulse {
  0%, 100% { 
    transform: scale(1); 
    opacity: 1; 
    filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.3));
  }
  50% { 
    transform: scale(1.05); 
    opacity: 0.9; 
    filter: drop-shadow(0 0 15px rgba(255, 255, 255, 0.5));
  }
}

.loading-logo h1 {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 10px;
  color: #ffffff;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
}

.loading-subtitle { 
  font-size: 1.1rem;
  color: #ffffff;
  margin-bottom: 40px;
  opacity: 0.8;
}

.spinner {
  width: 60px;
  height: 60px;
  border: 3px solid rgba(255,255,255,0.2);
  border-top: 3px solid #ffffff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 25px;
}

.loading-progress {
  width: 250px;
  height: 3px;
  background: rgba(255,255,255,0.2);
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 15px;
}

.loading-progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #ffffff, #cccccc);
  transition: width 0.3s ease;
}

.loading-percentage { 
  font-size: 1.3rem;
  font-weight: 600;
  color: #ffffff;
}

@keyframes spin { 
  from { transform: rotate(0deg); } 
  to { transform: rotate(360deg); } 
}
        .navbar {
          position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
          background: ${scrollY > 50 ? 'rgba(10, 10, 15, 0.95)' : 'transparent'};
          backdrop-filter: blur(10px); transition: all 0.3s ease;
          border-bottom: 1px solid ${scrollY > 50 ? 'rgba(255,255,255,0.1)' : 'transparent'};
        }
        .nav-container {
          max-width: 1200px; margin: 0 auto; padding: 15px 30px; /* Reduced from 1400px and 20px 40px */
          display: flex; justify-content: space-between; align-items: center;
        }
        .logo h2 {
          font-size: 1.6rem; font-weight: 800; cursor: pointer; /* Reduced from 2rem */
          background: linear-gradient(135deg, #ffffff 0%, #cccccc 100%); /* White gradient */
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }
        .nav-menu { display: flex; gap: 30px; align-items: center; } /* Reduced from 40px */
        .nav-menu a {
          color: #fff; text-decoration: none; font-weight: 500; font-size: 0.9rem; /* Reduced from 0.95rem */
          transition: all 0.3s ease; position: relative;
        }
        .nav-menu a:not(.cta-button):hover { color: #ffffff; }
        .nav-menu a:not(.cta-button)::after {
          content: ''; position: absolute; bottom: -5px; left: 0; width: 0; height: 2px;
          background: linear-gradient(90deg, #ffffff, #cccccc); /* White gradient */
          transition: width 0.3s ease;
        }
        .nav-menu a:not(.cta-button):hover::after { width: 100%; }
        .cta-button {
          padding: 10px 22px !important; border-radius: 8px; font-weight: 600 !important; /* Reduced from 12px 28px */
          background: linear-gradient(135deg, #ffffff 0%, #cccccc 100%) !important; /* White gradient */
          color: #000000 !important; /* Black text for contrast */
          box-shadow: 0 3px 12px rgba(255, 255, 255, 0.4); transition: all 0.3s ease !important; /* Reduced shadow */
        }
        .cta-button:hover {
          transform: translateY(-2px); box-shadow: 0 5px 20px rgba(255, 255, 255, 0.6); /* Reduced shadow */
          background: linear-gradient(135deg, #ffffff 0%, #ffffff 100%) !important; /* Solid white on hover */
        }
        
        .hamburger { display: none; flex-direction: column; cursor: pointer; gap: 4px; }
        .hamburger span { width: 22px; height: 2px; background: #fff; border-radius: 2px; transition: all 0.3s ease; } /* Reduced size */
        
        @media (max-width: 768px) {
          .hamburger { display: flex; }
          .nav-menu {
            position: fixed; top: 60px; left: 0; right: 0; flex-direction: column; /* Reduced from 70px */
            background: rgba(10, 10, 15, 0.98); padding: 15px; gap: 15px;
            transform: translateY(${isMenuOpen ? '0' : '-100%'});
            opacity: ${isMenuOpen ? '1' : '0'}; transition: all 0.3s ease;
            pointer-events: ${isMenuOpen ? 'all' : 'none'};
          }
          .nav-menu.mobile-active {
            display: flex !important;
          }
        }
        
        .hero {
          padding: 140px 30px 80px; background: linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%); /* Reduced padding */
          position: relative; overflow: hidden;
        }
        .hero::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0;
          background: radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
                      radial-gradient(circle at 80% 80%, rgba(204, 204, 204, 0.1) 0%, transparent 50%);
          pointer-events: none;
        }
        .hero-container {
          max-width: 1200px; margin: 0 auto; display: grid; /* Reduced from 1400px */
          grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; position: relative; z-index: 1; /* Reduced from 80px */
        }
        .hero-content { animation: slideInLeft 1s ease-out; }
        .hero h1 {
          font-size: 2.8rem; font-weight: 800; line-height: 1.2; margin-bottom: 25px; /* Reduced from 3.5rem */
          background: linear-gradient(135deg, #ffffff 0%, #cccccc 100%); /* White gradient */
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }
        .hero p { 
          font-size: 1.1rem; color: rgba(255,255,255,0.8); line-height: 1.7; margin-bottom: 35px; /* Reduced from 1.25rem */
        }
        .hero-cta {
          padding: 15px 35px; font-size: 1rem; font-weight: 600; border: none; border-radius: 10px; /* Reduced from 18px 40px */
          background: linear-gradient(135deg, #ffffff 0%, #cccccc 100%); /* White gradient */
          color: #000000; /* Black text for contrast */
          cursor: pointer; box-shadow: 0 8px 25px rgba(255, 255, 255, 0.4); transition: all 0.3s ease; /* Reduced shadow */
        }
        .hero-cta:hover {
          transform: translateY(-3px); box-shadow: 0 12px 35px rgba(255, 255, 255, 0.6); /* Reduced shadow */
          background: linear-gradient(135deg, #ffffff 0%, #ffffff 100%); /* Solid white on hover */
        }
        .hero-image { animation: slideInRight 1s ease-out; }
        .hero-image img {
          width: 100%; height: auto; border-radius: 16px; box-shadow: 0 15px 45px rgba(0,0,0,0.5); /* Reduced shadow */
          animation: float 6s ease-in-out infinite;
        }
        
        @media (max-width: 968px) {
          .hero-container { grid-template-columns: 1fr; gap: 40px; }
          .hero h1 { font-size: 2.2rem; } /* Reduced from 2.5rem */
          .hero { padding: 120px 20px 60px; }
        }
        
        @media (max-width: 480px) {
          .hero h1 { font-size: 1.8rem; } /* Reduced from 2rem */
          .hero p { font-size: 1rem; }
          .nav-container { padding: 12px 20px; }
          .logo h2 { font-size: 1.4rem; } /* Reduced from 1.5rem */
        }
        
        /* Scrolling Animation Classes */
        .section {
          padding: 80px 30px; position: relative; /* Reduced from 120px 40px */
          opacity: 0; transform: translateY(50px); transition: all 0.8s ease;
        }
        .section.visible {
          opacity: 1; transform: translateY(0);
        }
        
        .container { max-width: 1200px; margin: 0 auto; } /* Reduced from 1400px */
        .section h2 {
          font-size: 2.2rem; font-weight: 800; text-align: center; margin-bottom: 20px; /* Reduced from 2.8rem */
          background: linear-gradient(135deg, #ffffff 0%, #cccccc 100%); /* White gradient */
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }
        .section-subtitle {
          text-align: center; font-size: 1.1rem; color: rgba(255,255,255,0.7); /* Reduced from 1.2rem */
          margin-bottom: 60px; max-width: 700px; margin-left: auto; margin-right: auto; /* Reduced from 80px and 800px */
        }
        
        .services-grid {
          display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 30px; margin-top: 50px; /* Reduced gap and margin */
        }
        .service-card {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(204, 204, 204, 0.1) 100%);
          padding: 30px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); transition: all 0.3s ease; /* Reduced padding */
          opacity: 0; transform: translateY(30px); transition: all 0.6s ease 0.2s;
        }
        .section.visible .service-card {
          opacity: 1; transform: translateY(0);
        }
        .service-card:hover {
          transform: translateY(-8px); border-color: rgba(255, 255, 255, 0.5); /* Reduced from -10px */
          box-shadow: 0 15px 35px rgba(255, 255, 255, 0.2); /* Reduced shadow */
        }
        .service-card h3 { font-size: 1.6rem; font-weight: 700; margin-bottom: 20px; color: #ffffff; } /* Reduced from 1.8rem */
        .service-card ul { list-style: none; }
        .service-card li {
          padding: 10px 0; color: rgba(255,255,255,0.8); font-size: 1rem; /* Reduced from 12px 0 and 1.05rem */
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .service-card li:last-child { border-bottom: none; }
        .service-card li::before { content: '→'; margin-right: 10px; color: #ffffff; font-weight: bold; } /* Reduced from 12px */
        
        @media (max-width: 768px) {
          .services-grid { grid-template-columns: 1fr; }
          .section { padding: 60px 20px; } /* Reduced from 80px 20px */
          .section h2 { font-size: 1.8rem; } /* Reduced from 2rem */
        }
        
        @media (max-width: 480px) {
          .section h2 { font-size: 1.5rem; } /* Reduced from 1.6rem */
          .section-subtitle { font-size: 1rem; }
          .service-card { padding: 25px 18px; } /* Reduced from 30px 20px */
        }
        
        .platform-section {
          background: linear-gradient(135deg, #1a1a2e 0%, #0a0a0f 100%); padding: 80px 30px; /* Reduced padding */
        }
        .platform-content {
          display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; /* Reduced from 80px */
        }
        .platform-text h2 { text-align: left; margin-bottom: 25px; } /* Reduced from 30px */
        .platform-text p {
          font-size: 1.05rem; color: rgba(255,255,255,0.8); line-height: 1.7; margin-bottom: 25px; /* Reduced from 1.15rem */
        }
        .platform-features { display: grid; gap: 20px; } /* Reduced from 25px */
        .platform-feature {
          display: flex; align-items: start; gap: 15px; padding: 20px; /* Reduced from 20px and 25px */
          background: rgba(255, 255, 255, 0.05); border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.05); transition: all 0.3s ease;
          opacity: 0; transform: translateX(-30px); transition: all 0.6s ease;
        }
        .section.visible .platform-feature {
          opacity: 1; transform: translateX(0);
        }
        .platform-feature:nth-child(1) { transition-delay: 0.1s; }
        .platform-feature:nth-child(2) { transition-delay: 0.2s; }
        .platform-feature:nth-child(3) { transition-delay: 0.3s; }
        .platform-feature:nth-child(4) { transition-delay: 0.4s; }
        .platform-feature:hover {
          background: rgba(255, 255, 255, 0.1); border-color: rgba(255, 255, 255, 0.3);
          transform: translateX(8px); /* Reduced from 10px */
        }
        .platform-feature-icon { 
          min-width: 45px; color: #ffffff; /* Reduced from 50px */
          display: flex; align-items: center; justify-content: center;
        }
        .svg-icon {
          width: 28px;
          height: 28px;
          color: #ffffff;
        }
        .platform-feature-content h4 {
          font-size: 1.2rem; font-weight: 600; margin-bottom: 8px; color: #ffffff; /* Reduced from 1.3rem */
        }
        .platform-feature-content p { font-size: 0.95rem; color: rgba(255,255,255,0.7); margin: 0; } /* Reduced from 1rem */
        .platform-visual img {
          width: 100%; border-radius: 16px; box-shadow: 0 15px 45px rgba(0,0,0,0.5); /* Reduced shadow */
        }
        
        @media (max-width: 968px) {
          .platform-content { grid-template-columns: 1fr; gap: 40px; }
        }
        
        @media (max-width: 480px) {
          .platform-feature { flex-direction: column; text-align: center; }
          .platform-feature-icon { margin: 0 auto; }
        }
        
        .integrations-section { background: #0a0a0f; padding: 80px 30px; } /* Reduced padding */
        .integrations-grid {
          display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 25px; margin-top: 50px; /* Reduced from 200px and 30px */
        }
        
        @media (max-width: 768px) {
          .integrations-grid { grid-template-columns: repeat(2, 1fr); gap: 20px; }
        }
        
        @media (max-width: 480px) {
          .integrations-grid { grid-template-columns: 1fr; }
        }
        .integration-card {
          background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%);
          padding: 25px 18px; border-radius: 14px; border: 1px solid rgba(255,255,255,0.1); /* Reduced padding */
          text-align: center; transition: all 0.3s ease; cursor: pointer;
          opacity: 0; transform: scale(0.9); transition: all 0.6s ease;
        }
        .section.visible .integration-card {
          opacity: 1; transform: scale(1);
        }
        .integration-card:hover {
          transform: translateY(-8px) scale(1.03); border-color: rgba(255, 255, 255, 0.5); /* Reduced from -10px and 1.05 */
          box-shadow: 0 12px 35px rgba(255, 255, 255, 0.2); /* Reduced shadow */
        }
        .integration-logo {
          width: 70px; height: 70px; margin: 0 auto 18px; background: #fff; border-radius: 14px; /* Reduced from 80px */
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 15px rgba(0,0,0,0.3); overflow: hidden; /* Reduced shadow */
          padding: 12px; /* Reduced from 15px */
        }
        .integration-logo img { 
          width: 100%; 
          height: 100%; 
          object-fit: contain;
          max-width: 70%;
          max-height: 70%;
        }
        .integration-card h4 { font-size: 1rem; font-weight: 600; color: #fff; margin-bottom: 8px; } /* Reduced from 1.1rem */
        .integration-card p { font-size: 0.85rem; color: rgba(255,255,255,0.6); } /* Reduced from 0.9rem */
        
        .differentiators-grid {
          display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: 30px; margin-top: 50px; /* Reduced from 380px and 40px */
        }
        .differentiator-card {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(204, 204, 204, 0.08) 100%);
          padding: 35px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.1); transition: all 0.4s ease; /* Reduced padding */
          opacity: 0; transform: translateY(40px); transition: all 0.6s ease;
        }
        .section.visible .differentiator-card {
          opacity: 1; transform: translateY(0);
        }
        .differentiator-card:nth-child(1) { transition-delay: 0.1s; }
        .differentiator-card:nth-child(2) { transition-delay: 0.2s; }
        .differentiator-card:nth-child(3) { transition-delay: 0.3s; }
        .differentiator-card:hover {
          transform: translateY(-8px); border-color: rgba(255, 255, 255, 0.5); /* Reduced from -10px */
          box-shadow: 0 20px 45px rgba(255, 255, 255, 0.3); /* Reduced shadow */
        }
        /* SVG Icons for differentiator cards - Removed white boxes */
        .differentiator-icon {
          width: 60px; height: 60px; border-radius: 14px; margin-bottom: 25px; /* Reduced from 70px */
          display: flex; align-items: center; justify-content: center;
          background: transparent; /* Changed from gradient */
        }
        .differentiator-icon svg {
          width: 32px;
          height: 32px;
          color: #ffffff; /* White icons */
        }
        .differentiator-card h3 { font-size: 1.5rem; font-weight: 700; margin-bottom: 18px; color: #fff; } /* Reduced from 1.6rem */
        .differentiator-card p {
          font-size: 1rem; color: rgba(255,255,255,0.7); line-height: 1.7; margin-bottom: 25px; /* Reduced from 1.1rem */
        }
        .differentiator-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; } /* Reduced from 20px */
        .stat {
          text-align: center; padding: 18px; background: rgba(255, 255, 255, 0.1); border-radius: 10px; /* Reduced padding */
          border: 1px solid rgba(255,255,255,0.05);
        }
        .stat-value {
          display: block; font-size: 1.8rem; font-weight: 800; margin-bottom: 6px; /* Reduced from 2.2rem */
          background: linear-gradient(135deg, #ffffff 0%, #cccccc 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }
        .stat-label { display: block; font-size: 0.85rem; color: rgba(255,255,255,0.6); } /* Reduced from 0.9rem */
        
        @media (max-width: 768px) {
          .differentiators-grid { grid-template-columns: 1fr; }
          .differentiator-card { padding: 25px; } /* Reduced from 30px */
        }
        
        @media (max-width: 480px) {
          .differentiator-card h3 { font-size: 1.3rem; }
          .differentiator-stats { grid-template-columns: 1fr; }
        }
        
        .workflow-grid {
          display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; margin-top: 50px; /* Reduced from 80px */
        }
        .workflow-features { display: grid; gap: 25px; } /* Reduced from 30px */
        .feature {
          padding: 25px; background: rgba(255, 255, 255, 0.05); border-radius: 14px; /* Reduced from 30px and 16px */
          border: 1px solid rgba(255,255,255,0.05); transition: all 0.3s ease;
          opacity: 0; transform: translateX(-30px); transition: all 0.6s ease;
        }
        .section.visible .feature {
          opacity: 1; transform: translateX(0);
        }
        .feature:nth-child(1) { transition-delay: 0.1s; }
        .feature:nth-child(2) { transition-delay: 0.2s; }
        .feature:nth-child(3) { transition-delay: 0.3s; }
        .feature:hover {
          background: rgba(255, 255, 255, 0.1); border-color: rgba(255, 255, 255, 0.3);
          transform: translateX(8px); /* Reduced from 10px */
        }
        .feature h4 { 
          font-size: 1.3rem; font-weight: 600; margin-bottom: 10px; color: #ffffff; /* Reduced from 1.4rem */
          display: flex; align-items: center; gap: 10px;
        }
        .feature p { font-size: 1rem; color: rgba(255,255,255,0.7); line-height: 1.6; } /* Reduced from 1.05rem */
        .workflow-image img {
          width: 100%; border-radius: 16px; box-shadow: 0 15px 45px rgba(0,0,0,0.5); /* Reduced shadow */
        }
        
        @media (max-width: 968px) {
          .workflow-grid { grid-template-columns: 1fr; gap: 40px; }
        }
        
        @media (max-width: 480px) {
          .feature { padding: 20px; }
          .feature h4 { font-size: 1.1rem; } /* Reduced from 1.2rem */
        }
        
        .process-steps {
          display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); /* Reduced from 280px */
          gap: 25px; margin-top: 50px; margin-bottom: 50px; /* Reduced from 30px and 60px */
        }
        .step {
          padding: 30px; background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(204, 204, 204, 0.08) 100%); /* Reduced padding */
          border-radius: 16px; border: 1px solid rgba(255,255,255,0.1);
          text-align: center; transition: all 0.3s ease; position: relative;
          opacity: 0; transform: translateY(40px); transition: all 0.6s ease;
        }
        .section.visible .step {
          opacity: 1; transform: translateY(0);
        }
        .step:nth-child(1) { transition-delay: 0.1s; }
        .step:nth-child(2) { transition-delay: 0.2s; }
        .step:nth-child(3) { transition-delay: 0.3s; }
        .step:nth-child(4) { transition-delay: 0.4s; }
        .step::before {
          content: ''; position: absolute; top: 50%; right: -12px; width: 25px; height: 2px; /* Reduced from -15px and 30px */
          background: linear-gradient(90deg, #ffffff, transparent);
        }
        .step:last-child::before { display: none; }
        .step:hover {
          transform: translateY(-8px); border-color: rgba(255, 255, 255, 0.5); /* Reduced from -10px */
          box-shadow: 0 12px 35px rgba(255, 255, 255, 0.2); /* Reduced shadow */
        }
        .step h3 { font-size: 1.4rem; font-weight: 700; margin-bottom: 12px; color: #ffffff; } /* Reduced from 1.5rem */
        .step p { font-size: 1rem; color: rgba(255,255,255,0.7); line-height: 1.6; } /* Reduced from 1.05rem */
        .process-image img {
          width: 100%; max-width: 700px; margin: 0 auto; display: block; /* Reduced from 800px */
          border-radius: 16px; box-shadow: 0 15px 45px rgba(0,0,0,0.5); /* Reduced shadow */
        }
        
        @media (max-width: 768px) {
          .process-steps { grid-template-columns: 1fr; }
          .step::before { display: none; }
        }
        
        .client-showcase {
          background: linear-gradient(135deg, #1a1a2e 0%, #0a0a0f 100%); padding: 80px 30px; /* Reduced padding */
        }
        .client-showcase-content {
          display: grid; grid-template-columns: 1fr 1.2fr; gap: 60px; align-items: center; /* Reduced from 80px */
        }
        .client-info h2 { text-align: left; margin-bottom: 12px; } /* Reduced from 15px */
        .client-info h3 { font-size: 2rem; font-weight: 800; color: #ffffff; margin-bottom: 8px; } /* Reduced from 2.5rem */
        .client-industry {
          font-size: 1rem; color: rgba(255,255,255,0.5); margin-bottom: 25px; /* Reduced from 1.1rem and 30px */
          text-transform: uppercase; letter-spacing: 1.5px;
        }
        .client-description {
          font-size: 1.05rem; color: rgba(255,255,255,0.8); line-height: 1.7; margin-bottom: 35px; /* Reduced from 1.15rem and 40px */
        }
        .client-results { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; } /* Reduced from 20px */
        .result {
          text-align: center; padding: 22px; background: rgba(255, 255, 255, 0.1); border-radius: 10px; /* Reduced padding */
          border: 1px solid rgba(255,255,255,0.05);
        }
        .result-value {
          display: block; font-size: 1.7rem; font-weight: 800; margin-bottom: 6px; /* Reduced from 2rem */
          background: linear-gradient(135deg, #ffffff 0%, #cccccc 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }
        .result-label { display: block; font-size: 0.85rem; color: rgba(255,255,255,0.6); } /* Reduced from 0.9rem */
        
        @media (max-width: 968px) {
          .client-showcase-content { grid-template-columns: 1fr; gap: 40px; }
          .client-results { grid-template-columns: 1fr; }
        }
        
        .carousel-container {
          position: relative; border-radius: 16px; overflow: hidden; /* Reduced from 20px */
          box-shadow: 0 15px 45px rgba(0,0,0,0.5); /* Reduced shadow */
        }
        .carousel { position: relative; width: 100%; height: 450px; } /* Reduced from 500px */
        .carousel-slides {
          display: flex; height: 100%; transition: transform 0.5s ease-in-out;
        }
        .carousel-slide {
          min-width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;
        }
        .carousel-slide img {
          width: 100%; height: 100%; object-fit: contain; /* Changed from cover to contain to prevent zoom */
          background: #000; /* Add black background for letterboxing */
        }
        .carousel-btn {
          position: absolute; top: 50%; transform: translateY(-50%); z-index: 10;
          background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.3); color: #fff;
          width: 45px; height: 45px; border-radius: 50%; font-size: 1.8rem; /* Reduced from 50px and 2rem */
          cursor: pointer; transition: all 0.3s ease; backdrop-filter: blur(5px);
        }
        .carousel-btn:hover { background: rgba(0,0,0,0.7); border-color: rgba(255,255,255,0.5); }
        .carousel-btn-prev { left: 15px; } /* Reduced from 20px */
        .carousel-btn-next { right: 15px; } /* Reduced from 20px */
        .carousel-dots {
          position: absolute; bottom: 15px; left: 50%; transform: translateX(-50%); /* Reduced from 20px */
          display: flex; gap: 8px; z-index: 10; /* Reduced from 10px */
        }
        .carousel-dot {
          width: 10px; height: 10px; border-radius: 50%; background: rgba(255,255,255,0.3); /* Reduced from 12px */
          border: none; cursor: pointer; transition: all 0.3s ease;
        }
        .carousel-dot.active {
          background: #fff; transform: scale(1.2); /* Reduced from 1.3 */
        }
        
        .action-plan { background: #0a0a0f; padding: 80px 30px; } /* Reduced padding */
        .action-content {
          display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; /* Reduced from 80px */
        }
        .action-text h2 { text-align: left; margin-bottom: 25px; } /* Reduced from 30px */
        .action-text ol {
          list-style: none; counter-reset: action-counter; display: grid; gap: 25px; /* Reduced from 30px */
        }
        .action-text li {
          counter-increment: action-counter; padding: 25px; background: rgba(255, 255, 255, 0.05); /* Reduced padding */
          border-radius: 14px; border: 1px solid rgba(255,255,255,0.05); transition: all 0.3s ease;
          opacity: 0; transform: translateX(-30px); transition: all 0.6s ease;
        }
        .section.visible .action-text li {
          opacity: 1; transform: translateX(0);
        }
        .action-text li:nth-child(1) { transition-delay: 0.1s; }
        .action-text li:nth-child(2) { transition-delay: 0.2s; }
        .action-text li:nth-child(3) { transition-delay: 0.3s; }
        .action-text li:nth-child(4) { transition-delay: 0.4s; }
        .action-text li:hover {
          background: rgba(255, 255, 255, 0.1); border-color: rgba(255, 255, 255, 0.3);
          transform: translateX(8px); /* Reduced from 10px */
        }
        .action-text li::before {
          content: counter(action-counter); display: inline-block; width: 36px; height: 36px; /* Reduced from 40px */
          background: linear-gradient(135deg, #ffffff 0%, #cccccc 100%); border-radius: 50%;
          text-align: center; line-height: 36px; margin-right: 12px; font-weight: 800; /* Reduced from 40px and 15px */
          color: #000000; /* Black text for contrast */
        }
        .action-text strong { font-size: 1.2rem; color: #ffffff; display: block; margin-bottom: 8px; } /* Reduced from 1.3rem */
        .action-text p { font-size: 1rem; color: rgba(255,255,255,0.7); line-height: 1.6; margin: 0; } /* Reduced from 1.05rem */
        .action-image img {
          width: 100%; border-radius: 16px; box-shadow: 0 15px 45px rgba(0,0,0,0.5); /* Reduced shadow */
        }
        
        @media (max-width: 968px) {
          .action-content { grid-template-columns: 1fr; gap: 40px; }
        }
        
        .contact { background: linear-gradient(135deg, #1a1a2e 0%, #0a0a0f 100%); padding: 80px 30px; } /* Reduced padding */
        .contact-subtitle {
          text-align: center; font-size: 1.1rem; color: rgba(255,255,255,0.7); margin-bottom: 50px; /* Reduced from 1.2rem and 60px */
        }
        .contact-content {
          display: grid; grid-template-columns: 1fr 1.5fr; gap: 50px; max-width: 1100px; margin: 0 auto; /* Reduced from 60px and 1200px */
        }
        .contact-info {
          background: rgba(255, 255, 255, 0.05); padding: 30px; border-radius: 16px; /* Reduced padding */
          border: 1px solid rgba(255,255,255,0.1);
        }
        .contact-info h3 { font-size: 1.8rem; font-weight: 700; margin-bottom: 25px; color: #ffffff; } /* Reduced from 2rem and 30px */
        .contact-details { display: grid; gap: 15px; } /* Reduced from 20px */
        .contact-item {
          padding: 18px; background: rgba(255, 255, 255, 0.05); border-radius: 10px; /* Reduced padding */
          border: 1px solid rgba(255,255,255,0.05);
        }
        .contact-item strong {
          display: block; font-size: 0.85rem; color: rgba(255,255,255,0.5); margin-bottom: 6px; /* Reduced from 0.9rem and 8px */
          text-transform: uppercase; letter-spacing: 1px;
        }
        .contact-item span { font-size: 1rem; color: #fff; font-weight: 500; } /* Reduced from 1.1rem */
        
        .contact-form { display: grid; gap: 15px; } /* Reduced from 20px */
        .form-group { position: relative; }
        .form-group input,
        .form-group textarea {
          width: 100%; padding: 14px 18px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); /* Reduced padding */
          border-radius: 10px; color: #fff; font-size: 0.95rem; font-family: 'Inter', sans-serif; /* Reduced from 1rem */
          transition: all 0.3s ease;
        }
        .form-group input:focus,
        .form-group textarea:focus {
          outline: none; border-color: #ffffff; background: rgba(255,255,255,0.08);
          box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.1); /* Reduced from 3px */
        }
        .form-group textarea { resize: vertical; min-height: 110px; } /* Reduced from 120px */
        .form-group input::placeholder,
        .form-group textarea::placeholder { color: rgba(255,255,255,0.4); }
        
        .submit-btn {
          padding: 16px 35px; font-size: 1rem; font-weight: 600; border: none; border-radius: 10px; /* Reduced from 18px 40px and 12px */
          background: linear-gradient(135deg, #ffffff 0%, #cccccc 100%); color: #000000;
          cursor: pointer; transition: all 0.3s ease; box-shadow: 0 8px 25px rgba(255, 255, 255, 0.4); /* Reduced shadow */
        }
        .submit-btn:hover:not(:disabled) {
          transform: translateY(-3px); box-shadow: 0 12px 35px rgba(255, 255, 255, 0.6); /* Reduced shadow */
          background: linear-gradient(135deg, #ffffff 0%, #ffffff 100%);
        }
        .submit-btn:disabled {
          opacity: 0.7; cursor: not-allowed;
        }
        
        .form-message {
          padding: 14px 18px; border-radius: 10px; font-size: 0.95rem; font-weight: 500; /* Reduced padding and font */
          animation: fadeInUp 0.3s ease;
        }
        .form-message.success {
          background: rgba(34, 197, 94, 0.1); color: #4ade80; border: 1px solid rgba(34, 197, 94, 0.3);
        }
        .form-message.error {
          background: rgba(239, 68, 68, 0.1); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.3);
        }
        
        @media (max-width: 968px) {
          .contact-content { grid-template-columns: 1fr; gap: 35px; } /* Reduced from 40px */
        }
        
        .footer {
          background: #0a0a0f; padding: 50px 30px 25px; border-top: 1px solid rgba(255,255,255,0.1); /* Reduced padding */
        }
        .footer-content {
          max-width: 1200px; margin: 0 auto; display: grid; /* Reduced from 1400px */
          grid-template-columns: 2fr 1fr; gap: 50px; margin-bottom: 35px; /* Reduced from 60px and 40px */
        }
        .footer-brand h3 {
          font-size: 1.8rem; font-weight: 800; margin-bottom: 12px; /* Reduced from 2rem and 15px */
          background: linear-gradient(135deg, #ffffff 0%, #cccccc 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }
        .footer-brand p { font-size: 0.95rem; color: rgba(255,255,255,0.6); line-height: 1.6; } /* Reduced from 1rem */
        .footer-links { display: flex; flex-wrap: wrap; gap: 25px; align-items: start; } /* Reduced from 30px */
        .footer-links a {
          color: rgba(255,255,255,0.7); text-decoration: none; font-weight: 500;
          transition: all 0.3s ease;
        }
        .footer-links a:hover { color: #ffffff; }
        .footer-bottom {
          max-width: 1200px; margin: 0 auto; padding-top: 25px; /* Reduced from 1400px and 30px */
          border-top: 1px solid rgba(255,255,255,0.05); text-align: center;
        }
        .footer-bottom p { color: rgba(255,255,255,0.5); font-size: 0.9rem; } /* Reduced from 0.95rem */
        
        @media (max-width: 768px) {
          .footer-content { grid-template-columns: 1fr; gap: 25px; } /* Reduced from 30px */
          .footer-links { flex-direction: column; gap: 12px; } /* Reduced from 15px */
        }
      `}</style>

      {isLoading && (
        <div className="loading-screen">
  <div className="loading-logo">
    <div className="logo-container">
      <img 
        src={`${process.env.PUBLIC_URL}/logo192.png`} 
        alt="Prudata Logo" 
        className="loading-logo-image"
      />
    </div>
    <h1>Prudata</h1>
    <div className="loading-subtitle">Where Ideas Meet Impact – Launch Smarter, Grow Faster</div>
  </div>
  <div className="spinner"></div>
  <div className="loading-progress">
    <div className="loading-progress-bar" style={{ width: `${loadingProgress}%` }}></div>
  </div>
  <div className="loading-percentage">{Math.min(100, Math.round(loadingProgress))}%</div>
</div>
      )}

      {!isLoading && (
        <>
          <nav className="navbar">
            <div className="nav-container">
              <div className="logo">
                <h2>Prudata</h2>
              </div>
              <div className={`nav-menu ${isMenuOpen ? 'mobile-active' : ''}`}>
                <a href="#services" onClick={(e) => { e.preventDefault(); scrollToSection('services'); }}>Services</a>
                <a href="#platform" onClick={(e) => { e.preventDefault(); scrollToSection('platform'); }}>Platform</a>
                <a href="#integrations" onClick={(e) => { e.preventDefault(); scrollToSection('integrations'); }}>Integrations</a>
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

          <section className="hero">
            <div className="hero-container">
              <div className="hero-content">
                <h1>Transform Your Business with Prudata</h1>
                <p>Prudata is an enterprise-grade SaaS platform offering seamless integrations, powerful automation, and intelligent workflows designed to accelerate digital transformation for modern businesses across industries.</p>
                <p>Our comprehensive solutions help organizations optimize operations, enhance customer experiences, and drive measurable business outcomes through cutting-edge technology and data-driven insights.</p>
                <button className="hero-cta" onClick={() => scrollToSection('contact')}>
                  Start Your Digital Journey
                </button>
              </div>
              <div className="hero-image">
                <img src={`${process.env.PUBLIC_URL}/images/7.png`} alt="Prudata Platform Dashboard" loading="lazy" />
              </div>
            </div>
          </section>

          <section 
            id="services" 
            className={`section ${visibleSections.has('services') ? 'visible' : ''}`}
            ref={el => sectionRefs.current['services'] = el}
          >
            <div className="container">
              <h2>Comprehensive Digital Services</h2>
              <p className="section-subtitle">End-to-end solutions designed to address every aspect of your digital transformation journey</p>
              <div className="services-grid">
                <div className="service-card">
                  <h3>Development Services</h3>
                  <ul>
                    <li>Custom Web & Mobile Application Development</li>
                    <li>SaaS Product Development & Architecture</li>
                    <li>AI/ML Integration & Custom Solutions</li>
                    <li>Cloud-Native Application Development</li>
                    <li>API Development & Integration</li>
                    <li>Progressive Web Applications (PWA)</li>
                  </ul>
                </div>
                <div className="service-card">
                  <h3>Consulting & Strategy</h3>
                  <ul>
                    <li>Cloud Migration & Infrastructure Consulting</li>
                    <li>UI/UX Design & User Experience Optimization</li>
                    <li>Digital Transformation Strategy</li>
                    <li>IT Infrastructure & Support Services</li>
                    <li>Technology Stack Evaluation</li>
                    <li>Compliance & Security Audits</li>
                  </ul>
                </div>
                <div className="service-card">
                  <h3>Business Solutions</h3>
                  <ul>
                    <li>Digital Transformation Roadmapping</li>
                    <li>Workflow Automation & Process Optimization</li>
                    <li>Data Analytics & Business Intelligence</li>
                    <li>Enterprise System Integration</li>
                    <li>Social media and marketing</li>
                    <li>Performance Monitoring & Optimization</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <section 
            id="platform" 
            className={`platform-section section ${visibleSections.has('platform') ? 'visible' : ''}`}
            ref={el => sectionRefs.current['platform'] = el}
          >
            <div className="container">
              <div className="platform-content">
                <div className="platform-text">
                  <h2>Unified Platform for Modern Enterprises</h2>
                  <p>Prudata combines powerful features with intuitive design to deliver a seamless experience across all your business operations. Our platform is built on cutting-edge technology that scales with your business needs.</p>
                  <p>With Prudata, you get more than just software – you get a strategic partner in your digital transformation journey, providing tools and insights to drive growth and innovation.</p>
                  <div className="platform-features">
                    <div className="platform-feature">
                      <div className="platform-feature-icon">
                        <SVGIcon name="performance" className="svg-icon" />
                      </div>
                      <div className="platform-feature-content">
                        <h4>Lightning Fast Performance & Uptime</h4>
                        <p>Optimized infrastructure ensures sub-second response times and 99.9% uptime guarantee with global CDN distribution and load balancing.</p>
                      </div>
                    </div>
                    <div className="platform-feature">
                      <div className="platform-feature-icon">
                        <SVGIcon name="security" className="svg-icon" />
                      </div>
                      <div className="platform-feature-content">
                        <h4>Enterprise-Grade Security</h4>
                        <p>Bank-level encryption, multi-factor authentication, and compliance with SOC 2, GDPR, HIPAA, and ISO 27001 standards with regular security audits.</p>
                      </div>
                    </div>
                    <div className="platform-feature">
                      <div className="platform-feature-icon">
                        <SVGIcon name="analytics" className="svg-icon" />
                      </div>
                      <div className="platform-feature-content">
                        <h4>Real-time Analytics & Insights</h4>
                        <p>Comprehensive dashboards with actionable insights, predictive analytics, and custom reporting for data-driven decision making across departments.</p>
                      </div>
                    </div>
                    <div className="platform-feature">
                      <div className="platform-feature-icon">
                        <SVGIcon name="automation" className="svg-icon" />
                      </div>
                      <div className="platform-feature-content">
                        <h4>Intelligent Automation</h4>
                        <p>Automate repetitive tasks, create custom workflows without coding, and implement AI-driven process optimization across your organization.</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="platform-visual">
                  <img src={`${process.env.PUBLIC_URL}/images/1.png`} alt="Prudata Platform Dashboard Interface" loading="lazy" />
                </div>
              </div>
            </div>
          </section>

          <section 
            id="integrations" 
            className={`integrations-section section ${visibleSections.has('integrations') ? 'visible' : ''}`}
            ref={el => sectionRefs.current['integrations'] = el}
          >
            <div className="container">
              <h2>Seamless Ecosystem Integrations</h2>
              <p className="section-subtitle">Connect with your favorite tools and services through our extensive integration ecosystem</p>
              <div className="integrations-grid">
                {Object.entries(integrationLogos).map(([name, logoUrl]) => (
                  <div className="integration-card" key={name}>
                    <div className="integration-logo">
                      <img src={logoUrl} alt={name} loading="lazy" />
                    </div>
                    <h4>{name}</h4>
                    <p>{name === 'WhatsApp' ? 'Business messaging & automation' : 
                        name === 'Gmail' ? 'Email integration & sync' :
                        name === 'Zoom' ? 'Video conferencing & collaboration' :
                        name === 'Google Calendar' ? 'Schedule management & coordination' :
                        name === 'Slack' ? 'Team communication & workflow' :
                        name === 'Salesforce' ? 'CRM integration & sales automation' :
                        name === 'Stripe' ? 'Payment processing & financial management' : 'Integration'}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section 
            id="differentiators" 
            className={`section ${visibleSections.has('differentiators') ? 'visible' : ''}`}
            ref={el => sectionRefs.current['differentiators'] = el}
          >
            <div className="container">
              <h2>How Prudata Transforms Digital Ecosystems</h2>
              <p className="section-subtitle">
                Our integrated platform doesn't just solve problems—it transforms entire ecosystems with measurable impact across industries.
              </p>
              <div className="differentiators-grid">
                <div className="differentiator-card">
                  <div className="differentiator-icon">
                  
                  </div>
                  <h3>End-to-End Research & Talent Orchestration</h3>
                  <p>
                    Unified platform seamlessly integrating Research Management, Fellowship Programs, Grant Lifecycle Management, and Mentor Networks. Our solution accelerates research outcomes by 40% while improving talent matching by 75%.
                  </p>
                  <div className="differentiator-stats">
                    <div className="stat">
                      <span className="stat-value">40%</span>
                      <span className="stat-label">Faster Research Processing</span>
                    </div>
                    <div className="stat">
                      <span className="stat-value">75%</span>
                      <span className="stat-label">Better Talent Matching</span>
                    </div>
                  </div>
                </div>
                <div className="differentiator-card">
                  <div className="differentiator-icon">
                   
                  </div>
                  <h3>Comprehensive Startup & Investor Ecosystem</h3>
                  <p>
                    Complete ecosystem connecting startups, investors, and accelerators through Portfolio Management and Real-time Analytics. Our platform has helped startups achieve 50% higher success rates and deliver 3.5x ROI growth for investors.
                  </p>
                  <div className="differentiator-stats">
                    <div className="stat">
                      <span className="stat-value">50%</span>
                      <span className="stat-label">Higher Success Rate</span>
                    </div>
                    <div className="stat">
                      <span className="stat-value">3.5x</span>
                      <span className="stat-label">ROI Growth</span>
                    </div>
                  </div>
                </div>
                <div className="differentiator-card">
                  <div className="differentiator-icon">
                    
                  </div>
                  <h3>Dynamic Learning & Community Platform</h3>
                  <p>
                    Thriving ecosystems combining Learning Management, Community Engagement, Alumni Networks, and Communication Tools. Our platforms consistently achieve 85% engagement rates and 90% retention across educational and professional communities.
                  </p>
                  <div className="differentiator-stats">
                    <div className="stat">
                      <span className="stat-value">85%</span>
                      <span className="stat-label">Engagement Rate</span>
                    </div>
                    <div className="stat">
                      <span className="stat-value">90%</span>
                      <span className="stat-label">Retention Rate</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section 
            id="workflow" 
            className={`section ${visibleSections.has('workflow') ? 'visible' : ''}`}
            ref={el => sectionRefs.current['workflow'] = el}
          >
            <div className="container">
              <h2>Intelligent Workflow Integration</h2>
              <p className="section-subtitle">Streamline operations with our comprehensive workflow automation and management system</p>
              <div className="workflow-grid">
                <div className="workflow-features">
                  <div className="feature">
                    <h4>
                      <SVGIcon name="search" className="svg-icon" style={{ display: 'inline-block', marginRight: '10px', verticalAlign: 'middle' }} />
                      Smart Search & Cloud Sync
                    </h4>
                    <p>Advanced AI-powered search capabilities with real-time cloud synchronization across all devices and platforms. Our intelligent search learns from user behavior to deliver increasingly relevant results.</p>
                  </div>
                  <div className="feature">
                    <h4>
                      <SVGIcon name="reporting" className="svg-icon" style={{ display: 'inline-block', marginRight: '10px', verticalAlign: 'middle' }} />
                      Advanced Analytics & Reporting
                    </h4>
                    <p>Comprehensive analytics dashboard with customizable reports, real-time insights, and predictive analytics. Track KPIs, monitor performance, and make data-driven decisions with confidence.</p>
                  </div>
                  <div className="feature">
                    <h4>
                      <SVGIcon name="dataManagement" className="svg-icon" style={{ display: 'inline-block', marginRight: '10px', verticalAlign: 'middle' }} />
                      Enterprise Data Management
                    </h4>
                    <p>Enterprise-grade security with end-to-end encryption, multi-platform support, and comprehensive data governance. Ensure compliance, protect sensitive information, and maintain data integrity.</p>
                  </div>
                </div>
                <div className="workflow-image">
                  <img src={`${process.env.PUBLIC_URL}/images/4.png`} alt="Workflow Integration Dashboard" loading="lazy" />
                </div>
              </div>
            </div>
          </section>

          <section 
            id="process" 
            className={`section ${visibleSections.has('process') ? 'visible' : ''}`}
            ref={el => sectionRefs.current['process'] = el}
          >
            <div className="container">
              <h2>Our Proven Development Process</h2>
              <p className="section-subtitle">A structured approach to ensure successful project delivery and maximum business value</p>
              <div className="process-steps">
                <div className="step">
                  <h3>STRATEGY & PLANNING</h3>
                  <p>Comprehensive analysis and strategic planning to define your digital transformation roadmap, business objectives, and success metrics.</p>
                </div>
                <div className="step">
                  <h3>DESIGN & PROTOTYPING</h3>
                  <p>User-centric design approach creating intuitive and engaging user experiences with interactive prototypes and usability testing.</p>
                </div>
                <div className="step">
                  <h3>DEVELOPMENT & TESTING</h3>
                  <p>Agile development methodology ensuring quality, security, and timely delivery with continuous integration and comprehensive testing.</p>
                </div>
                <div className="step">
                  <h3>DEPLOYMENT & OPTIMIZATION</h3>
                  <p>Seamless deployment with ongoing support, performance monitoring, and continuous optimization services for long-term success.</p>
                </div>
              </div>
              <div className="process-image">
                <img src={`${process.env.PUBLIC_URL}/images/2.png`} alt="Development Process Flowchart" loading="lazy" />
              </div>
            </div>
          </section>

          <section 
            id="clients" 
            className={`client-showcase section ${visibleSections.has('clients') ? 'visible' : ''}`}
            ref={el => sectionRefs.current['clients'] = el}
          >
            <div className="container">
              <div className="client-showcase-content">
                <div className="client-info">
                  <h2>Featured Success Story</h2>
                  <h3>Seal Freight Solutions</h3>
                  <p className="client-industry">Logistics & Supply Chain Management</p>
                  <p className="client-description">
                    We revolutionized Seal Freight's logistics operations with a comprehensive SaaS solution featuring real-time tracking, automated workflows, and advanced analytics. The implementation spanned their entire supply chain network across 15 countries.
                  </p>
                  <p className="client-description">
                    The platform integrated with their existing ERP systems, provided real-time visibility into shipments, automated customs documentation, and optimized route planning using AI algorithms.
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
                    <button className="carousel-btn carousel-btn-prev" onClick={goToPrev}>‹</button>
                    <button className="carousel-btn carousel-btn-next" onClick={goToNext}>›</button>
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

          <section 
            className={`action-plan section ${visibleSections.has('action-plan') ? 'visible' : ''}`}
            ref={el => sectionRefs.current['action-plan'] = el}
          >
            <div className="container">
              <div className="action-content">
                <div className="action-text">
                  <h2>Your Digital Transformation Roadmap</h2>
                  <p>Follow this proven action plan to successfully implement your digital transformation strategy and achieve measurable business outcomes.</p>
                  <ol>
                    <li>
                      <strong>Define Your Vision & Objectives</strong>
                      <p>We work with you to understand your business goals, challenges, and opportunities to define clear, measurable objectives for your digital transformation journey.</p>
                    </li>
                    <li>
                      <strong>Analyze Requirements & Scope</strong>
                      <p>Comprehensive analysis of your business processes, technical requirements, and organizational capabilities to create a detailed project scope and implementation plan.</p>
                    </li>
                    <li>
                      <strong>Develop & Implement Solutions</strong>
                      <p>Agile development of tailored software solutions with regular iterations, stakeholder feedback, and continuous integration to ensure alignment with your business needs.</p>
                    </li>
                    <li>
                      <strong>Launch, Support & Optimize</strong>
                      <p>Seamless deployment followed by comprehensive support, training, and continuous optimization services to ensure long-term success and maximum ROI.</p>
                    </li>
                  </ol>
                </div>
                <div className="action-image">
                  <img src={`${process.env.PUBLIC_URL}/images/5.png`} alt="Digital Transformation Roadmap" loading="lazy" />
                </div>
              </div>
            </div>
          </section>

          <section 
            id="contact" 
            className={`contact section ${visibleSections.has('contact') ? 'visible' : ''}`}
            ref={el => sectionRefs.current['contact'] = el}
          >
            <div className="container">
              <h2>Start Your Digital Transformation Journey</h2>
              <p className="contact-subtitle">Contact us for a comprehensive consultation, project assessment, and personalized roadmap for your digital transformation</p>
              
              {formMessage.text && (
                <div className={`form-message ${formMessage.type}`}>
                  {formMessage.text}
                </div>
              )}
              
              <div className="contact-content">
                <div className="contact-info">
                  <h3>Get In Touch With Our Experts</h3>
                  <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '25px', fontSize: '1rem' }}>
                    Our team is ready to help you navigate your digital transformation journey with customized solutions and expert guidance.
                  </p>
                  <div className="contact-details">
                    <div className="contact-item">
                      <strong>Point of Contact</strong>
                      <span>Ningaraj Rawor
                       <br/>
                        +91 6364153540</span>
                    </div>
                    <div className="contact-item">
                      <strong>Company</strong>
                      <span>Prudata Technologies Private Limited</span>
                    </div>
                    <div className="contact-item">
                      <strong>Core Services</strong>
                      <span>SaaS Development, Cloud Solutions, Digital Transformation, AI/ML Integration</span>
                    </div>
                    <div className="contact-item">
                      <strong>Industries Served</strong>
                      <span>Logistics, Healthcare, Finance, Education, Retail, Manufacturing</span>
                    </div>
                  </div>
                </div>
                <form className="contact-form" onSubmit={handleSubmit}>
                  <div className="form-group">
                    <input
                      type="text"
                      name="name"
                      placeholder="Your Full Name *"
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
                      placeholder="Your Business Email *"
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
                      placeholder="Company/Organization Name *"
                      value={formData.company}
                      onChange={handleInputChange}
                      required
                      disabled={submitting}
                    />
                  </div>
                  <div className="form-group">
                    <textarea
                      name="message"
                      placeholder="Tell us about your project requirements, current challenges, business goals, timeline, and budget..."
                      value={formData.message}
                      onChange={handleInputChange}
                      rows="4"
                      disabled={submitting}
                    ></textarea>
                  </div>
                  <button type="submit" className="submit-btn" disabled={submitting}>
                    {submitting ? (
                      <>
                        <span style={{
                          display: 'inline-block',
                          width: '16px',
                          height: '16px',
                          border: '2px solid #000',
                          borderTop: '2px solid transparent',
                          borderRadius: '50%',
                          animation: 'spin 1s linear infinite',
                          marginRight: '8px'
                        }}></span>
                        Processing Your Request...
                      </>
                    ) : (
                      'Request a Comprehensive Consultation'
                    )}
                  </button>
                  <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', textAlign: 'center', marginTop: '10px' }}>
                    We'll respond within 24 hours with a detailed proposal and consultation schedule
                  </p>
                </form>
              </div>
            </div>
          </section>

          <footer className="footer">
            <div className="container">
              <div className="footer-content">
                <div className="footer-brand">
                  <h3>Prudata Technologies</h3>
                  <p>Building your digital future, one innovative solution at a time. We combine cutting-edge technology with deep industry expertise to deliver transformative results.</p>
                  <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', marginTop: '10px' }}>
                    Headquarters: Bengaluru, India | Global Delivery Centers
                  </p>
                </div>
                <div className="footer-links">
                  <a href="#services" onClick={(e) => { e.preventDefault(); scrollToSection('services'); }}>Services</a>
                  <a href="#platform" onClick={(e) => { e.preventDefault(); scrollToSection('platform'); }}>Platform</a>
                  <a href="#integrations" onClick={(e) => { e.preventDefault(); scrollToSection('integrations'); }}>Integrations</a>
                  <a href="#workflow" onClick={(e) => { e.preventDefault(); scrollToSection('workflow'); }}>Solutions</a>
                  <a href="#process" onClick={(e) => { e.preventDefault(); scrollToSection('process'); }}>Process</a>
                  <a href="#clients" onClick={(e) => { e.preventDefault(); scrollToSection('clients'); }}>Case Studies</a>
                  <a href="#contact" onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }}>Contact</a>
                </div>
              </div>
              <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} Prudata Technologies Private Limited. All rights reserved. | Privacy Policy | Terms of Service</p>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', marginTop: '8px' }}>
                  ISO 27001 Certified | GDPR Compliant | SOC 2 Type II Certified
                </p>
              </div>
            </div>
          </footer>
        </>
      )}
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/*" element={<PrudataLandingPage />} />
      </Routes>
    </Router>
  );
};

export default App;