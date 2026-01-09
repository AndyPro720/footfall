import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { geoData, tradeData } from '../data/geoData.js';
import Chart from 'chart.js/auto';
import Papa from 'papaparse';
import { DataManager } from '../data/dataManager.js';

export const Intelligence = {
  render: () => {
    return `
      <div class="page intelligence-page">
        <!-- Loading Screen -->


        <!-- FIXED BACKGROUND ELEMENTS -->
        <div id="map-container"></div>
        
        <!-- Legend -->
        <div id="legend">
          <div class="legend-title">Map Layers</div>
          <div id="legend-content"></div>
        </div>

        <!-- Tip Box -->
        <div id="tip-box">
          <div class="tip-header">
            <div class="tip-title">💡 Hover over a country to see cities • Click to navigate</div>
            <div class="tip-toggle">▼</div>
          </div>
          <div class="tip-details"></div>
        </div>

        <!-- Embedded Watermark Logo (Fixed) -->
        <div class="watermark-logo" id="watermark-home">
           <img src="/logo.png" alt="Footfall">
        </div>

        <!-- Top Bar (Fixed) -->
        <div id="top-bar">
          <div class="breadcrumb-back" id="btn-back">← Back</div>
          <div class="breadcrumb-item" id="bc-global">Global</div>
        </div>
        
        <!-- Wizard Overlay (Fixed on top) -->
        <div id="wizard-overlay" class="hidden">
           <!-- ... wizard content ... -->
           <div class="wizard-card">
              <!-- Slide 1 -->
              <div class="wizard-slide active" id="slide-1">
                <h2 class="wizard-title">Welcome</h2>
                <p class="wizard-subtitle">Enter details to access Footfall market intelligence™</p>
                <input type="text" class="wizard-input" id="input-name" placeholder="Your Name">
                <input type="text" class="wizard-input" id="input-brand" placeholder="Brand Name">
                <button class="wizard-btn" id="btn-next-1">Continue</button>
              </div>
              <!-- Slide 2 -->
              <div class="wizard-slide" id="slide-2">
                <div class="wizard-header-row" style="display:flex; align-items:center; margin-bottom:1rem;">
                  <button class="wizard-back" id="btn-back-2">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                  </button>
                  <h2 class="wizard-title" style="margin:0;">Select Market</h2>
                </div>
                <p class="wizard-subtitle">Where would you like to scout today?</p>
                <select class="wizard-input" id="country-select">
                  <option value="" disabled selected>Select Country</option>
                  <option value="India">India</option>
                  <option value="UAE">UAE</option>
                </select>
                <select class="wizard-input" id="city-select" disabled>
                  <option value="" disabled selected>Select City</option>
                </select>
                <button class="wizard-btn" id="btn-next-2" disabled>Personalize My View</button>
                <button class="wizard-btn secondary" id="btn-explore-all">Launch Satellite View</button>
              </div>
              <!-- Slide 3 -->
              <div class="wizard-slide" id="slide-3">
                 <div class="wizard-header-row" style="display:flex; align-items:center; margin-bottom:1rem;">
                   <button class="wizard-back" id="btn-back-3">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                  </button>
                  <h2 class="wizard-title" style="margin:0;">Refine Search</h2>
                </div>
                <p class="wizard-subtitle">Customize intelligence parameters.</p>
                <select class="wizard-input" id="sector-select">
                  <option value="retail">Retail</option>
                  <option value="fnb">Food & Beverage</option>
                  <option value="fashion">Fashion</option>
                </select>
                <select class="wizard-input" id="aov-select">
                  <option value="high">High AOV (Premium)</option>
                  <option value="med">Medium AOV</option>
                </select>
                <button class="wizard-btn" id="btn-finish">Initialize Dashboard</button>
              </div>
           </div>
        </div>

        <!-- Sidebar (Fixed) -->
        <div id="sidebar">
          <div class="sidebar-header">
            <h3 class="sidebar-title" id="sidebar-title">Location Data</h3>
            <button class="close-btn" id="close-sidebar">&times;</button>
          </div>
          <div class="sidebar-content" id="sidebar-content"></div>
        </div>

        <!-- Customisation Panel -->
        <div id="customisation-panel" class="customisation-panel">
          <div class="panel-header">
            <h3>🎯 Find Your Perfect Location</h3>
            <button class="panel-close" id="close-customisation">&times;</button>
          </div>
          
          <div class="filter-section">
            <h4>Category</h4>
            <div class="filter-chips" id="category-filters">
              <label class="chip"><input type="checkbox" value="fb" checked><span class="chip-check">✓</span> F&B</label>
              <label class="chip"><input type="checkbox" value="fashion"><span class="chip-check">✓</span> Fashion</label>
              <label class="chip"><input type="checkbox" value="electronics"><span class="chip-check">✓</span> Electronics</label>
              <label class="chip"><input type="checkbox" value="wellness"><span class="chip-check">✓</span> Wellness</label>
              <label class="chip"><input type="checkbox" value="lifestyle"><span class="chip-check">✓</span> Lifestyle</label>
            </div>
          </div>
          
          <div class="filter-section">
            <h4>Property Size</h4>
            <div class="filter-chips" id="size-filters">
              <label class="chip"><input type="radio" name="size" value="<500"><span class="chip-check">✓</span> < 500 sqft</label>
              <label class="chip"><input type="radio" name="size" value="500-2000" checked><span class="chip-check">✓</span> 500-2000 sqft</label>
              <label class="chip"><input type="radio" name="size" value="2000-5000"><span class="chip-check">✓</span> 2000-5000 sqft</label>
              <label class="chip"><input type="radio" name="size" value="5000+"><span class="chip-check">✓</span> 5000+ sqft</label>
            </div>
          </div>
          
          <div class="filter-section">
            <h4>Ticket Size</h4>
            <div class="filter-chips" id="ticket-filters">
              <label class="chip"><input type="radio" name="ticket" value="<200"><span class="chip-check">✓</span> < ₹200</label>
              <label class="chip"><input type="radio" name="ticket" value="200-500"><span class="chip-check">✓</span> ₹200-500</label>
              <label class="chip"><input type="radio" name="ticket" value="500-1000" checked><span class="chip-check">✓</span> ₹500-1000</label>
              <label class="chip"><input type="radio" name="ticket" value="1000+"><span class="chip-check">✓</span> ₹1000+</label>
            </div>
          </div>
          
          <button class="btn-apply-filters" id="apply-filters">Find Matching Areas</button>
        </div>

        <!-- Matched Results Panel -->
        <div id="matched-results" class="matched-results-panel">
          <div class="results-header">
            <h3>🎯 <span id="match-count">0</span> Matched Areas</h3>
            <button class="btn-edit-filters" id="edit-filters">Edit Filters</button>
          </div>
          <div class="results-list" id="results-list">
            <!-- Dynamically populated -->
          </div>
          <div class="results-footer">
            <button class="btn-contact-advisory" id="btn-contact-advisory">Contact Advisory Team</button>
          </div>
        </div>

        <!-- Country Prompt (Fixed on top of landing content) -->
        <div id="landing-prompt">
          <button class="prompt-close">&times;</button>
          <h2 class="prompt-title">Select Experience</h2>
          <p class="prompt-subtitle">How would you like to explore <span id="prompt-country-name">the market</span>?</p>
          <div class="prompt-buttons">
            <button class="btn-primary-gold" id="btn-launch-satellite">Launch Satellite View</button>
            <button class="btn-secondary-glass" id="btn-customize-exp">Customize My Experience</button>
          </div>
        </div>

        <!-- SCROLLABLE CONTAINER -->
        <div id="main-scroll-container">
          
          <!-- Landing Section (100vh) - Split View Layout -->
          <div id="landing-hero-section" class="landing-split-view">
            
            <!-- LEFT PANEL: Hero Content -->
            <div class="landing-left-panel" id="landing-left-panel">
              <div class="landing-hero-content">
                <!-- Full Loader Animation (scaled down) -->
                <div class="hero-logo-animated" id="hero-logo-animated">
                  <div class="landing-loader-wrapper">
                      <img src="/logo.png" alt="Foottfall" class="hero-static-logo">
                  </div>
                </div>
                <h1 class="landing-headline">
                  Explore Trade Areas
                </h1>
                
                <div class="country-selector">
                  <button class="btn-country" data-country="India">India</button>
                  <button class="btn-country" data-country="UAE">UAE</button>
                </div>
                
                <!-- Features removed for minimalism -->
              </div>
            </div>
            
            <!-- Map Overlay Elements (Stats, Pause Indicator) -->
            <!-- MOVED outside of landing-map-panel to ensure visibility -->
            
            <!-- Tour Pause Indicator -->
            <div class="tour-pause-indicator" id="tour-pause-indicator">
              <span class="pause-text" id="tour-pause-text">Tour paused</span>
            </div>
            
            <!-- Always-visible Stats Card -->
            <div class="stats-card" id="stats-card">
              <div class="stats-header">
                <span class="stats-pin">📍</span>
                <div class="stats-location">
                  <h3 class="area-name" id="stats-area-name">Koregaon Park</h3>
                  <span class="area-city" id="stats-area-city">Pune, India</span>
                </div>
              </div>
              
              <div class="stats-body">
                <div class="stats-period">
                  <span class="label">Trade Area Insights</span>
                  <span class="dates" id="stats-dates">Dec 2024</span>
                </div>
                
                <div class="category-pills" id="stats-categories">
                  <span class="pill active">Retail</span>
                  <span class="pill">F&B</span>
                  <span class="pill">Fashion</span>
                </div>
                
                <div class="stats-footfall-chart" id="stats-footfall-chart">
                  <div class="footfall-header">
                    <span class="footfall-label">Est. Daily Footfall</span>
                    <span class="footfall-value" id="stats-footfall">25,000+</span>
                  </div>
                  <div class="footfall-bar-container">
                    <div class="footfall-bar" id="stats-footfall-bar" style="width: 70%;"></div>
                  </div>
                  <div class="footfall-scale">
                    <span>Low</span>
                    <span>High</span>
                  </div>
                </div>
              </div>
              
              <div class="stats-footer">
                <button class="btn-get-insights" id="btn-stats-explore">Find me my location</button>
              </div>
            </div>

            <!-- RIGHT PANEL: Hidden but kept for structure if needed -->
            <div class="landing-map-panel" id="landing-map-panel">
               <!-- Empty now -->
            </div>
            
            <!-- Scroll Indicator REMOVED -->
          </div>

          <!-- Below Fold Sections -->
          <div id="below-fold-sections">
            <!-- About Section -->
            <section id="about" class="section-dark about-section">
              <div class="container">
                <div class="about-content-wrapper animate-on-scroll">
                  <div class="about-image-column">
                    <div class="founder-image-wrapper">
                      <img src="/founder-portrait.png" alt="Rahul Ahuja" class="founder-image">
                    </div>
                  </div>
                  <div class="about-text-column">
                    <span class="founder-label">Founder & Managing Partner</span>
                    <h2 class="founder-heading" style="position: relative; display: inline-block;">
                      Strategic Vision.<br>Precision Execution.
                      <svg class="scribble-underline" viewBox="0 0 500 150" preserveAspectRatio="none">
                        <path d="M5,125 Q30,155 60,125 T120,125 T180,125 T250,125 T490,125" fill="none" stroke="#D4AF37" stroke-width="8" stroke-linecap="round" />
                      </svg>
            <!-- Services Section REMOVED as per request -->
                    <div class="founder-bio">
                      <p><strong style="color: #fff;">Rahul Ahuja</strong> believes that real estate is the physical language of economics. With over 15 years in high-volume acquisitions, he steers the firm's macro-strategy, identifying undervalued corridors before they hit the institutional radar.</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <!-- Services Section REMOVED as per request -->


            <!-- Clients Section -->
            <section id="clients" class="section-dark">
              <div class="container animate-on-scroll">
                <h2 class="section-title">Trusted By Global Brands</h2>
                <div class="marquee-container">
                  <div class="marquee-content">
                    <div class="testimonial-card glass-card spotlight-card">
                      <div class="quote-icon">"</div>
                      <p>"Foottfall helped us identify prime locations for our new outlets."</p>
                      <div class="client-info">
                        <div class="client-avatar" style="background-image: url('https://ui-avatars.com/api/?name=AB&background=random'); background-size: cover;"></div>
                        <div><h4>Absolute Barbeque</h4><span>Expansion Team</span></div>
                      </div>
                    </div>
                    <div class="testimonial-card glass-card spotlight-card">
                      <div class="quote-icon">"</div>
                      <p>"A strategic partner that understands the F&B landscape."</p>
                      <div class="client-info">
                        <div class="client-avatar" style="background-image: url('https://ui-avatars.com/api/?name=Nandos&background=random'); background-size: cover;"></div>
                        <div><h4>Nando's</h4><span>Regional Manager</span></div>
                      </div>
                    </div>
                    <div class="testimonial-card glass-card spotlight-card">
                      <div class="quote-icon">"</div>
                      <p>"Their trade area intelligence gave us confidence."</p>
                      <div class="client-info">
                        <div class="client-avatar" style="background-image: url('https://ui-avatars.com/api/?name=Tim+Hortons&background=random'); background-size: cover;"></div>
                        <div><h4>Tim Hortons</h4><span>Development Head</span></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="partners-container" style="margin-top: 60px; text-align: center;">
                  <h3 class="section-title" style="font-size: 1.5rem; opacity: 0.9; margin-bottom: 30px;">Our Network</h3>
                  <div class="logo-grid">
                    <div class="logo-item" data-text="ZARA">ZARA</div>
                    <div class="logo-item" data-text="H&M">H&M</div>
                    <div class="logo-item" data-text="Starbucks">Starbucks</div>
                    <div class="logo-item" data-text="Chipotle">Chipotle</div>
                  </div>
                </div>
              </div>
            </section>

            <!-- Contact Section -->
            <section id="contact" class="contact-page">
              <h2 class="section-title animate-on-scroll" style="margin-bottom: 40px;">Contact</h2>
              <div class="contact-card-container">
                <div class="contact-card">
                  <div class="card-face card-front">
                    <div class="shine-effect"></div>
                    <div class="contact-logo">
                      <div class="logo-text">FOOTTFALL</div>
                      <div class="fingerprint-icon">
                        <img src="/fingerprint.png" alt="Fingerprint" class="fingerprint-img">
                      </div>
                    </div>
                    <div class="quote">"Excellence in every square foot."</div>
                    <div class="card-footer"><span>Hover or Click to Flip</span></div>
                  </div>
                  <div class="card-face card-back">
                    <div class="contact-details">
                      <h3>Get in Touch</h3>
                      <div class="contact-item">info@foottfall.com</div>
                      <div class="contact-item">+1 (555) 123-4567</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="form-trigger-section">
                <p style="margin-bottom: 20px; color: #888;">Ready to transform your space?</p>
                <button id="openFormBtn" class="btn-fill-form">Get in touch</button>
              </div>
            </section>
          </div>
        </div>
      </div>
    `;
  },

  afterRender: async () => {
    // --- Initialization ---
    await DataManager.loadData();

    let map;
    let breadcrumbs = ['India']; // DEFAULT TO INDIA (Hidden Global)
    let userCriteria = {};
    let currentLevel = 'Global'; // Global, Country, City, TradeArea
    let markers = []; // Store active markers
    let hoveredCityId = null; // Track hovered city for animations
    let currentTradeArea = null; // Track selected trade area
    let viewMode = 'landing'; // 'landing' | 'dashboard'
    let mapTourController = null; // Will be initialized after map loads
    const mapContainer = document.getElementById('map-container'); // Ref for mode switching

    // --- Landing Page Logo Animation Controller ---
    const LandingLogoAnimator = {
      tl: null,
      isRunning: false,
      container: null,
      
      init() {
        this.container = document.querySelector('.landing-loader-wrapper');
        if (!this.container || !window.gsap) return;
        // DISABLED for static logo:
        // this.start();
      },
      
      start() {
        if (this.isRunning || !window.gsap) return;
        this.isRunning = true;
        this.runAnimation();
      },
      
      stop() {
        this.isRunning = false;
        if (this.tl) this.tl.kill();
      },
      
      runAnimation() {
        const gsap = window.gsap;
        const wrapper = this.container;
        if (!wrapper) return;
        
        // Reset function
        const resetUI = () => {
          gsap.set(wrapper.querySelectorAll('.final-letter'), { opacity: 0, clearProps: 'transform' });
          gsap.set(wrapper.querySelectorAll('.f-scanner-box, .map-block-container, .graph-group, .network-group, .pin-shape, .l1-custom-shape, .l2-forklift-mechanism'), { opacity: 0 });
          gsap.set(wrapper.querySelectorAll('.p1, .p2, .match-flash'), { opacity: 0, x: 0, scale: 1 });
          gsap.set(wrapper.querySelectorAll('.t1-static, .t2-static'), { opacity: 0, y: 0 });
        };
        
        const startTimeline = () => {
          if (!this.isRunning) return;
          
          this.tl = gsap.timeline({
            defaults: { duration: 0.8 },
            onComplete: () => {
              if (this.isRunning) {
                gsap.delayedCall(2, () => startTimeline());
              }
            }
          }).timeScale(1.0);
          
          // Reset at start
          this.tl.call(resetUI);
          
          // 1. F Scanner
          this.tl.to(wrapper.querySelector('.f-scanner-box'), { opacity: 1, duration: 0.1 })
            .fromTo(wrapper.querySelector('.scan-line'), { top: '0%' }, { top: '100%', duration: 0.5, ease: 'linear' })
            .to(wrapper.querySelector('.f-scanner-box'), { opacity: 0, duration: 0.2 })
            .to(wrapper.querySelector('.slot-f .final-letter'), { opacity: 1, duration: 0.2 }, '<');
          
          // 2. OO People
          this.tl.to(wrapper.querySelectorAll('.p1, .p2'), { opacity: 1, duration: 0.2 })
            .to(wrapper.querySelector('.p1'), { x: 15, duration: 0.3, ease: 'back.in(1.5)' })
            .to(wrapper.querySelector('.p2'), { x: -15, duration: 0.3, ease: 'back.in(1.5)' }, '<')
            .to(wrapper.querySelector('.match-flash'), { opacity: 1, scale: 1.2, duration: 0.1 })
            .to(wrapper.querySelectorAll('.p1, .p2'), { opacity: 0, scale: 0.5, duration: 0.1 }, '<')
            .to(wrapper.querySelector('.match-flash'), { scale: 2, opacity: 0, duration: 0.2 })
            .to(wrapper.querySelectorAll('.slot-o1 .final-letter, .slot-o2 .final-letter'), { opacity: 1, duration: 0.2, stagger: 0.05 }, '-=0.1');
          
          // 3. TT Map
          this.tl.to(wrapper.querySelector('.map-block-container'), { opacity: 1, scale: 1, duration: 0.3, ease: 'back.out(1.2)' })
            .set(wrapper.querySelectorAll('.t1-static, .t2-static'), { y: 100, opacity: 1 })
            .to(wrapper.querySelectorAll('.t1-static, .t2-static'), { y: 0, duration: 0.4, ease: 'power2.out' }, '+=0.2')
            .to(wrapper.querySelector('.map-block-container'), { y: -100, opacity: 0, duration: 0.4, ease: 'power2.out' }, '<');
          
          // 4. FA Bars & Network
          this.tl.to([wrapper.querySelector('.graph-group'), wrapper.querySelector('.network-group')], { opacity: 1, duration: 0.2 })
            .to(wrapper.querySelectorAll('.g-bar'), { height: (i) => [40, 50, 20, 35][i] + 'px', duration: 0.4, stagger: 0.05, ease: 'back.out(1.2)' })
            .from(wrapper.querySelectorAll('.n-node'), { scale: 0, duration: 0.3, stagger: 0.03, ease: 'back.out(1.5)' }, '<')
            .to([wrapper.querySelector('.graph-group'), wrapper.querySelector('.network-group')], { opacity: 0, duration: 0.2, delay: 0.1 })
            .to(wrapper.querySelectorAll('.slot-f2 .final-letter, .slot-a .final-letter'), { opacity: 1, duration: 0.2, stagger: 0.05 });
          
          // 5. LL Pin & Forklift
          // L1: Pin drops and transforms into L shape
          this.tl.set(wrapper.querySelector('.l1-custom-shape'), { opacity: 1 })
            .set(wrapper.querySelector('.l1-v-bar'), { opacity: 0 })
            .set(wrapper.querySelector('.l1-h-bar'), { width: 0 })
            .to(wrapper.querySelector('.pin-shape'), { opacity: 1, y: 0, startAt: { y: -60 }, duration: 0.3, ease: 'bounce.out' })
            .to(wrapper.querySelector('.pin-shadow'), { opacity: 1, scale: 1, duration: 0.2 }, '-=0.2')
            .to(wrapper.querySelector('.pin-shape'), { opacity: 0, duration: 0.2 }, '+=0.1')
            .to(wrapper.querySelector('.pin-shadow'), { opacity: 0, duration: 0.2 }, '<')
            .to(wrapper.querySelector('.l1-h-bar'), { width: '100%', duration: 0.2, ease: 'power2.out' })
            .set(wrapper.querySelector('.l1-v-bar'), { opacity: 1 })
            // L2: Forklift comes down, then forks retract leaving vertical stem
            .fromTo(wrapper.querySelector('.l2-forklift-mechanism'), 
              { y: -100, opacity: 0 }, 
              { y: 0, opacity: 1, duration: 0.25, ease: 'power2.out' }, '-=0.1')
            .to(wrapper.querySelector('.l2-forks'), { width: 0, duration: 0.3, ease: 'power2.in' }, '+=0.1')
            .to(wrapper.querySelector('.shop-block'), { opacity: 0, scale: 0.8, duration: 0.2 }, '<');
        };
        
        startTimeline();
      }
    };

    // --- Landing Page Tour & Stats Controllers ---
    
    // Stats Card Controller
    const StatsCardController = {
      currentAreaIndex: 0,
      rotationInterval: null,
      isTransitioning: false,
      
      elements: {
        card: null,
        areaName: null,
        areaCity: null,
        dates: null,
        footfall: null,
        categories: null
      },
      
      init() {
        this.elements.card = document.getElementById('stats-card');
        this.elements.areaName = document.getElementById('stats-area-name');
        this.elements.areaCity = document.getElementById('stats-area-city');
        this.elements.dates = document.getElementById('stats-dates');
        this.elements.footfall = document.getElementById('stats-footfall');
        this.elements.categories = document.getElementById('stats-categories');
      },
      
      getTradeAreasByRegion(region) {
        return geoData.tradeAreas.features.filter(f => {
          if (region === 'India') return f.properties.city === 'Pune' || f.properties.city === 'Mumbai';
          if (region === 'UAE') return f.properties.city === 'Dubai';
          return true;
        });
      },
      
      update(tradeArea) {
  if (!this.elements.card || this.isTransitioning) return;
  
  this.isTransitioning = true;
  this.elements.card.classList.add('transitioning');
  
  setTimeout(() => {
    const props = tradeArea.properties;
    const data = tradeData[props.id] || {};
    
    if (this.elements.areaName) this.elements.areaName.textContent = props.name;
    if (this.elements.areaCity) this.elements.areaCity.textContent = `${props.city}, ${props.city === 'Dubai' ? 'UAE' : 'India'}`;
    if (this.elements.dates) this.elements.dates.textContent = 'Dec 2024';
    
    // Update footfall based on trade area type
    if (this.elements.footfall) {
      const footfallData = {
        'Premium': { value: '35,000+', percent: 90 },
        'High Street': { value: '28,000+', percent: 75 },
        'IT Hub': { value: '22,000+', percent: 60 },
        'Residential': { value: '15,000+', percent: 40 },
        'Business': { value: '30,000+', percent: 80 },
        'Central': { value: '25,000+', percent: 65 },
        'Industrial': { value: '12,000+', percent: 30 },
        'Institutional': { value: '18,000+', percent: 45 }
      };
      const data = footfallData[props.type] || { value: '20,000+', percent: 50 };
      this.elements.footfall.textContent = data.value;
      
      // Update bar width
      const bar = document.getElementById('stats-footfall-bar');
      if (bar) bar.style.width = data.percent + '%';
    }
    
    // Update category pills
    if (this.elements.categories) {
      const types = ['Retail', 'F&B', 'Fashion'];
      const activeType = props.type === 'Premium' ? 'Retail' : props.type === 'High Street' ? 'F&B' : 'Fashion';
      this.elements.categories.innerHTML = types.map(t => 
        `<span class="pill ${t === activeType ? 'active' : ''}">${t}</span>`
      ).join('');
    }
    
    this.elements.card.classList.remove('transitioning');
    this.isTransitioning = false;
  }, 300);
},
      
      startRotation(region, intervalMs = 3000) {
        this.stopRotation();
        const areas = this.getTradeAreasByRegion(region);
        if (areas.length === 0) return;
        
        // Show first area immediately
        this.currentAreaIndex = Math.floor(Math.random() * areas.length);
        this.update(areas[this.currentAreaIndex]);
        
        // Rotate
        this.rotationInterval = setInterval(() => {
          this.currentAreaIndex = (this.currentAreaIndex + 1) % areas.length;
          this.update(areas[this.currentAreaIndex]);
        }, intervalMs);
      },
      
      stopRotation() {
        if (this.rotationInterval) {
          clearInterval(this.rotationInterval);
          this.rotationInterval = null;
        }
      }
    };
    
    // Map Tour Controller
    const MapTourController = {
      currentStopIndex: 0,
      isRunning: false,
      isPaused: false,
      tourTimeout: null,
      pauseIndicator: null,
      
      tourStops: [
        { 
          region: 'India',
          // User wants map shifted right so Mumbai/Pune are visible on left side
          // Moving center further WEST (lower longitude) shifts map right in view
          center: [73.1, 18.87], 
          zoom: 8.4, 
          duration: 2500,
          stayDuration: 6000
        },
        { 
          region: 'UAE',
          center: [55.27, 25.20],
          zoom: 8.9,
          pitch: 60,
          bearing: 15,
          duration: 2500,
          stayDuration: 8000
        }
      ],
      
      pauseTimeout: null, // For temporary pause
      
      init() {
        this.pauseIndicator = document.getElementById('tour-pause-indicator');
        const landingMapPanel = document.getElementById('landing-map-panel');
        const mapContainer = document.getElementById('map-container');
      },
      
      start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.isPaused = false;
        
        // Stats card visibility
        const card = document.getElementById('stats-card');
        if (card) {
             card.style.display = 'block'; 
             card.classList.remove('hidden');
             setTimeout(() => card.classList.add('visible'), 100);
        }

        // Tip Box visibility (Persistent now)
        const tipBox = document.getElementById('tip-box');
        if (tipBox) {
            tipBox.style.display = 'flex';
            // Wait slightly for transition
            setTimeout(() => {
                tipBox.classList.add('visible');
                // Ensure it's not expanded by default unless clicked
                tipBox.classList.remove('expanded'); 
            }, 100);
        }
        
        StatsCardController.init();
        this.flyToStop(0);
      },

      updateLandingUI(region) {
          // 1. Update Country/City Buttons
          const wrapper = document.querySelector('.country-selector');
          if (wrapper) {
            // Get cities for this region
            const cities = geoData.cities.features
                .filter(f => f.properties.country === region)
                .map(f => f.properties.name);
            
            // If no cities found (e.g. UAE might be just Dubai in data?), fallback or manual list
            let displayCities = cities;
            if (region === 'UAE' && (!cities || cities.length === 0)) displayCities = ['Dubai', 'Abu Dhabi']; // Fallback
            if (region === 'India' && (!cities || cities.length === 0)) displayCities = ['Mumbai', 'Pune', 'Bengaluru', 'Delhi'];
            
            // Remove duplicates and limit
            displayCities = [...new Set(displayCities)].slice(0, 4); 
            
            wrapper.innerHTML = displayCities.map(city => 
                `<button class="btn-country" data-city="${city}" data-country="${region}">${city}</button>`
            ).join('');

            // Add listeners
            wrapper.querySelectorAll('.btn-country').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const city = e.target.dataset.city;
                    
                    const cityFeature = geoData.cities.features.find(f => f.properties.name === city);
                    if (cityFeature && map) {
                         // MIMIC MAP CLICK LOGIC: Transition to Dashboard
                         
                         const landingSection = document.getElementById('landing-hero-section');
                         const mainScrollContainer = document.getElementById('main-scroll-container');
                         const landingPrompt = document.getElementById('landing-prompt');
                         
                         if (landingPrompt) landingPrompt.classList.remove('visible');
                         if (landingSection) landingSection.classList.add('hidden');
                         if (mainScrollContainer) mainScrollContainer.style.display = 'none';
                         
                         if (topBar) topBar.classList.add('visible');
                         if (legend) legend.classList.add('visible');
                         
                         // Stop tour
                         this.stop();
                         
                         // Load City View
                         loadCityView(cityFeature);
                    }
                });
            });
          }

          // 2. Update Tip Box Content - Simplified
          const tipTitle = document.querySelector('.tip-title');
          const tipDetails = document.querySelector('.tip-details');
          
          if (tipTitle) {
              // Minimal content for contracted state
              tipTitle.innerHTML = `<span style="opacity: 0.6; font-weight: 500;">Scouting:</span> ${region}`;
          }
          
          if (tipDetails) {
              // Details only visible when expanded
              tipDetails.innerHTML = `
                <ul>
                    <li>Tap map to pause tour</li>
                    <li>Analyzing footfall trends for ${region}</li>
                    <li>Select a city button to fly directly</li>
                </ul>
              `;
          }
      },
      
      flyToStop(index) {
        if (!this.isRunning || this.isPaused || viewMode !== 'landing') {
          this.stop();
          return;
        }
        
        const stop = this.tourStops[index];
        this.currentStopIndex = index;
        
        console.log(`Tour: Flying to ${stop.region}`);

        // Update UI for this region
        this.updateLandingUI(stop.region);
        
        const countryFeature = geoData.countries?.features?.find(f => 
            f.properties.name === stop.region || 
            f.properties.name.toLowerCase() === stop.region.toLowerCase()
        );
        
        if (countryFeature) {
            currentLevel = 'Country';
            updateBreadcrumbs(['Global', stop.region]);
            
            setLayerVisibility(['country-fill', 'india-fill'], 'none'); 
            setLayerVisibility(['cities-border', 'cities-border-casing', 'cities-glow', 'cities-label'], 'visible');
            setLayerVisibility(['cities-fill'], 'visible'); 
            setLayerVisibility(['trade-blobs', 'trade-points'], 'none');
            
            map.setFilter('cities-fill', ['==', 'country', stop.region]);
            map.setFilter('cities-border', ['==', 'country', stop.region]);
            map.setFilter('cities-border-casing', ['==', 'country', stop.region]);
            map.setFilter('cities-glow', ['==', 'country', stop.region]);
            map.setFilter('cities-label', ['==', 'country', stop.region]);
        }
        
        if (map) {
            map.flyTo({
                center: stop.center,
                zoom: stop.zoom,
                pitch: stop.pitch || 0,
                bearing: stop.bearing || 0,
                duration: stop.duration,
                essential: true
            });
        }
        
        setTimeout(() => {
          if (!this.isPaused && viewMode === 'landing') {
            StatsCardController.startRotation(stop.region, 3000);
          }
        }, stop.duration);
        
        this.tourTimeout = setTimeout(() => {
          if (!this.isPaused && this.isRunning && viewMode === 'landing') {
            StatsCardController.stopRotation();
            const nextIndex = (index + 1) % this.tourStops.length;
            this.flyToStop(nextIndex);
          }
        }, stop.stayDuration + stop.duration);
      },
      
      pause() {
        if (!this.isRunning || this.isPaused) return;
        this.isPaused = true;
        
        if (this.tourTimeout) {
          clearTimeout(this.tourTimeout);
          this.tourTimeout = null;
        }
        StatsCardController.stopRotation();
        
        // Show pause state in Tip Box
        const tipTitle = document.querySelector('.tip-title');
        if (tipTitle) {
            tipTitle.textContent = "Tour Paused. Select a city or tap map to resume.";
        }
        
        const pauseIndicator = document.getElementById('tour-pause-indicator');
        if (pauseIndicator) pauseIndicator.classList.add('visible'); // Keep this as visual feedback too
      },
      
      pauseTemporarily(durationMs = 4000) {
        if (!this.isRunning) return;
        if (this.pauseTimeout) clearTimeout(this.pauseTimeout);
        this.pause();
        this.pauseTimeout = setTimeout(() => {
          this.resume();
        }, durationMs);
      },
      
      resume() {
        if (!this.isRunning || !this.isPaused) return;
        this.isPaused = false;
        
        const pauseIndicator = document.getElementById('tour-pause-indicator');
        if (pauseIndicator) pauseIndicator.classList.remove('visible');
        
        this.flyToStop(this.currentStopIndex);
      },
      
      stop() {
        this.isRunning = false;
        this.isPaused = false;
        
        if (this.tourTimeout) {
          clearTimeout(this.tourTimeout);
          this.tourTimeout = null;
        }
        StatsCardController.stopRotation();
        
        if (this.pauseIndicator) {
          this.pauseIndicator.classList.remove('visible');
        }
      }
    };
    
    // Return to Landing Page
    // Return to Landing Page
    const returnToLanding = () => {
        console.log("Returning to Landing Page...");
        viewMode = 'landing';
        document.body.classList.add('landing-mode');
        if (mapContainer) mapContainer.classList.add('landing-mode');
        
        // 1. Reset Landing Section & Hero
        const landingSection = document.getElementById('landing-hero-section');
        const landingPanels = document.querySelectorAll('.landing-left-panel, .landing-right, .hero-logo-animated');
        
        if (landingSection) {
            landingSection.style.display = 'flex'; 
            landingSection.classList.remove('hidden'); 
            landingSection.classList.remove('prompt-mode'); 
        }
        
        // Force reset children
        landingPanels.forEach(panel => {
           panel.classList.remove('hidden-overlay');
           panel.style.opacity = '1';
           panel.style.pointerEvents = 'auto';
           panel.style.visibility = 'visible';
        });

        // 2. Reset Scroll Container
        const mainScrollContainer = document.getElementById('main-scroll-container');
        if (mainScrollContainer) {
            mainScrollContainer.style.display = 'block'; 
            mainScrollContainer.classList.add('landing-active');
        }
        
        // 3. Reset Landing Overlays
        const statsCard = document.getElementById('stats-card');
        const scrollIndicator = document.getElementById('scroll-indicator');
        
        if (statsCard) {
            statsCard.style.display = 'block';
            statsCard.classList.remove('hidden');
            setTimeout(() => statsCard.classList.add('visible'), 50);
        }
        if (scrollIndicator) scrollIndicator.style.display = 'flex';
        
        if (landingPrompt) landingPrompt.classList.remove('visible');

        // 4. Hide Dashboard Elements
        if (wizardOverlay) wizardOverlay.classList.add('hidden');
        if (topBar) topBar.classList.remove('visible');
        if (legend) legend.classList.remove('visible');
        if (tipBox) {
             // Reset tip box but keep visible if tour is restarting
             // But actually, updateLandingUI will handle content.
             // Just ensure it's not hidden by display:none
             // tipBox.classList.remove('visible'); // Let start() handle this
        }
        
        // 5. Restart Tour
        if (MapTourController) MapTourController.start();
        if (LandingLogoAnimator) {
             // Force stop/reset before start
             LandingLogoAnimator.stop();
             setTimeout(() => LandingLogoAnimator.start(), 100);
        }
        loadGlobalView(); // Reset map camera
    };
    
    // Transition from landing to dashboard mode
    const transitionToDashboard = (selectedCountry = null) => {
      viewMode = 'dashboard';
      MapTourController.stop();
      LandingLogoAnimator.stop(); // Stop logo animation
      
      // Remove landing-mode from map (make it fixed)
      document.body.classList.remove('landing-mode');
      if (mapContainer) mapContainer.classList.remove('landing-mode');
      
      // Remove landing-active to allow below-fold sections to be visible
      const mainScrollContainer = document.getElementById('main-scroll-container');
      if (mainScrollContainer) mainScrollContainer.classList.remove('landing-active');
      
      // Hide landing elements
      const landingSection = document.getElementById('landing-hero-section');
      const statsCard = document.getElementById('stats-card');
      const scrollIndicator = document.getElementById('scroll-indicator');
      
      if (landingSection) landingSection.style.display = 'none';
      if (statsCard) statsCard.style.display = 'none';
      if (scrollIndicator) scrollIndicator.style.display = 'none';
      
      // Show wizard
      if (wizardOverlay) {
        wizardOverlay.classList.remove('hidden');
        
        // If country was selected, pre-select it and go to slide 2
        if (selectedCountry && countrySelect) {
          countrySelect.value = selectedCountry;
          countrySelect.dispatchEvent(new Event('change'));
          
          // Go to slide 2
          document.getElementById('slide-1')?.classList.remove('active');
          document.getElementById('slide-2')?.classList.add('active');
        }
      }
    };
    
    // Scroll indicator click handler
    const scrollIndicator = document.getElementById('scroll-indicator');
    if (scrollIndicator) {
      scrollIndicator.addEventListener('click', () => {
        const belowFold = document.getElementById('below-fold-sections');
        if (belowFold) {
          belowFold.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }
    
    // Stats card button handler - "Find me my location"
    const btnStatsExplore = document.getElementById('btn-stats-explore');
    if (btnStatsExplore) {
      btnStatsExplore.addEventListener('click', () => {
        // Always open customisation panel when clicking "Find me my location"
        const customPanel = document.getElementById('customisation-panel');
        if (customPanel) {
          customPanel.classList.add('visible');
        }
      });
    }

    // --- DOM Elements ---
    const wizardOverlay = document.getElementById('wizard-overlay');
    const topBar = document.getElementById('top-bar');
    const btnBack = document.getElementById('btn-back');
    const sidebar = document.getElementById('sidebar');
    const sidebarTitle = document.getElementById('sidebar-title');
    const sidebarContent = document.getElementById('sidebar-content');
    const closeSidebarBtn = document.getElementById('close-sidebar');
    const legend = document.getElementById('legend');
    const legendContent = document.getElementById('legend-content');
    
    // Form Elements
    const inputName = document.getElementById('input-name');
    const inputBrand = document.getElementById('input-brand');
    const countrySelect = document.getElementById('country-select');
    const citySelect = document.getElementById('city-select');
    const btnNext2 = document.getElementById('btn-next-2');

    // TEST: Loader Invocation
    const btnReplayIntro = document.createElement('button');
    btnReplayIntro.innerText = "↻ Replay Intro";
    btnReplayIntro.className = "wizard-back"; // reuse style
    btnReplayIntro.style.marginLeft = "auto"; 
    btnReplayIntro.style.fontSize = "0.8rem";
    btnReplayIntro.style.border = "1px solid rgba(255,255,255,0.2)";
    btnReplayIntro.style.padding = "5px 10px";
    btnReplayIntro.style.borderRadius = "4px";
    
    // Add to Slide 1 for easy access
    const slide1Ref = document.getElementById('slide-1');
    if(slide1Ref) {
        slide1Ref.appendChild(btnReplayIntro);
        btnReplayIntro.style.position = "absolute";
        btnReplayIntro.style.top = "1rem";
        btnReplayIntro.style.right = "1rem";
        
        btnReplayIntro.addEventListener('click', () => {
             if(window.appLoader) {
                 window.appLoader.show();
                 // Hide again after few seconds
                 setTimeout(() => window.appLoader.hide(), 4000);
             }
        });
    }

    // Tip Box Elements
    const tipBox = document.getElementById('tip-box');
    const tipTitle = tipBox?.querySelector('.tip-title');
    const tipDetails = tipBox?.querySelector('.tip-details');

    // --- Tip Box: Click to expand/collapse ---
    if (tipBox) {
      console.log("Tip box element found, attaching click handler");
      tipBox.addEventListener('click', (e) => {
        console.log("Tip box clicked!", e.target);
        tipBox.classList.toggle('expanded');
      });
    } else {
      console.error("Tip box element NOT found!");
    }

    // --- Tip Box: Update content based on view level ---
    const updateTipBox = (level, contextData = {}) => {
      if (!tipBox) return;

      // Dynamic query to handle replaced content
      let currentTitle = tipBox.querySelector('.tip-title');
      let currentDetails = tipBox.querySelector('.tip-details');

      // If structure is missing (e.g. replaced by custom legend msg), rebuild it
      if (!currentTitle || !currentDetails) {
          console.log("Tip Box structure missing, rebuilding...");
          tipBox.innerHTML = `
            <div class="tip-header">
              <div class="tip-title"></div>
              <div class="tip-toggle">▼</div>
            </div>
            <div class="tip-details"></div>
         `;
         currentTitle = tipBox.querySelector('.tip-title');
         currentDetails = tipBox.querySelector('.tip-details');
      }
      
      tipBox.classList.add('visible');
      tipBox.classList.remove('expanded'); // Collapse when changing views
      
      const tipContent = {
        Global: {
          title: '💡 Hover over a country...',
          details: `<ul>
            <li>India and UAE markets available</li>
            <li>Click to zoom into cities</li>
            <li>Use legend for quick navigation</li>
          </ul>`
        },
        Country: {
          title: `💡 Click a city to explore...`,
          details: `<ul>
            <li>Each city has trade areas</li>
            <li>Hover for city highlights</li>
            <li>Colored borders indicate zones</li>
          </ul>`
        },
        City: {
          title: `💡 Click pins for details...`,
          details: `<ul>
            <li>Pins show key trade areas</li>
            <li>Legend lists all locations</li>
            <li>Drag map to explore, scroll/tap to zoom</li>
            <li>Right click and drag to adjust z axis</li>
          </ul>`
        },
        TradeArea: {
          title: `💡 Viewing trade area...`,
          details: `<ul>
            <li>Full metrics in sidebar</li>
            <li>Charts show comparisons</li>
            <li>Click back to see other areas</li>
          </ul>`
        }
      };
      
      const content = tipContent[level] || tipContent.Global;
      if (currentTitle) currentTitle.textContent = content.title;
      if (currentDetails) currentDetails.innerHTML = content.details;
    };

    // --- Helper: Calculate Bounds ---
    const getBounds = (features) => {
      const bounds = new maplibregl.LngLatBounds();
      console.log("Calculating bounds for", features.length, "features");
      
      features.forEach(f => {
        if (!f.geometry) {
            console.warn("Feature missing geometry:", f.properties?.name);
            return;
        }
        
        const type = f.geometry.type;
        const coords = f.geometry.coordinates;

        try {
            if (type === 'Point') {
              bounds.extend(coords);
            } else if (type === 'Polygon') {
              // Outer ring is coords[0]
              coords[0].forEach(coord => bounds.extend(coord));
            } else if (type === 'MultiPolygon') {
                // Array of Polygons
                coords.forEach(polygon => {
                    // Each polygon has rings, [0] is outer
                    polygon[0].forEach(coord => bounds.extend(coord));
                });
            }
        } catch (e) {
            console.error("Error defining bounds for feature:", f.properties?.name, e);
        }
      });
      console.log("Calculated bounds:", bounds.toArray());
      return bounds;
    };

    // --- Map Initialization ---
    const initMap = () => {
     // Initialize Map with Landing Mode
    if (mapContainer) mapContainer.classList.add('landing-mode');
    
    // Test if map container exists
    if (!mapContainer) console.error("Map Container NOT found!");

    // CLEANUP: Destroy existing map if it exists (prevents WebGL context loss)
    if (window._footfallMap) {
        console.log("Destroying previous map instance to prevent WebGL context loss");
        try {
            window._footfallMap.remove();
        } catch (e) {
            console.log("Previous map already invalid");
        }
        window._footfallMap = null;
    }

    // Create new map instance
    map = new maplibregl.Map({
        container: 'map-container',
        style: 'https://tiles.openfreemap.org/styles/liberty', // Free vector style
        center: [78, 20],
        zoom: 2.2, // Start slightly farther out for zoom effect
        pitch: 0,
        bearing: 0,
        bearing: 0,
        bearing: 0,
        antialias: true, // Needed for 3D buildings
        attributionControl: {
            compact: true
        }
      });
    
    // Store globally so we can clean it up on next navigation
    window._footfallMap = map;

      // Temporary pause on map interaction - 4 seconds then resume
      const pauseTourTemporarily = () => {
         if (MapTourController && MapTourController.isRunning) {
            MapTourController.pauseTemporarily(4000);
         }
      };
      
      // Hide hero panel AND stop tour permanently on intentional selection
      const hideHeroPanelAndStop = () => {
         const panel = document.getElementById('landing-left-panel');
         if (panel) panel.classList.add('hidden-overlay');
         
         // Hide stats card too
         const statsCard = document.getElementById('stats-card');
         if (statsCard) {
            statsCard.classList.remove('visible');
            statsCard.classList.add('hidden');
         }
         
         // Stop the tour permanently
         if (MapTourController) {
            MapTourController.stop(); 
         }
         LandingLogoAnimator.stop(); // Stop logo animation
      };

      // Temporary pause on drag/touch (not permanent stop)
      map.on('mousedown', pauseTourTemporarily);
      map.on('touchstart', pauseTourTemporarily);
      
      // Permanent stop on zoom actions (intentional interaction)
      // UPDATED: Now merely pauses temporarily to allow interaction without losing landing context
      map.on('wheel', pauseTourTemporarily);
      map.on('dblclick', pauseTourTemporarily);

      // Initialize Popup for tooltips
      const popup = new maplibregl.Popup({
        closeButton: false,
        closeOnClick: false,
        offset: 15
      });

      map.on('load', () => {
        // PRELOAD OPTIMIZATION: Wait for map to be idle (tiles loaded) before showing
        // But set a max timeout so we don't wait forever
        
        // FORCE COMPACT ATTRIBUTION TO START COLLAPSED
        // MapLibre often expands it by default on desktop. We want just the icon.
        const attribDetails = document.querySelector('.maplibregl-ctrl-attrib.maplibregl-compact');
        if (attribDetails) {
            attribDetails.removeAttribute('open');
            attribDetails.classList.remove('maplibregl-compact-show');
        }

        let loaded = false;
        const revealPage = () => {
            if (loaded) return;
            loaded = true;
            console.log("Map tiles loaded - revealing page");
            
            // Check if intro has played this session
            const hasPlayed = sessionStorage.getItem('introPlayed');
            
            if (hasPlayed) {
                // FAST TRACK: Skip logo animation
                console.log("Skipping intro animation (already played)");
                const landingContent = document.querySelector('.landing-hero-content');
                if (landingContent) landingContent.style.opacity = '1';
                
                // Start Tour immediately (BEFORE loader hides)
                MapTourController.init();
                MapTourController.start();
                
                // START SMALL LOGO ANIMATION (Keep it running)
                LandingLogoAnimator.init();
            } else {
                // FULL INTRO
                // Trigger animation BEFORE loader hides so it's moving when revealed
                triggerLandingAnimation();
                LandingLogoAnimator.init(); 
                sessionStorage.setItem('introPlayed', 'true');
            }

            // --- CRITICAL: Hide the loader NOW ---
            // At this point: Data is loaded, Map tiles rendered, GeoJSON sources added & drawn.
            // The map.idle event guarantees all layers are stable and visible.
            if (window.appLoader) {
                // Small buffer to ensure rendering frame catches up
                // setTimeout(() => window.appLoader.hide(), 100); 
                window.appLoader.hide(); 
            }
        };

        map.once('idle', revealPage);
        
        // Fallback max wait 2.5s
        setTimeout(revealPage, 2500);

        
        // Hide loading screen handled in triggerLandingAnimation now for sequencing

        // Add source for detailed India boundary from OSM
        map.addSource('indiaOSM', {
          type: 'geojson',
          data: '/india-osm.geojson'
        });
        
        map.addSource('countryPolygons', {
          type: 'geojson',
          data: geoData.countryPolygons
        });

        map.addSource('countries', {
          type: 'geojson',
          data: geoData.countries
        });

        map.addSource('cities', {
          type: 'geojson',
          data: geoData.cities,
          promoteId: 'name'
        });

        map.addSource('tradeAreas', {
          type: 'geojson',
          data: geoData.tradeAreas
        });

        // --- Layers ---

        // 0. Global View: Country Gradient Fills (UAE only - India uses OSM)
        map.addLayer({
          id: 'country-fill',
          type: 'fill',
          source: 'countryPolygons',
          filter: ['==', ['get', 'name'], 'UAE'], // Only show UAE, India uses indiaOSM source
          paint: {
            'fill-color': ['get', 'color'],
            'fill-opacity': [
              'interpolate',
              ['linear'],
              ['zoom'],
              1, 0.15,
              5, 0.25,
              8, 0.05
            ],
            // Add subtle outline directly in fill
            'fill-outline-color': ['get', 'color']
          },
          layout: {
            'visibility': 'visible'
          }
        });

        // India detailed outline from OSM data
        map.addLayer({
          id: 'india-fill',
          type: 'fill',
          source: 'indiaOSM',
          paint: {
            'fill-color': '#00732F',
            'fill-opacity': [
              'interpolate',
              ['linear'],
              ['zoom'],
              1, 0.15,
              5, 0.25,
              8, 0.05
            ],
            'fill-outline-color': '#00732F'
          },
          layout: {
            'visibility': 'visible'
          }
        });

        // Cities Fill (Clickable Layer)
        map.addLayer({
          id: 'cities-fill',
          type: 'fill',
          source: 'cities',
          paint: {
            'fill-color': ['get', 'color'],
            'fill-opacity': [
              'case',
              ['boolean', ['feature-state', 'hover'], false],
              0.5,
              0.2
            ], // Light background normally, slightly more opaque on hover
            'fill-outline-color': '#ffffff'
          },
          layout: {
            'visibility': 'none'
          }
        });

        // NEW: Glow for fancier borders
        map.addLayer({
          id: 'cities-glow',
          type: 'line',
          source: 'cities',
          paint: {
            'line-color': ['get', 'color'],
            'line-width': 8,
            'line-blur': 4,
            'line-opacity': 0.5
          },
          layout: {
            'visibility': 'none'
          }
        });

        // Border Casing (White outline for contrast)
        map.addLayer({
          id: 'cities-border-casing',
          type: 'line',
          source: 'cities',
          paint: {
            'line-color': '#ffffff',
            'line-width': 4,
            'line-opacity': 0.8
          },
          layout: {
            'visibility': 'none'
          }
        });

        // Main Border (Solid & Strong)
        map.addLayer({
          id: 'cities-border',
          type: 'line',
          source: 'cities',
          paint: {
            'line-color': ['get', 'color'], // Match city color
            'line-width': 2,
            'line-opacity': 1
          },
          layout: {
            'visibility': 'none'
          }
        });

        // City Labels
        map.addLayer({
          id: 'cities-label',
          type: 'symbol',
          source: 'cities',
          layout: {
            'text-field': ['get', 'name'],
            'text-font': ['Noto Sans Regular'],
            'text-size': 14,
            'visibility': 'none'
          },
          paint: {
            'text-color': '#000',
            'text-halo-color': '#fff',
            'text-halo-width': 2
          }
        });

        // 3. City View: Colored Heatmap Blobs & Trade Areas
        
        // "Heatmap" Blobs (Diffuse Glow)
        map.addLayer({
          id: 'trade-blobs',
          type: 'circle',
          source: 'tradeAreas',
          minzoom: 10,
          paint: {
            // Large radius for diffuse look
            'circle-radius': [
              'interpolate', ['linear'], ['zoom'],
              10, 50,
              14, 200,
              16, 400
            ],
            'circle-color': ['get', 'color'],
            'circle-blur': 1.0, // Max blur for "glow" effect
            'circle-opacity': 0.5
          },
          layout: {
            'visibility': 'none'
          }
        });

        // Trade Area Points (Interactive)
        map.addLayer({
          id: 'trade-points',
          type: 'circle',
          source: 'tradeAreas',
          minzoom: 10,
          paint: {
            'circle-radius': 6,
            'circle-color': ['get', 'color'],
            'circle-stroke-color': '#fff',
            'circle-stroke-width': 2,
            'circle-opacity': 1
          },
          layout: {
            'visibility': 'none'
          }
        });

        // 3D Buildings
        if (!map.getLayer('building-3d')) {
             try {
                map.addLayer({
                    'id': '3d-buildings',
                    'source': 'openfreemap',
                    'source-layer': 'building',
                    'filter': ['==', 'extrude', 'true'],
                    'type': 'fill-extrusion',
                    'minzoom': 10, // Show buildings at city level
                    'paint': {
                        'fill-extrusion-color': '#e40d0dff',
                        'fill-extrusion-height': [
                            'interpolate', ['linear'], ['zoom'],
                            10, 0,
                            10.5, ['coalesce', ['get', 'height'], 10] // Default to 10m if height missing
                        ],
                        'fill-extrusion-base': [
                            'interpolate', ['linear'], ['zoom'],
                            10, 0,
                            10.5, ['coalesce', ['get', 'min_height'], 0] // Default to 0m if min_height missing
                        ],
                        'fill-extrusion-opacity': 0.6
                    }
                });
             } catch (e) {
                 console.log("Could not add 3D buildings layer automatically", e);
             }
        }

        // --- Interactions ---

        // Hover on Country - Update Legend with Cities
        map.on('mouseenter', 'country-fill', (e) => {
          map.getCanvas().style.cursor = 'pointer';
          const feature = e.features[0];
          const countryName = feature.properties.name;
          
          // Add scale animation to country
          map.setPaintProperty('country-fill', 'fill-opacity', 0.35);
          
          // Get cities in this country
          const citiesInCountry = geoData.cities.features
            .filter(c => c.properties.country === countryName);
          
          // Update legend with cities
          legendContent.innerHTML = `
            <div class="legend-item" style="margin-bottom: 10px; font-weight: bold; color: #222;">
              ${countryName} - Cities
            </div>
            ${citiesInCountry.map(city => `
              <div class="legend-item" style="padding-left: 10px;">
                <div class="legend-dot" style="background: ${city.properties.color};"></div>
                <span>${city.properties.name}</span>
              </div>
            `).join('')}
          `;
        });

        map.on('mouseleave', 'country-fill', () => {
          map.getCanvas().style.cursor = '';
          // Reset fill opacity to default interpolation
          map.setPaintProperty('country-fill', 'fill-opacity', [
            'interpolate',
            ['linear'],
            ['zoom'],
            1, 0.15,
            5, 0.25,
            8, 0.05
          ]);
          // Restore original legend
          updateLegend(currentLevel);
        });

        // --- Interactions for India (OSM Layer) ---
        map.on('mouseenter', 'india-fill', (e) => {
          map.getCanvas().style.cursor = 'pointer';
          
          // Add scale animation effect
          map.setPaintProperty('india-fill', 'fill-opacity', 0.35);
          
          // Get cities in India
          const citiesInCountry = geoData.cities.features
            .filter(c => c.properties.country === 'India');
          
          // Update legend
          legendContent.innerHTML = `
            <div class="legend-item" style="margin-bottom: 10px; font-weight: bold; color: #222;">
              India - Cities
            </div>
            ${citiesInCountry.map(city => `
              <div class="legend-item" style="padding-left: 10px;">
                <div class="legend-dot" style="background: ${city.properties.color};"></div>
                <span>${city.properties.name}</span>
              </div>
            `).join('')}
          `;
        });

        map.on('mouseleave', 'india-fill', () => {
          map.getCanvas().style.cursor = '';
          // Reset fill opacity to default interpolation
          map.setPaintProperty('india-fill', 'fill-opacity', [
              'interpolate',
              ['linear'],
              ['zoom'],
              1, 0.15,
              5, 0.25,
              8, 0.05
            ]);
          // Restore original legend
          updateLegend(currentLevel);
        });

        map.on('click', 'india-fill', () => {
           // Quick scale pop animation
           map.setPaintProperty('india-fill', 'fill-opacity', 0.5);
           setTimeout(() => {
             map.setPaintProperty('india-fill', 'fill-opacity', 0.25);
           }, 150);

           // Navigate to India
           const countryFeature = geoData.countries.features.find(c => c.properties.name === 'India');
           if (countryFeature) loadCountryView(countryFeature);
        });
        
        // Click on Country - Add pop animation and navigate
        map.on('click', 'country-fill', (e) => {
          const feature = e.features[0];
          // Quick scale pop animation
          map.setPaintProperty('country-fill', 'fill-opacity', 0.5);
          setTimeout(() => {
            map.setPaintProperty('country-fill', 'fill-opacity', 0.25);
          }, 150);
          
          // Navigate to country
          const countryFeature = geoData.countries.features.find(
            c => c.properties.name === feature.properties.name
          );
          if (countryFeature) loadCountryView(countryFeature);
        });
        
        // Country -> City
        map.on('click', 'cities-fill', (e) => {
          const feature = e.features[0];
          
          // If in landing mode, transition to intelligence view
          const landingSection = document.getElementById('landing-hero-section');
          if (landingSection && !landingSection.classList.contains('hidden')) {
             // TRANSITION PROPERLY to Dashboard Mode
             // Use transitionToDashboard(null) to ensure all UI elements (topBar, legend) are revealed
             // passing null so we don't open wizard, just go to explore mode which effectively is what loadCityView does visually
             
             // Manually do whatbtnLaunchSatellite does but keep context
              if (landingPrompt) landingPrompt.classList.remove('visible');
              landingSection.classList.add('hidden');
              if (mainScrollContainer) mainScrollContainer.style.display = 'none';
              
              if (topBar) topBar.classList.add('visible');
              if (legend) legend.classList.add('visible');
              
              // Stop tour
              if (MapTourController) MapTourController.stop();
          }
          
          loadCityView(feature);
        });

        // Hover effect for cities
        // hoveredCityId is now defined in afterRender scope

        map.on('mousemove', 'cities-fill', (e) => {
          map.getCanvas().style.cursor = 'pointer';
          if (e.features.length > 0) {
            if (hoveredCityId) {
              map.setFeatureState(
                { source: 'cities', id: hoveredCityId },
                { hover: false }
              );
            }
            hoveredCityId = e.features[0].properties.name;
            map.setFeatureState(
              { source: 'cities', id: hoveredCityId },
              { hover: true }
            );
          }
        });

        map.on('mouseleave', 'cities-fill', () => {
          map.getCanvas().style.cursor = '';
          if (hoveredCityId) {
             map.setFeatureState(
                { source: 'cities', id: hoveredCityId },
                { hover: false }
              );
          }
          hoveredCityId = null;
        });
        
        // Also allow clicking on the border
        map.on('click', 'cities-border', (e) => {
            const feature = e.features[0];
            loadCityView(feature);
        });

        // City -> Trade Area (backup for trade-points layer if visible)
        map.on('click', 'trade-points', (e) => {
          const feature = e.features[0];
          loadTradeAreaView(feature);
        });

        // Cursor pointers
        ['cities-fill', 'cities-border', 'trade-points'].forEach(layer => {
          map.on('mouseenter', layer, () => map.getCanvas().style.cursor = 'pointer');
          map.on('mouseleave', layer, () => map.getCanvas().style.cursor = '');
        });

        // Initial View with URL State Handling
        const urlParams = new URLSearchParams(window.location.search);
        const startCountry = urlParams.get('country');
        const startMode = urlParams.get('mode');

        if (startCountry) {
          const countryFeature = geoData.countries.features.find(c => c.properties.name === startCountry);
          if (countryFeature) {
             loadCountryView(countryFeature);
          } else {
             // FALLBACK: Default to India if clicked not found (instead of Global)
             const india = geoData.countries.features.find(c => c.properties.name === 'India');
             if (india) loadCountryView(india);
             else loadGlobalView(); 
          }

          if (wizardOverlay) {
             if (startMode === 'wizard') {
                // Ensure wizard is visible (it is key by default, but just in case)
                wizardOverlay.classList.remove('hidden');
                
                // Pre-select country in wizard to save user a step
                const countrySelect = document.getElementById('country-select');
                if (countrySelect) {
                   countrySelect.value = startCountry;
                   // Trigger change event to populate cities
                   countrySelect.dispatchEvent(new Event('change'));
                   
                   // Optional: Move to next slide if we wanted, but let's let them enter identity first (Slide 1)
                }
             } else {
                // Launch Satellite View -> Hide Wizard
                wizardOverlay.classList.add('hidden');
             }
          }
        } else {
          // DEFAULT BEHAVIOR: Load India instead of Global
           const india = geoData.countries.features.find(c => c.properties.name === 'India');
           if (india) loadCountryView(india);
           else loadGlobalView();
        }
      });
    };

    initMap();

    // --- Loading Screen and Landing Overlay Logic ---

    const landingOverlay = document.getElementById('landing-hero-section'); // Updated ID
    const landingContent = document.querySelector('.landing-content'); // Inner content
    const belowFoldSections = document.getElementById('below-fold-sections'); 
    const mainScrollContainer = document.getElementById('main-scroll-container');
    
    const landingPrompt = document.getElementById('landing-prompt');
    const promptClose = document.querySelector('.prompt-close');
    const btnLaunchSatellite = document.getElementById('btn-launch-satellite');
    const btnCustomizeExp = document.getElementById('btn-customize-exp');
    const countryButtons = document.querySelectorAll('.btn-country');
    let selectedCountryName = null;
    
    // Initial State: Landing Content Hidden for fade-in effect
    if (landingContent) landingContent.style.opacity = '0';
    
    // Ensure tip box is hidden initially (landing page is active)
    if (tipBox) tipBox.classList.remove('visible');
    
    // Add landing-active class to hide below-fold sections
    if (mainScrollContainer) mainScrollContainer.classList.add('landing-active');

    // Failsafe Timeout
    setTimeout(() => {
      triggerLandingAnimation();
    }, 4500);

    // Country button click - Zoom to country and show Prompt
    console.log("Setting up button listeners. Found", countryButtons.length, "buttons");
    countryButtons.forEach((btn, index) => {
      console.log(`Button ${index}: ${btn.dataset.country}`);
      btn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent event bubbling
        selectedCountryName = btn.dataset.country;
        console.log("Country Button Clicked:", selectedCountryName);
        
        // 1. STOP THE TOUR
        MapTourController.stop();

        // 2. Hide Landing Text (logo, etc.) but keep the glass panel visible for now
        // actually we want to transition the whole view to "Prompt Mode"
         const landingHeroSection = document.getElementById('landing-hero-section');
         if (landingHeroSection) {
             landingHeroSection.classList.add('prompt-mode');
         }

        // 3. Load Country View immediately (updates map state)
        // 3. Load Country View immediately (updates map state)
        console.log("Looking for country feature...");
        const countryFeature = geoData.countries.features.find(c => c.properties.name === selectedCountryName);
        
        if (countryFeature) {
          console.log("Loading Country View...");
          loadCountryView(countryFeature);
        }

        // 4. Show Prompt Overlay
        // Update prompt text 
        const promptCountrySpan = document.getElementById('prompt-country-name');
        if (promptCountrySpan) promptCountrySpan.innerText = selectedCountryName;
        
        if (landingPrompt) {
            landingPrompt.classList.add('visible');
        }
      });
    });

    // Close prompt - Go back to "Landing Mode"
    // Close prompt - Go back to "Landing Mode"
    if (promptClose) {
      promptClose.addEventListener('click', () => {
        console.log("Closing prompt, reverting to landing mode");
        returnToLanding();
      });
    }

    // Launch Satellite View - Go to Dashboard in Explore Mode
    if (btnLaunchSatellite) {
      btnLaunchSatellite.addEventListener('click', () => {
        // Transition to full dashboard
        transitionToDashboard(null); // No wizard pre-select, just go
        
        // Manually handle the specific state for "Just Exploring"
        // Hide wizard if transition showed it
        if (wizardOverlay) wizardOverlay.classList.add('hidden');
        
        // Show UI bars
        if (topBar) topBar.classList.add('visible');
        if (legend) legend.classList.add('visible');
        if (tipBox) {
           tipBox.classList.add('visible');
           const countryCities = geoData.cities.features.filter(f => f.properties.country === selectedCountryName);
           updateTipBox('Country', { countryName: selectedCountryName, cityCount: countryCities.length });
        }
      });
    }

    // Customize Experience - Go to Dashboard Wizard
    if (btnCustomizeExp) {
      btnCustomizeExp.addEventListener('click', () => {
         // Transition to dashboard AND show wizard at correct step
         transitionToDashboard(selectedCountryName);
      });
    }

    // Close prompt - Go back to "Landing Mode"
    // Close prompt - Go back to "Landing Mode" (Duplicate listener removal/consolidation)
    // The previous listener handles it, but let's just make sure we don't have duplicates or conflicting logic
    // Removing the second separate block if it exists


    // Launch Satellite View - hide overlay, hide wizard, interact with map
    if (btnLaunchSatellite) {
      btnLaunchSatellite.addEventListener('click', () => {
        // Hide prompt
        if (landingPrompt) landingPrompt.classList.remove('visible');
        
        // Hide Main Scroll Container (Landing + Below Fold) to reveal Map Dashboard
        if (landingOverlay) landingOverlay.classList.add('hidden');
        if (mainScrollContainer) mainScrollContainer.style.display = 'none'; // Completely remove from flow
        
        // Hide wizard, show UI elements
        if (wizardOverlay) wizardOverlay.classList.add('hidden');
        if (topBar) topBar.classList.add('visible');
        if (legend) legend.classList.add('visible');
        
        // Force tipbox update/show
        const level = currentLevel; 
        // We trigger a tipbox update to ensure it shows
        if (level === 'Country') {
           const countryFeature = geoData.countries.features.find(c => c.properties.name === selectedCountryName);
           const countryCities = geoData.cities.features.filter(f => f.properties.country === selectedCountryName);
           updateTipBox('Country', { countryName: selectedCountryName, cityCount: countryCities.length });
        }
      });
    }

    // Customize Experience - hide overlay, show wizard
    if (btnCustomizeExp) {
      btnCustomizeExp.addEventListener('click', () => {
        // Hide prompt
        if (landingPrompt) landingPrompt.classList.remove('visible');
        
        // Hide Main Scroll Container
        if (landingOverlay) landingOverlay.classList.add('hidden');
        if (mainScrollContainer) mainScrollContainer.style.display = 'none';

        // Show wizard
        if (wizardOverlay) wizardOverlay.classList.remove('hidden');
        
        // Pre-select country in wizard
        const countrySelect = document.getElementById('country-select');
        if (selectedCountryName && countrySelect) {
          countrySelect.value = selectedCountryName;
          countrySelect.dispatchEvent(new Event('change'));
        }
      });
    }

    // --- Marker Management ---
    const clearMarkers = () => {
      markers.forEach(marker => marker.remove());
      markers = [];
    };

    const createMarker = (feature, type) => {
      const el = document.createElement('div');
      el.className = 'custom-marker';
      
      const pin = document.createElement('div');
      pin.className = 'pin-pulse';
      pin.style.color = feature.properties.color || '#d4af37';
      
      const label = document.createElement('div');
      label.className = 'pin-label';
      label.innerText = feature.properties.name;
      
      el.appendChild(pin);
      el.appendChild(label);

      el.style.zIndex = '1000'; // Ensure markers are on top

      el.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent map click
        if (type === 'country') {
          loadCountryView(feature);
        } else if (type === 'city') {
          loadCityView(feature);
        }
      });

      // For polygons (cities), find centroid
      let lngLat;
      if (feature.geometry.type === 'Point') {
        lngLat = feature.geometry.coordinates;
      } else {
        const bounds = new maplibregl.LngLatBounds();
        feature.geometry.coordinates[0].forEach(coord => bounds.extend(coord));
        lngLat = bounds.getCenter();
      }

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat(lngLat)
        .addTo(map);
      
      markers.push(marker);
    };

    // --- Location Pin Creation (for Trade Areas) ---
    const createLocationPin = (feature, index = 0) => {
      // Wrapper for MapLibre positioning
      const container = document.createElement('div');
      container.className = 'pin-wrapper';
      container.style.cursor = 'pointer';

      // Actual animated pin
      const el = document.createElement('div');
      el.className = 'location-pin animate-in';
      el.style.animationDelay = `${index * 0.05}s`;
      
      const color = feature.properties.color || '#d4af37';
      
      // Professional Teardrop SVG Pin
      el.innerHTML = `
        <svg viewBox="0 0 30 42" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0 4px 6px rgba(0,0,0,0.3));">
          <path d="M15 0C6.716 0 0 6.716 0 15C0 26.25 15 42 15 42S30 26.25 30 15C30 6.716 23.284 0 15 0Z" fill="${color}" stroke="white" stroke-width="2"/>
          <circle cx="15" cy="15" r="5" fill="white"/>
        </svg>
      `;
      
      const label = document.createElement('div');
      label.className = 'pin-label';
      label.innerText = feature.properties.name;
      el.appendChild(label);
      
      container.appendChild(el);

      container.addEventListener('click', (e) => {
        e.stopPropagation();
        loadTradeAreaView(feature);
      });
      
      const marker = new maplibregl.Marker({ element: container, anchor: 'bottom' })
        .setLngLat(feature.geometry.coordinates)
        .addTo(map);
      
      markers.push(marker);
    };

    // --- Legend Logic ---
    const updateLegend = (level) => {
      // VISIBILITY GUARD: Only show if landing overlay is HIDDEN or in PROMPT MODE
      const landingRef = document.getElementById('landing-hero-section');
      if (landingRef && !landingRef.classList.contains('hidden') && !landingRef.classList.contains('prompt-mode')) {
         // Do not show legend if landing page is active and NOT in prompt mode
         legend.classList.remove('visible');
      } else {
         legend.classList.add('visible');
      }
      legendContent.innerHTML = '';
      
      // Wrapper for scrolling content (applies padding & max-height)
      const wrapper = document.createElement('div');
      wrapper.className = 'legend-scroll-wrapper';
      legendContent.appendChild(wrapper);

      if (level === 'Global') {
        const items = [
          { name: 'India', color: '#00732F' },
          { name: 'UAE', color: '#E40D0D' }
        ];
        
        items.forEach(item => {
          const div = document.createElement('div');
          div.className = 'legend-item';
          div.style.cursor = 'pointer';
          div.innerHTML = `<div class="legend-dot" style="background: ${item.color};"></div>${item.name}`;
          div.onclick = () => {
            const country = geoData.countries.features.find(f => f.properties.name === item.name);
            if (country) loadCountryView(country);
          };
          wrapper.appendChild(div);
        });

      } else if (level === 'Country') {
        const countryName = breadcrumbs[1];
        const cities = geoData.cities.features.filter(f => f.properties.country === countryName);
        
        cities.forEach(city => {
          const div = document.createElement('div');
          div.className = 'legend-item';
          div.style.cursor = 'pointer';
          div.innerHTML = `<div class="legend-dot" style="background: ${city.properties.color};"></div>${city.properties.name}`;
          div.onclick = () => loadCityView(city);
          wrapper.appendChild(div);
        });

      } else if (level === 'City') {
        const cityName = breadcrumbs && breadcrumbs.length >= 3 ? breadcrumbs[2] : 'Pune';
        const cityTradeAreas = geoData.tradeAreas.features.filter(f => f.properties.city === cityName);
        
        // TAT Category definitions with colors and explanations
        const TAT_CATEGORIES = {
          'CBD': { 
            label: 'TAT-1 (CBD)', 
            color: '#E53935', 
            description: 'Central Business District - The core commercial hub with highest footfall, premium brands, and established retail presence.'
          },
          'PBD': { 
            label: 'TAT-2 (PBD)', 
            color: '#FF9800', 
            description: 'Peripheral Business District - A secondary commercial hub surrounding the CBD, offering strong growth potential at relatively lower costs.'
          },
          'TBD': { 
            label: 'TAT-3 (TBD)', 
            color: '#2196F3', 
            description: 'To Be Developed - An emerging business zone serving local catchments today, with strong potential to become a future commercial hotspot.'
          },
          'Nightlife': { 
            label: 'Nightlife', 
            color: '#9C27B0', 
            description: 'High-Energy Clusters - Areas with vibrant nightlife, bars, pubs, and late-night dining options attracting young professionals and tourists.'
          },
          'Mall': { 
            label: 'Mall Catchment', 
            color: '#424242', 
            description: 'Mall Glorifiers - Retail zones anchored by large malls with high weekend footfall and family-oriented shopping experiences.'
          }
        };
        
        // Map areas to standardized categories
        const categorizeArea = (area) => {
          const subCat = area.properties.subCategory || '';
          const corridor = (area.properties.corridor || '').toLowerCase();
          
          if (subCat === 'nightlife' || corridor.includes('nightlife') || corridor.includes('high-energy')) return 'Nightlife';
          if (subCat === 'mall' || corridor.includes('mall')) return 'Mall';
          
          const type = area.properties.type || '';
          if (type.includes('TAT-1')) return 'CBD';
          if (type.includes('TAT-3') || type.includes('Growth')) return 'TBD';
          return 'PBD'; // Default to TAT-2
        };
        
        // Group areas by standardized category
        const grouped = {};
        cityTradeAreas.forEach(area => {
          const category = categorizeArea(area);
          if (!grouped[category]) grouped[category] = [];
          grouped[category].push(area);
        });

        // Generate HTML with standardized categories (in order)
        const categoryOrder = ['CBD', 'PBD', 'TBD', 'Nightlife', 'Mall'];
        wrapper.innerHTML = categoryOrder.filter(cat => grouped[cat]?.length).map(category => {
          const cat = TAT_CATEGORIES[category];
          // Style: Text is black (#222), Dot keeps the color
          return `
          <div style="margin-bottom: 15px;">
            <div class="legend-category-header" data-category="${category}" style="color: #222; font-size: 0.75rem; border-bottom: 1px solid rgba(0,0,0,0.06); padding-bottom: 4px; margin-bottom: 8px; letter-spacing: 1px; font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 8px;">
              <div class="legend-dot" style="background: ${cat.color}; width: 10px; height: 10px; box-shadow: 0 0 0 1px rgba(0,0,0,0.2);"></div>
              ${cat.label}
              <span style="font-size: 0.75rem; color: #888; margin-left: auto; opacity: 0.7;">ℹ️</span>
            </div>
            ${grouped[category].map(area => `
              <div class="legend-item" data-area-id="${area.properties.id}">
                <div class="legend-dot" style="background: ${cat.color}; box-shadow: 0 0 6px ${cat.color}80;"></div>
                <span style="font-weight: 500;">${area.properties.name}</span>
              </div>
            `).join('')}
          </div>
        `}).join('');

        // Provide scroll indicator arrow
        const arrow = document.createElement('div');
        arrow.className = 'legend-scroll-indicator';
        arrow.innerHTML = '▼'; 
        arrow.title = "Scroll for more";
        legendContent.appendChild(arrow);

        // Attach event listeners to area items
        const items = wrapper.querySelectorAll('.legend-item');
        items.forEach(item => {
          item.addEventListener('click', () => {
             const areaId = item.getAttribute('data-area-id');
             const feature = geoData.tradeAreas.features.find(f => f.properties.id === areaId);
             if (feature) loadTradeAreaView(feature); 
          });
        });
        
        // Attach click handlers to category headers for tip box interaction
        const categoryHeaders = wrapper.querySelectorAll('.legend-category-header');
        let tipTimeout = null;

        // Function to revert tip box to default state
        const revertTipBox = () => {
          console.log("Reverting Tip Box to level:", currentLevel);
          updateTipBox(currentLevel);
        };

        categoryHeaders.forEach(header => {
          header.addEventListener('click', (e) => {
            e.stopPropagation(); // Stop click from triggering map listeners
            
            // Clear any existing revert timer logic
            if (tipTimeout) clearTimeout(tipTimeout);
            
            const category = header.getAttribute('data-category');
            const cat = TAT_CATEGORIES[category];
            
            // Show tip box with category explanation
            const tipBox = document.getElementById('tip-box');
            if (tipBox) {
              tipBox.innerHTML = `
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                  <div style="width: 12px; height: 12px; background: ${cat.color}; border-radius: 50%;"></div>
                  <strong style="color: #222;">${cat.label}</strong>
                </div>
                <p style="margin: 0; font-size: 0.85rem; color: #444; line-height: 1.5;">${cat.description}</p>
              `;
              tipBox.classList.add('visible', 'expanded');
              
              // 1. Revert after 5 seconds
              tipTimeout = setTimeout(() => {
                revertTipBox();
              }, 5000);
              
              // 2. Revert on click elsewhere
              const clickElsewhere = (evt) => {
                 // Check if the click was ON a header (if so, stop propagation handles it, but just in case)
                 if (evt.target.closest('.legend-category-header')) return;
                 
                 revertTipBox();
                 document.removeEventListener('click', clickElsewhere);
                 if (tipTimeout) clearTimeout(tipTimeout);
              };
              
              // Small timeout to avoid immediate trigger from the current click event
              setTimeout(() => {
                 document.addEventListener('click', clickElsewhere);
              }, 100);
            }
          });
        });

      } else if (level === 'TradeArea') {
        // Show trade area details in legend
        if (currentTradeArea) {
          const areaData = tradeData[currentTradeArea.properties.id];
          if (areaData) {
            // Determine standardized category
            const TAT_CATEGORIES = {
              'CBD': { label: 'TAT-1 (CBD)', color: '#E53935' },
              'PBD': { label: 'TAT-2 (PBD)', color: '#FF9800' },
              'TBD': { label: 'TAT-3 (TBD)', color: '#2196F3' },
              'Nightlife': { label: 'Nightlife', color: '#9C27B0' },
              'Mall': { label: 'Mall Catchment', color: '#424242' }
            };
            
            const subCat = currentTradeArea.properties.subCategory || '';
            const corridor = (currentTradeArea.properties.corridor || '').toLowerCase();
            const type = currentTradeArea.properties.type || '';
            
            let category = 'PBD';
            if (subCat === 'nightlife' || corridor.includes('nightlife') || corridor.includes('high-energy')) category = 'Nightlife';
            else if (subCat === 'mall' || corridor.includes('mall')) category = 'Mall';
            else if (type.includes('TAT-1')) category = 'CBD';
            else if (type.includes('TAT-3') || type.includes('Growth')) category = 'TBD';
            
            const cat = TAT_CATEGORIES[category];
            
            // Area type header with correct color
            const typeDiv = document.createElement('div');
            typeDiv.className = 'legend-item';
            typeDiv.style.fontWeight = 'bold';
            typeDiv.style.color = cat.color;
            typeDiv.innerHTML = `<div class="legend-dot" style="background: ${cat.color};"></div>${cat.label}`;
            wrapper.appendChild(typeDiv);
            
            // Stats section
            const statsDiv = document.createElement('div');
            statsDiv.style.padding = '8px 0';
            statsDiv.style.borderTop = '1px solid rgba(0,0,0,0.1)';
            statsDiv.style.marginTop = '8px';
            statsDiv.innerHTML = `
              <div style="font-size: 0.8rem; color: #666; margin-bottom: 4px;">📊 Footfall: <strong>${areaData.stats.footfall}</strong></div>
              <div style="font-size: 0.8rem; color: #666;">👥 ${areaData.demographics.segment}</div>
            `;
            wrapper.appendChild(statsDiv);
            
            // Brands
            if (areaData.brands && areaData.brands.length > 0) {
              const brandsDiv = document.createElement('div');
              brandsDiv.style.padding = '8px 0';
              brandsDiv.style.borderTop = '1px solid rgba(0,0,0,0.1)';
              brandsDiv.innerHTML = `<div style="font-size: 0.75rem; color: #888; margin-bottom: 6px;">Nearby Brands</div>`;
              areaData.brands.slice(0, 4).forEach(brand => {
                const brandSpan = document.createElement('span');
                brandSpan.style.cssText = 'display: inline-block; background: rgba(255,255,255,0.5); padding: 3px 8px; border-radius: 12px; font-size: 0.75rem; margin: 2px; color: #222; font-weight: 500; border: 1px solid rgba(0,0,0,0.05);';
                brandSpan.innerText = brand;
                brandsDiv.appendChild(brandSpan);
              });
              wrapper.appendChild(brandsDiv);
            }
          }
        }
      }
    };

    // --- Logic: Check Incoming Data ---
    // Only auto-populate brand if it was set in this session (not persisted across sessions)
    const storedBrand = sessionStorage.getItem('footfall_brand');
    if (storedBrand) {
      inputBrand.value = storedBrand;
    }

    // --- Logic: Country-City Filtering ---
    countrySelect.addEventListener('change', (e) => {
      const country = e.target.value;
      citySelect.innerHTML = '<option value="" disabled selected>Select City</option>';
      citySelect.disabled = false;

      const cities = geoData.cities.features.filter(f => f.properties.country === country);
      cities.forEach(city => {
        const option = document.createElement('option');
        option.value = city.properties.name;
        option.innerText = city.properties.name;
        citySelect.appendChild(option);
      });
    });

    citySelect.addEventListener('change', () => {
      btnNext2.disabled = false;
    });

    // --- Navigation Logic ---
    const updateBreadcrumbs = (path) => {
      breadcrumbs = path;
      // Clear items but keep back button


      // VISIBILITY GUARD
      const landingRef = document.getElementById('landing-hero-section');
      if (!landingRef || landingRef.classList.contains('hidden') || landingRef.classList.contains('prompt-mode')) {
          topBar.classList.add('visible');
      }
      
      // Show/Hide Back Button
      // ALWAYS Show if we are deeper than Global OR if we are ON Global but want to go back to landing
      // Actually simpler: Always show it. If length is 1, it goes to landing.
      btnBack.style.display = 'block';

      // HIDDEN GLOBAL VIEW LOGIC:
      // If the first breadcrumb is 'Global', remove it from UI
      const visualPath = path.filter(p => p !== 'Global');
      
      // Clear items but keep back button
      const items = topBar.querySelectorAll('.breadcrumb-item, .breadcrumb-separator');
      items.forEach(el => el.remove());
      
      visualPath.forEach((item, index) => {
        const el = document.createElement('div');
        el.className = 'breadcrumb-item';
        el.innerText = item;
        
        // Logic for clicking prev breadcrumbs
        // We need to map visual index back to actual path index
        // If 'Global' is hidden, visual index 0 is actually path index 1 (Country)
        // If 'Global' is NOT hidden, visual index 0 is path index 0
        
        const isGlobalHidden = path[0] === 'Global';
        const actualIndex = isGlobalHidden ? index + 1 : index;

        if (index < visualPath.length - 1) {
          el.onclick = () => navigateTo(actualIndex);
          const sep = document.createElement('span');
          sep.className = 'breadcrumb-separator';
          sep.innerText = '>';
          topBar.appendChild(el);
          topBar.appendChild(sep);
        } else {
          topBar.appendChild(el);
        }
      });
    };

    const navigateTo = (levelIndex) => {
      const target = breadcrumbs[levelIndex];
      
      if (target === 'Global') {
        loadGlobalView();
      } else if (levelIndex === 1) { // Country Level
        const country = geoData.countries.features.find(f => f.properties.name === target);
        if (country) loadCountryView(country);
      } else if (levelIndex === 2) { // City Level
        const city = geoData.cities.features.find(f => f.properties.name === target);
        if (city) loadCityView(city);
      } else if (levelIndex === 3) { // Trade Area Level
        const tradeArea = geoData.tradeAreas.features.find(f => f.properties.name === target);
        if (tradeArea) loadTradeAreaView(tradeArea);
      }
    };

    // Back Button Logic
    // Back Button Logic
    btnBack.onclick = () => {
      if (breadcrumbs.length > 1) {
        // HIDDEN GLOBAL CHECK:
        // If we are at [Global, Country] (length 2), going back would take us to Global.
        // We want to skip Global and go to Landing.
        if (breadcrumbs.length === 2 && breadcrumbs[0] === 'Global') {
           returnToLanding();
        } else {
           navigateTo(breadcrumbs.length - 2);
        }
      } else {
        // At root level (Global or Country if started there), return to Landing Page
        returnToLanding();
      }
    };

    // --- View Loaders ---

    const setLayerVisibility = (layerIds, visibility) => {
      layerIds.forEach(id => {
        if (map.getLayer(id)) {
          map.setLayoutProperty(id, 'visibility', visibility);
        }
      });
    };

    const loadGlobalView = () => {
      currentLevel = 'Global';
      sidebar.classList.remove('visible');
      updateBreadcrumbs(['Global']);
      updateLegend('Global');
      clearMarkers();
      
      // Clear any stuck hover state
      if (hoveredCityId) {
        map.setFeatureState(
          { source: 'cities', id: hoveredCityId },
          { hover: false }
        );
        hoveredCityId = null;
      }
      map.getCanvas().style.cursor = ''; // Reset cursor

      // Visibility
      setLayerVisibility(['country-fill', 'india-fill'], 'visible');
      setLayerVisibility(['cities-fill', 'cities-border', 'cities-border-casing', 'cities-glow', 'cities-label', 'trade-blobs', 'trade-points'], 'none');
      
      // Visibility GUARD: Strict hide for Landing vs Prompt
      const landingRef = document.getElementById('landing-hero-section');
      const watermark = document.getElementById('watermark-home'); // Ref watermark

      // If landing is visible AND NOT in prompt mode -> Hide Legend/Tip/Watermark
      if (landingRef && !landingRef.classList.contains('hidden') && !landingRef.classList.contains('prompt-mode')) {
           if (legend) legend.classList.remove('visible');
           // if (tipBox) tipBox.classList.remove('visible'); // Keep tip box visible in landing mode
           if (watermark) watermark.classList.add('hidden'); // Hide watermark on landing
      } else {
           updateTipBox('Global');
           if (watermark) watermark.classList.remove('hidden'); // Show on map
      }

      // Camera: Fit to all countries - zoomed to keep India and UAE in focus
      // If we are in landing/init, we might want manual control
      if (!landingRef || landingRef.classList.contains('hidden')) {
          const bounds = getBounds(geoData.countryPolygons.features);
          map.fitBounds(bounds, {
            padding: 50,
            pitch: 0,
            bearing: 0,
            essential: true
          });
      }

      // HIDE TRIGGER (Strictly)
      const trigger = document.getElementById('hidden-global-trigger');
      if (trigger) {
          trigger.style.opacity = '0';
          trigger.style.pointerEvents = 'none';
          trigger.classList.remove('active-context');
      }
    };

    // --- HIDDEN GLOBAL TRIGGER ---
    const addHiddenTrigger = () => {
        const container = document.querySelector('.maplibregl-ctrl-bottom-left') || document.body;
        const trigger = document.createElement('div');
        trigger.className = 'hidden-global-trigger';
        trigger.innerHTML = '🌍';
        trigger.title = 'Global View';
        trigger.style.cssText = `
            position: fixed; /* Fixed to ensure it sticks */
            bottom: 10px;
            left: 10px;
            width: 30px;
            height: 30px;
            background: rgba(0,0,0,0.2);
            color: rgba(255,255,255,0.5);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            z-index: 9999;
            font-size: 16px;
            opacity: 0; 
            pointer-events: none; /* Initially disabled */
            transition: opacity 0.3s;
        `;
        trigger.id = 'hidden-global-trigger'; // Add ID for referencing
        
        trigger.onmouseover = () => trigger.style.opacity = '1';
        trigger.onmouseout = () => {
             // Only hide if we are in Country view (it stays 0 otherwise via logic)
             // Actually, just let CSS hover handle it, but we need base state
             if (trigger.classList.contains('active-context')) {
                 trigger.style.opacity = '0.3'; // Dim but visible in active context
             } else {
                 trigger.style.opacity = '0';
             }
        };
        trigger.onmouseenter = () => trigger.style.opacity = '1';
        trigger.onmouseleave = () => {
             if (trigger.classList.contains('active-context')) {
                 trigger.style.opacity = '0.3'; 
             } else {
                trigger.style.opacity = '0';
             }
        };
        trigger.onclick = () => {
            console.log("Secret Global View Triggered");
            loadGlobalView();
        };
        
        document.body.appendChild(trigger);
    };

    // Call it
    addHiddenTrigger();

    const loadCountryView = (countryFeature) => {
      currentLevel = 'Country';
      sidebar.classList.remove('visible');
      
      updateBreadcrumbs(['Global', countryFeature.properties.name]);
      updateLegend('Country');
      clearMarkers();

      // Clear any stuck hover state
      if (hoveredCityId) {
        map.setFeatureState(
          { source: 'cities', id: hoveredCityId },
          { hover: false }
        );
        hoveredCityId = null;
      }
      map.getCanvas().style.cursor = ''; // Reset cursor

      // Get cities for this country
      const countryCities = geoData.cities.features.filter(f => f.properties.country === countryFeature.properties.name);
      console.log("loadCountryView: Found", countryCities.length, "cities for", countryFeature.properties.name);
      
      // Debug: Log first city's geometry
      if (countryCities.length > 0) {
          console.log("First city geometry:", countryCities[0].geometry);
      }

      // Visibility
      setLayerVisibility(['country-fill', 'india-fill'], 'none'); // Hide country layers
      setLayerVisibility(['cities-fill', 'cities-border', 'cities-border-casing', 'cities-glow', 'cities-label'], 'visible');
      setLayerVisibility(['trade-blobs', 'trade-points'], 'none');
      
      // Update tip box for country view
      // VISIBILITY GUARD
      const landingRef = document.getElementById('landing-hero-section');
      if (!landingRef || landingRef.classList.contains('hidden') || landingRef.classList.contains('prompt-mode')) {
          updateTipBox('Country', { countryName: countryFeature.properties.name, cityCount: countryCities.length });
      }

      // Filter cities by country
      map.setFilter('cities-fill', ['==', 'country', countryFeature.properties.name]);
      map.setFilter('cities-border', ['==', 'country', countryFeature.properties.name]);
      map.setFilter('cities-border-casing', ['==', 'country', countryFeature.properties.name]);
      map.setFilter('cities-glow', ['==', 'country', countryFeature.properties.name]);
      map.setFilter('cities-label', ['==', 'country', countryFeature.properties.name]);

      // Camera: Fit to all cities in the country
      if (countryCities.length > 0) {
          console.log("Fitting bounds to cities...");
          const bounds = getBounds(countryCities);
          map.fitBounds(bounds, {
            padding: 50, // Reduced padding for deeper zoom
            pitch: 0,
            bearing: 0,
            essential: true
          });
      } else {
          console.warn("No cities found for country, skipping zoom");
      }


      // SHOW TRIGGER (Country View Only)
      // VISIBILITY GUARD: Do not show on landing page
      // Reuse existing landingRef from top of function
      const isLandingVisible = landingRef && !landingRef.classList.contains('hidden') && !landingRef.classList.contains('prompt-mode');

      const trigger = document.getElementById('hidden-global-trigger');
      if (trigger) {
          if (isLandingVisible) {
             trigger.style.opacity = '0';
             trigger.style.pointerEvents = 'none';
             trigger.classList.remove('active-context');
          } else {
             trigger.style.opacity = '0.3'; // Visible but dim
             trigger.style.pointerEvents = 'auto'; // Clickable
             trigger.classList.add('active-context');
          }
      }
    };
    
    // Helper to trigger opening animation safely
    const triggerLandingAnimation = () => {
        const landingContent = document.querySelector('.landing-hero-content');
        
        // SEQUENCE:
        // 1. Initialize MapTourController
        MapTourController.init();
        
        // 2. Start the regional tour IMMEDIATELY (no delay)
        // This ensures map is moving as loader fades out
         if (viewMode === 'landing') {
           MapTourController.start();
         }
         
         // Fade In Landing Content slightly after
         setTimeout(() => {
             if (landingContent) landingContent.style.opacity = '1';
         }, 800);
    };

    const loadCityView = (cityFeature) => {
      currentLevel = 'City';
      currentTradeArea = null;
      sidebar.classList.remove('visible');
      
      updateBreadcrumbs(['Global', cityFeature.properties.country, cityFeature.properties.name]);
      updateLegend('City');
      clearMarkers();

      // HIDE TRIGGER
      const trigger = document.getElementById('hidden-global-trigger');
      if (trigger) {
          trigger.style.opacity = '0';
          trigger.style.pointerEvents = 'none';
          trigger.classList.remove('active-context');
      }

      // Visibility
      setLayerVisibility(['country-fill', 'india-fill'], 'none'); // Hide country layers
      setLayerVisibility(['cities-border', 'cities-border-casing', 'cities-glow', 'cities-label'], 'visible'); 
      setLayerVisibility(['cities-fill'], 'none'); // Hide fill color when inside city 
      setLayerVisibility(['trade-blobs'], 'visible'); // Keep heatmap effect
      setLayerVisibility(['trade-points'], 'none'); // Hide circle points, use pins instead

      // Filter trade blobs by city
      map.setFilter('trade-blobs', ['==', 'city', cityFeature.properties.name]);

      // Camera - 3D View (Zoom INSIDE the city)
      // Calculate centroid based on TRADE AREAS (if any), otherwise City Polygon
      const cityTradeAreas = geoData.tradeAreas.features.filter(f => f.properties.city === cityFeature.properties.name);
      
      let center;
      
      if (cityTradeAreas.length > 0) {
         // Focus on the cluster of trade areas
         const tradeBounds = getBounds(cityTradeAreas);
         center = tradeBounds.getCenter();
         // If points are very spread out, we might want to adjust zoom, but 11.6 fixed is what user requested
      } else {
         // Fallback to city geometry
         const bounds = getBounds([cityFeature]);
         center = bounds.getCenter();
      }

      map.flyTo({
        center: center,
        zoom: 11.6,
        pitch: 45, // Reduced pitch for better pin visibility
        bearing: 0,
        essential: true
      });

      // Create location pins immediately - MapLibre markers track position automatically
      // Reuse existing cityTradeAreas variable
      cityTradeAreas.forEach((area, index) => createLocationPin(area, index));

      // Update tip box for city view
      // VISIBILITY GUARD
      const landingRef = document.getElementById('landing-hero-section');
      if (!landingRef || landingRef.classList.contains('hidden') || landingRef.classList.contains('prompt-mode')) {
           updateTipBox('City', { cityName: cityFeature.properties.name, tradeAreaCount: cityTradeAreas.length });
           
           // SHOW STATS CARD
           const card = document.querySelector('.stats-card');
           if (card) card.classList.add('visible');
      }
    };

    const loadTradeAreaView = (tradeFeature) => {
      currentLevel = 'TradeArea';
      currentTradeArea = tradeFeature;
      
      // HIDE TRIGGER
      const trigger = document.getElementById('hidden-global-trigger');
      if (trigger) {
          trigger.style.opacity = '0';
          trigger.style.pointerEvents = 'none';
          trigger.classList.remove('active-context');
      }
      
      const cityName = tradeFeature.properties.city;
      const cityFeature = geoData.cities.features.find(c => c.properties.name === cityName);
      const countryName = cityFeature?.properties.country || 'India';
      
      updateBreadcrumbs(['Global', countryName, cityName, tradeFeature.properties.name]);
      updateLegend('TradeArea');
      clearMarkers();
      
      // Create single pin for the selected trade area
      createLocationPin(tradeFeature, 0);
      
      // Visibility - show 3D buildings
      setLayerVisibility(['country-fill', 'india-fill'], 'none');
      setLayerVisibility(['cities-border', 'cities-border-casing', 'cities-glow', 'cities-label'], 'visible');
      setLayerVisibility(['cities-fill'], 'none');
      setLayerVisibility(['trade-blobs', 'trade-points'], 'none');
      
      // Fly to trade area with deep zoom
      map.flyTo({
        center: tradeFeature.geometry.coordinates,
        zoom: 16, // Deeper zoom for trade area
        pitch: 60,
        bearing: -30,
        essential: true
      });
      
      // Open sidebar with trade details
      const data = tradeData[tradeFeature.properties.id];
      if (data) openSidebar(data);

      // Update tip box for trade area view
      // VISIBILITY GUARD
      const landingRef = document.getElementById('landing-hero-section');
      if (!landingRef || landingRef.classList.contains('hidden') || landingRef.classList.contains('prompt-mode')) {
          updateTipBox('TradeArea', { areaName: tradeFeature.properties.name });
      }
    };

    const enterLocationLevel = (feature, data) => {
      map.flyTo({
        center: feature.geometry.coordinates,
        zoom: 16,
        pitch: 100,
        bearing: -30,
        essential: true
      });
      openSidebar(data);
    };

    // --- Sidebar Logic ---
    let chartInstance = null;

    const parseRangeValue = (str) => {
        if (!str) return 0;
        // Handle currency symbols and commas (AED, ₹, etc)
        const clean = str.replace(/[^\d\.\-\–]/g, '');
        
        if (clean.includes('-') || clean.includes('–')) {
            const parts = clean.split(/[-\–]/).map(p => parseFloat(p));
            if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
                return (parts[0] + parts[1]) / 2;
            }
        }
        return parseFloat(clean) || 0;
    };

    const openSidebar = (data) => {
      sidebarTitle.innerText = data.name;
      
      // Extract data with fallbacks
      const rentText = data.stats?.rent || 'N/A';
      const spendText = data.stats?.spend || 'N/A';
      const footfallText = data.stats?.footfall || 'N/A';
      
      // Demographics data
      const demo = data.demographics || {};
      const population = demo.population || '—';
      const ageGroup = demo.age || 'Mixed';
      const genderRatio = demo.gender || '50:50';
      const segment = demo.segment || 'Mid';
      
      // Commercial data
      const commercial = data.commercial || {};
      const anchors = commercial.anchors || [];
      const units = commercial.units || '—';
      const rentBand = commercial.rentBand || '—';
      
      // Brandscape data
      const brands = data.brands || [];
      
      // Calculate available units (10% of total for demo)
      const availableUnits = units !== '—' ? Math.floor(parseInt(units) * 0.1) : '—';
      
      // Build DCB Tabbed Interface with Quick Stats
      sidebarContent.innerHTML = `
        <!-- Quick Stats - Available Units Highlighted -->
        <div class="sidebar-quick-stats">
          <div class="quick-stat-card">
            <span class="quick-stat-value">${availableUnits}</span>
            <span class="quick-stat-label">Available Units</span>
          </div>
          <div class="quick-stat-card highlight">
            <span class="quick-stat-value">${rentText}</span>
            <span class="quick-stat-label">Avg. Rent</span>
          </div>
        </div>
        
        <div class="dcb-tabs">
          <button class="dcb-tab active" data-tab="demographics">Demographics</button>
          <button class="dcb-tab" data-tab="commercial">Commercial</button>
          <button class="dcb-tab" data-tab="brandscape">Brandscape</button>
        </div>
        
        <div class="dcb-content">
          <!-- Demographics Panel -->
          <div class="dcb-panel active" id="panel-demographics">
            <div class="dcb-section">
              <div class="dcb-section-title">Population & Density</div>
              <div class="demo-stat-grid">
                <div class="demo-stat">
                  <div class="demo-stat-value">${population}</div>
                  <div class="demo-stat-label">Population</div>
                </div>
                <div class="demo-stat">
                  <div class="demo-stat-value">${genderRatio}</div>
                  <div class="demo-stat-label">Gender Ratio</div>
                </div>
              </div>
            </div>
            
            <div class="dcb-section">
              <div class="dcb-section-title">Target Profile</div>
              <div class="demo-stat">
                <div class="demo-stat-value">${ageGroup}</div>
                <div class="demo-stat-label">Primary Age Group</div>
              </div>
              <div class="demo-profile-badge">${segment} Income Segment</div>
            </div>
            
            <div class="dcb-section">
              <div class="dcb-section-title">Footfall</div>
              <div class="demo-stat">
                <div class="demo-stat-value" style="font-size: 1.4rem; color: #d4af37;">${footfallText}</div>
                <div class="demo-stat-label">Est. Daily Visitors</div>
              </div>
            </div>
          </div>
          
          <!-- Commercial Panel -->
          <div class="dcb-panel" id="panel-commercial">
            <div class="dcb-section">
              <div class="dcb-section-title">Rental Metrics</div>
              <div class="commercial-stat-row">
                <span class="commercial-stat-label">Avg. Rent</span>
                <span class="commercial-stat-value">${rentText}</span>
              </div>
              <div class="commercial-stat-row">
                <span class="commercial-stat-label">Rent Band</span>
                <span class="commercial-stat-value">${rentBand}</span>
              </div>
              <div class="commercial-stat-row">
                <span class="commercial-stat-label">Avg. Spend/Visit</span>
                <span class="commercial-stat-value">${spendText}</span>
              </div>
            </div>
            
            <div class="dcb-section">
              <div class="dcb-section-title">Commercial Units</div>
              <div class="commercial-stat-row">
                <span class="commercial-stat-label">Total Units</span>
                <span class="commercial-stat-value">${units}</span>
              </div>
            </div>
            
            <div class="dcb-section">
              <div class="dcb-section-title">Anchor Tenants</div>
              <div class="anchor-chips">
                ${anchors.map(anchor => `
                  <div class="anchor-chip">
                    <span class="anchor-chip-icon">🏬</span>
                    ${anchor}
                  </div>
                `).join('')}
                ${anchors.length === 0 ? '<span style="color: #888; font-size: 0.8rem;">No major anchors</span>' : ''}
              </div>
            </div>
          </div>
          
          <!-- Brandscape Panel -->
          <div class="dcb-panel" id="panel-brandscape">
            <div class="dcb-section">
              <div class="dcb-section-title">Existing Brands</div>
              <div class="brand-list">
                ${brands.map(brand => `<span class="brand-chip">${brand}</span>`).join('')}
                ${brands.length === 0 ? '<span style="color: #888; font-size: 0.8rem;">Brand data not available</span>' : ''}
              </div>
            </div>
            
            <div class="dcb-section">
              <div class="dcb-section-title">Category Saturation</div>
              <div class="saturation-grid">
                <div class="saturation-item">
                  <div class="saturation-category">F&B</div>
                  <div class="saturation-bar-bg">
                    <div class="saturation-bar high" style="width: 75%;"></div>
                  </div>
                  <div class="saturation-label">High</div>
                </div>
                <div class="saturation-item">
                  <div class="saturation-category">Fashion</div>
                  <div class="saturation-bar-bg">
                    <div class="saturation-bar medium" style="width: 50%;"></div>
                  </div>
                  <div class="saturation-label">Medium</div>
                </div>
                <div class="saturation-item">
                  <div class="saturation-category">Electronics</div>
                  <div class="saturation-bar-bg">
                    <div class="saturation-bar low" style="width: 25%;"></div>
                  </div>
                  <div class="saturation-label">Low</div>
                </div>
                <div class="saturation-item">
                  <div class="saturation-category">Wellness</div>
                  <div class="saturation-bar-bg">
                    <div class="saturation-bar low" style="width: 20%;"></div>
                  </div>
                  <div class="saturation-label">Low</div>
                </div>
              </div>
            </div>
            
            <div class="dcb-section">
              <div class="dcb-section-title">Whitespace Opportunities</div>
              <div class="whitespace-list">
                <span class="whitespace-chip">Pet Care</span>
                <span class="whitespace-chip">Coworking</span>
                <span class="whitespace-chip">EV Charging</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Find Me My Location CTA -->
        <button class="btn-sidebar-cta" id="btn-find-location">
          Find Me My Location
        </button>
      `;

      sidebar.classList.add('visible');
      
      // Tab switching logic
      const tabs = sidebarContent.querySelectorAll('.dcb-tab');
      const panels = sidebarContent.querySelectorAll('.dcb-panel');
      
      tabs.forEach(tab => {
        tab.addEventListener('click', () => {
          const targetTab = tab.dataset.tab;
          
          // Update active tab
          tabs.forEach(t => t.classList.remove('active'));
          tab.classList.add('active');
          
          // Update active panel
          panels.forEach(p => p.classList.remove('active'));
          const targetPanel = document.getElementById(`panel-${targetTab}`);
          if (targetPanel) targetPanel.classList.add('active');
        });
      });
      
      // Find Me My Location button in sidebar
      const btnFindLocation = document.getElementById('btn-find-location');
      if (btnFindLocation) {
        btnFindLocation.addEventListener('click', () => {
          // Close sidebar and open customisation panel
          sidebar.classList.remove('visible');
          const customPanel = document.getElementById('customisation-panel');
          if (customPanel) customPanel.classList.add('visible');
        });
      }
    };

    // --- Wizard Logic ---
    const slide1 = document.getElementById('slide-1');
    const slide2 = document.getElementById('slide-2');
    const slide3 = document.getElementById('slide-3');

    document.getElementById('btn-next-1').onclick = () => {
      if (!inputName.value) {
        inputName.style.borderColor = 'red';
        return;
      }
      slide1.classList.remove('active');
      slide2.classList.add('active');
    };

    document.getElementById('btn-next-2').onclick = () => {
      // Preload Map Logic
      const selectedCityName = document.getElementById('city-select').value;
      const selectedCountryName = document.getElementById('country-select').value;
      
      const city = geoData.cities.features.find(f => f.properties.name === selectedCityName);
      const country = geoData.countries.features.find(f => f.properties.name === selectedCountryName);

      if (city) {
        loadCityView(city);
      } else if (country) {
        loadCountryView(country);
      }

      // Ensure wizard stays on top (loadCityView usually hides sidebar, checking wizard visibility)
      // Since default loadCityView doesn't hide wizard-overlay, just sidebar, this is safe.
      // But we just want to update the view in background.

      slide2.classList.remove('active');
      slide3.classList.add('active');
    };

    // Back Button Logic
    document.getElementById('btn-back-2').onclick = () => {
      // User requested back button on wizard to go back to Landing
      // Check if we skipped slide 1 (usually true if country pre-selected)
      if (countrySelect.value) { // We have a selected country
          returnToLanding();
      } else {
          // Normal behavior? Or always return to Landing?
          // "Take us back to landing" - usually implies exiting the wizard flow
          returnToLanding();
      }
    };

    document.getElementById('btn-back-3').onclick = () => {
      slide3.classList.remove('active');
      slide2.classList.add('active');
    };

    document.getElementById('btn-explore-all').onclick = () => {
      wizardOverlay.classList.add('hidden');
      loadGlobalView();
    };

    document.getElementById('btn-finish').onclick = () => {
      const btnFinish = document.getElementById('btn-finish');
      const originalText = btnFinish.innerText;
      btnFinish.innerText = 'Initializing...';
      btnFinish.disabled = true;

      userCriteria = {
        sector: document.getElementById('sector-select').value,
        aov: document.getElementById('aov-select').value
      };
      
      const selectedCity = document.getElementById('city-select').value;
      const selectedCountry = document.getElementById('country-select').value;
      const name = document.getElementById('input-name').value;
      const brand = document.getElementById('input-brand').value;

      // Prepare payload for FormSubmit
      const formData = new FormData();
      formData.append('name', name);
      formData.append('brand', brand);
      formData.append('country', selectedCountry);
      formData.append('city', selectedCity);
      formData.append('sector', userCriteria.sector);
      formData.append('aov', userCriteria.aov);
      formData.append('_subject', `New Intelligence Lead: ${brand} (${name})`);

      // Send Data
      fetch("https://formsubmit.co/ajax/info@foottfall.com", {
          method: "POST",
          body: formData
      })
      .then(response => response.json())
      .then(data => {
          console.log('Lead captured successfully');
      })
      .catch(error => {
          console.error('Error capturing lead:', error);
      })
      .finally(() => {
          // Always proceed to dashboard
          wizardOverlay.classList.add('hidden');
          // Map is already preloaded, but just in case or if logic changes:
          const city = geoData.cities.features.find(f => f.properties.name === selectedCity);
          if (city && currentLevel !== 'City') loadCityView(city);
          
          btnFinish.innerText = originalText;
          btnFinish.disabled = false;
      });
    };

    // Auto-hide hero on button clicks
    const countryBtns = document.querySelectorAll('.btn-country');
    countryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
             // 1. Hide Hero Overlay
             const panel = document.getElementById('landing-left-panel');
             if (panel) panel.classList.add('hidden-overlay');
             
             // 2. Hide Stats Card (point 5 from feedback)
             const statsCard = document.getElementById('stats-card');
             if (statsCard) {
                statsCard.classList.remove('visible');
                statsCard.classList.add('hidden');
             }
             
             // 3. Stop Tour permanently
             if (MapTourController) MapTourController.stop();
             
             // 4. Load Country View
             const countryName = btn.getAttribute('data-country');
             const countryFeature = geoData.countries.features.find(f => f.properties.name === countryName);
             
             if (countryFeature) {
                 // Mark landing as hidden so legend/tipbox become visible
                 const landingSection = document.getElementById('landing-hero-section');
                 if (landingSection) landingSection.classList.add('hidden');
                 
                 loadCountryView(countryFeature);
             }
        });
    });


    document.getElementById('close-sidebar').onclick = () => sidebar.classList.remove('visible');
    
    // Watermark Home Link
    document.getElementById('watermark-home').onclick = () => {
      window.history.pushState(null, null, '/info');
      window.dispatchEvent(new PopStateEvent('popstate'));
    };
    
    // ============================================
    // PHASE 2: CUSTOMISATION PANEL & FILTER LOGIC
    // ============================================
    
    // Filter State
    let filterState = {
      categories: ['fb'],
      propertySize: '500-2000',
      ticketSize: '500-1000'
    };
    
    // DOM References for customisation
    const customisationPanel = document.getElementById('customisation-panel');
    const matchedResultsPanel = document.getElementById('matched-results');
    const closeCustomisation = document.getElementById('close-customisation');
    const applyFiltersBtn = document.getElementById('apply-filters');
    const editFiltersBtn = document.getElementById('edit-filters');
    const resultsListEl = document.getElementById('results-list');
    const matchCountEl = document.getElementById('match-count');
    const btnContactAdvisory = document.getElementById('btn-contact-advisory');
    
    // Open customisation panel from stats card button (uses existing btnStatsExplore)
    // Note: The main btn-stats-explore handler is defined earlier and calls transitionToDashboard()
    // For the customisation panel, we'll add a secondary trigger via a different mechanism
    // The stats card "Find me my location" button will open the customisation panel when in city view
    
    // Close customisation panel
    if (closeCustomisation) {
      closeCustomisation.addEventListener('click', () => {
        customisationPanel.classList.remove('visible');
      });
    }
    
    // Edit filters - reopen customisation
    if (editFiltersBtn) {
      editFiltersBtn.addEventListener('click', () => {
        matchedResultsPanel.classList.remove('visible');
        customisationPanel.classList.add('visible');
      });
    }
    
    // Apply filters
    if (applyFiltersBtn) {
      applyFiltersBtn.addEventListener('click', () => {
        // Collect filter values
        const categoryInputs = document.querySelectorAll('#category-filters input:checked');
        filterState.categories = Array.from(categoryInputs).map(i => i.value);
        
        const sizeInput = document.querySelector('#size-filters input:checked');
        filterState.propertySize = sizeInput ? sizeInput.value : '500-2000';
        
        const ticketInput = document.querySelector('#ticket-filters input:checked');
        filterState.ticketSize = ticketInput ? ticketInput.value : '500-1000';
        
        console.log('Applied Filters:', filterState);
        
        // Close customisation panel
        customisationPanel.classList.remove('visible');
        
        // Apply filters and render results
        applyFiltersAndShowResults();
      });
    }
    
    // Filter and show matched results
    const applyFiltersAndShowResults = () => {
      // Get current city from breadcrumbs
      const cityName = breadcrumbs && breadcrumbs.length >= 3 ? breadcrumbs[2] : null;
      
      if (!cityName) {
        console.log('No city selected, cannot filter');
        return;
      }
      
      // Get trade areas for current city
      const cityTradeAreas = geoData.tradeAreas.features.filter(f => 
        f.properties.city === cityName
      );
      
      // Filter based on criteria (relaxed matching for demo)
      const matched = cityTradeAreas.filter(area => {
        const props = area.properties;
        
        // Category match (any overlap)
        const suitableFor = props.suitableFor || [];
        const categoryMatch = filterState.categories.length === 0 || 
          filterState.categories.some(cat => suitableFor.includes(cat));
        
        // Size match
        const propertySizes = props.propertySizes || [];
        const sizeMatch = propertySizes.length === 0 || 
          propertySizes.includes(filterState.propertySize);
        
        // Return true if matches both (or relaxed: either)
        return categoryMatch && sizeMatch;
      });
      
      // Render results
      renderMatchedResults(matched, cityName);
    };
    
    // Render matched results
    const renderMatchedResults = (areas, cityName) => {
      if (!matchCountEl || !resultsListEl || !matchedResultsPanel) return;
      
      matchCountEl.innerText = areas.length;
      
      if (areas.length === 0) {
        resultsListEl.innerHTML = `
          <div class="results-empty">
            <div class="results-empty-icon">🔍</div>
            <div class="results-empty-text">No matching trade areas found.<br>Try adjusting your filters.</div>
          </div>
        `;
      } else {
        resultsListEl.innerHTML = areas.map(area => {
          const data = tradeData[area.properties.id];
          const availableUnits = data?.commercial?.units ? Math.floor(parseInt(data.commercial.units) * 0.1) : '—';
          const rentText = data?.stats?.rent || '—';
          
          return `
            <div class="result-card" data-area-id="${area.properties.id}">
              <div class="result-header">
                <div class="result-dot" style="background: ${area.properties.color}; color: ${area.properties.color};"></div>
                <div class="result-info">
                  <h4>${area.properties.name}</h4>
                  <span class="result-type">${area.properties.type}</span>
                </div>
              </div>
              <div class="result-stats">
                <div class="stat">
                  <span class="stat-value">${availableUnits}</span>
                  <span class="stat-label">Available</span>
                </div>
                <div class="stat">
                  <span class="stat-value">${rentText}</span>
                  <span class="stat-label">Rent</span>
                </div>
              </div>
              <button class="btn-view-area">View Details →</button>
            </div>
          `;
        }).join('');
        
        // Attach click handlers
        resultsListEl.querySelectorAll('.result-card').forEach(card => {
          card.querySelector('.btn-view-area').addEventListener('click', () => {
            const areaId = card.dataset.areaId;
            const feature = geoData.tradeAreas.features.find(f => f.properties.id === areaId);
            if (feature) {
              loadTradeAreaView(feature);
            }
          });
        });
      }
      
      // Show results panel
      matchedResultsPanel.classList.add('visible');
    };
    
    // Contact advisory - for now just show alert
    if (btnContactAdvisory) {
      btnContactAdvisory.addEventListener('click', () => {
        alert('Thank you for your interest! Our advisory team will contact you shortly.');
      });
    }
    
  }
};
