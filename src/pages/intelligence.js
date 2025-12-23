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
                    <div class="logo-container">
                      <!-- F -->
                      <div class="letter-slot slot-f">
                        <div class="f-scanner-box">
                          <div class="f-outline">F</div>
                          <div class="scan-line"></div>
                        </div>
                        <div class="final-letter">F</div>
                      </div>

                      <!-- OO -->
                      <div class="letter-slot slot-o1">
                        <div class="person-shape p1" style="left: 10px;">
                          <div class="p-head"></div>
                          <div class="p-body"></div>
                        </div>
                        <div class="final-letter">O</div>
                      </div>
                      <div class="letter-slot slot-o2">
                        <div class="person-shape p2" style="right: 10px;">
                          <div class="p-head"></div>
                          <div class="p-body"></div>
                        </div>
                        <div class="match-flash"></div>
                        <div class="final-letter">O</div>
                      </div>

                      <!-- TT -->
                      <div class="letter-slot slot-t1">
                        <div class="letter-mask">
                          <div class="final-letter t1-static" style="opacity: 0;">T</div>
                        </div>
                      </div>
                      <div class="letter-slot slot-t2">
                        <div class="map-block-container">
                          <div class="map-road road-1"></div>
                          <div class="map-road road-2"></div>
                          <div class="map-road road-3"></div>
                          <div class="map-road road-4"></div>
                          <div class="map-pin-small" style="top: 20px; left: 30px;"></div>
                          <div class="map-pin-small" style="bottom: 25px; right: 35px;"></div>
                          <div class="map-pin-small" style="top: 15px; right: 20px;"></div>
                        </div>
                        <div class="letter-mask">
                          <div class="final-letter t2-static" style="opacity: 0;">T</div>
                        </div>
                      </div>

                      <div class="letter-slot slot-f2">
                        <div class="graph-group">
                          <div class="g-bar"></div>
                          <div class="g-bar"></div>
                          <div class="g-bar"></div>
                          <div class="g-bar"></div>
                        </div>
                        <div class="final-letter">F</div>
                      </div>
                      <div class="letter-slot slot-a">
                        <div class="network-group">
                          <div class="n-node node1" style="bottom: 15px; left: 10px;"></div>
                          <div class="n-node node2" style="bottom: 40px; left: 25px;"></div>
                          <div class="n-node node3" style="bottom: 20px; left: 40px;"></div>
                          <div class="n-line line1" style="bottom: 18px; left: 14px; width: 22px; transform: rotate(-55deg);"></div>
                          <div class="n-line line2" style="bottom: 42px; left: 28px; width: 22px; transform: rotate(55deg);"></div>
                        </div>
                        <div class="final-letter">A</div>
                      </div>

                      <!-- LL Custom Merge -->
                      <div class="letter-slot slot-l1">
                        <div class="pin-shape">
                          <div class="pin-head">
                            <div class="pin-dot"></div>
                          </div>
                        </div>
                        <div class="pin-shadow"></div>
                        <div class="l1-custom-shape">
                          <div class="l1-v-bar"></div>
                          <div class="l1-h-bar"></div>
                        </div>
                      </div>

                      <div class="letter-slot slot-l2">
                        <div class="l2-forklift-mechanism">
                          <div class="l2-vertical-stem"></div>
                          <div class="l2-forks"></div>
                          <div class="shop-block">
                            <div class="shop-roof"></div>
                            <div class="shop-door"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <h1 class="landing-headline">
                  Trade Area Intelligence<br>
                  <span class="headline-highlight">Reimagined.</span>
                </h1>
                <p class="landing-subtitle">
                  Curating spaces that people want to be in — with the brands that belong in them.
                </p>
                
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
            
            <!-- Scroll Indicator (bottom center) -->
            <div class="scroll-indicator" id="scroll-indicator">
              <span class="scroll-text">Explore more about us</span>
              <div class="scroll-arrow">↓</div>
            </div>
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
    let breadcrumbs = ['Global'];
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
        this.start();
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
          zoom: 9.07, 
          duration: 2500,
          stayDuration: 6000
        },
        { 
          region: 'UAE',
          center: [55.27, 25.20],
          zoom: 8.9,
          duration: 2500,
          stayDuration: 8000
        }
      ],
      
      pauseTimeout: null, // For temporary pause
      
      init() {
        this.pauseIndicator = document.getElementById('tour-pause-indicator');
        const landingMapPanel = document.getElementById('landing-map-panel'); // Note: this might be hidden/removed in new layout
        const mapContainer = document.getElementById('map-container');
        
        // Pause on interactions
        // Note: Global map listeners handle most of this now via hideHeroPanel
      },
      
      start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.isPaused = false;
        
        // Make sure stats card is visible for the tour
        const card = document.getElementById('stats-card');
        if (card) {
             card.style.display = 'block'; // Ensure it's not display:none
             card.classList.remove('hidden');
             setTimeout(() => card.classList.add('visible'), 100);
        }
        
        StatsCardController.init();
        this.flyToStop(0);
      },
      
      flyToStop(index) {
        // Stop if not running, paused, or no longer in landing mode
        if (!this.isRunning || this.isPaused || viewMode !== 'landing') {
          this.stop();
          return;
        }
        
        const stop = this.tourStops[index];
        this.currentStopIndex = index;
        
        // Fly to region
        console.log(`Tour: Flying to ${stop.region}`);
        
        // Robust finding of country feature
        const countryFeature = geoData.countries?.features?.find(f => 
            f.properties.name === stop.region || 
            f.properties.name.toLowerCase() === stop.region.toLowerCase()
        );
        
        if (countryFeature) {
            console.log(`Tour: Found feature for ${stop.region}, setting up Country View`);
            currentLevel = 'Country';
            updateBreadcrumbs(['Global', stop.region]);
            
            // Visibility: HIDE global country fill to prevent double-border/overlap
            setLayerVisibility(['country-fill', 'india-fill'], 'none'); 
            
            // SHOW cities and city-specific borders
            setLayerVisibility(['cities-border', 'cities-border-casing', 'cities-glow', 'cities-label'], 'visible');
            setLayerVisibility(['cities-fill'], 'visible'); 
            
            // Hide specific trade area points
            setLayerVisibility(['trade-blobs', 'trade-points'], 'none');
            
            // Update Filters for Cities
            map.setFilter('cities-fill', ['==', 'country', stop.region]);
            map.setFilter('cities-border', ['==', 'country', stop.region]);
            map.setFilter('cities-border-casing', ['==', 'country', stop.region]);
            map.setFilter('cities-glow', ['==', 'country', stop.region]);
            map.setFilter('cities-label', ['==', 'country', stop.region]);
        } else {
             console.warn(`Tour: Country feature for ${stop.region} NOT found!`);
        }
        
        // 2. FORCE correct camera position for Landing Page Tour
        if (map) {
            map.flyTo({
                center: stop.center,
                zoom: stop.zoom,
                duration: stop.duration,
                essential: true
            });
        }
        
        // Start stats rotation after fly animation completes
        setTimeout(() => {
          if (!this.isPaused && viewMode === 'landing') {
            StatsCardController.startRotation(stop.region, 3000);
          }
        }, stop.duration);
        
        // Schedule next region
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
        
        // SHOW Tip Box only when paused (clicked)
        if (this.pauseIndicator) {
          this.pauseIndicator.classList.add('visible');
          // Update text: Remove emoji, simple text
          const textEl = document.getElementById('tour-pause-text');
          if (textEl) textEl.innerText = "Tour paused, tap off map to resume";
        }
      },
      
      // Temporary pause (4 seconds) then auto-resume
      pauseTemporarily(durationMs = 4000) {
        if (!this.isRunning) return;
        
        // Clear any existing pause timeout
        if (this.pauseTimeout) clearTimeout(this.pauseTimeout);
        
        // Pause
        this.pause();
        
        // Auto-resume after duration
        this.pauseTimeout = setTimeout(() => {
          this.resume();
        }, durationMs);
      },
      
      resume() {
        if (!this.isRunning || !this.isPaused) return;
        this.isPaused = false;
        
        // HIDE Tip Box when running
        if (this.pauseIndicator) {
           this.pauseIndicator.classList.remove('visible'); 
        }
        
        // Resume from current stop
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
            tipBox.classList.remove('visible');
            tipBox.style.display = 'none'; // Force hide
            // Reset tip box style just in case
            setTimeout(() => tipBox.style.removeProperty('display'), 500);
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
    
    // Stats card button handler
    const btnStatsExplore = document.getElementById('btn-stats-explore');
    if (btnStatsExplore) {
      btnStatsExplore.addEventListener('click', () => {
        transitionToDashboard();
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
      if (!tipBox || !tipTitle || !tipDetails) return;
      
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
      tipTitle.textContent = content.title;
      tipDetails.innerHTML = content.details;
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

    map = new maplibregl.Map({
        container: 'map-container',
        style: 'https://tiles.openfreemap.org/styles/liberty', // Free vector style
        center: [78, 20],
        zoom: 2.2, // Start slightly farther out for zoom effect
        pitch: 0,
        bearing: 0,
        antialias: true // Needed for 3D buildings
      });

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
        
        let loaded = false;
        const revealPage = () => {
            if (loaded) return;
            loaded = true;
            console.log("Map tiles loaded - revealing page");
            triggerLandingAnimation();
            LandingLogoAnimator.init(); // Start landing logo animation
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
             loadGlobalView();
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
          loadGlobalView();
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
        
        // Group by Type
        const grouped = {};
        cityTradeAreas.forEach(area => {
          const type = area.properties.type || 'Other';
          if (!grouped[type]) grouped[type] = [];
          grouped[type].push(area);
        });

        // Generate HTML with grouping
        wrapper.innerHTML = Object.keys(grouped).map(type => `
          <div style="margin-bottom: 15px;">
            <div class="legend-title" style="color: #666; font-size: 0.75rem; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 4px; margin-bottom: 8px; letter-spacing: 1px; font-weight: 700;">
              ${type.toUpperCase()}
            </div>
            ${grouped[type].map(area => `
              <div class="legend-item" data-area-id="${area.properties.id}">
                <div class="legend-dot" style="background: ${area.properties.color}; box-shadow: 0 0 6px ${area.properties.color}80;"></div>
                <span style="font-weight: 500;">${area.properties.name}</span>
              </div>
            `).join('')}
          </div>
        `).join('');

        // Provide scroll indicator arrow
        const arrow = document.createElement('div');
        arrow.className = 'legend-scroll-indicator';
        arrow.innerHTML = '▼'; 
        arrow.title = "Scroll for more";
        legendContent.appendChild(arrow);

        // Attach event listeners
        const items = wrapper.querySelectorAll('.legend-item');
        items.forEach(item => {
          item.addEventListener('click', () => {
             const areaId = item.getAttribute('data-area-id');
             const feature = geoData.tradeAreas.features.find(f => f.properties.id === areaId);
             if (feature) loadTradeAreaView(feature); 
          });
        });

      } else if (level === 'TradeArea') {
        // Show trade area details in legend
        if (currentTradeArea) {
          const areaData = tradeData[currentTradeArea.properties.id];
          if (areaData) {
            // Area type header
            const typeDiv = document.createElement('div');
            typeDiv.className = 'legend-item';
            typeDiv.style.fontWeight = 'bold';
            typeDiv.style.color = '#444';
            typeDiv.innerHTML = `<div class="legend-dot" style="background: ${currentTradeArea.properties.color};"></div>${currentTradeArea.properties.type}`;
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
      const items = topBar.querySelectorAll('.breadcrumb-item, .breadcrumb-separator');
      items.forEach(el => el.remove());
      
      path.forEach((item, index) => {
        const el = document.createElement('div');
        el.className = 'breadcrumb-item';
        el.innerText = item;
        
        if (index < path.length - 1) {
          el.onclick = () => navigateTo(index);
          const sep = document.createElement('span');
          sep.className = 'breadcrumb-separator';
          sep.innerText = '>';
          topBar.appendChild(el);
          topBar.appendChild(sep);
        } else {
          topBar.appendChild(el);
        }
      });

      // VISIBILITY GUARD
      const landingRef = document.getElementById('landing-hero-section');
      if (!landingRef || landingRef.classList.contains('hidden') || landingRef.classList.contains('prompt-mode')) {
          topBar.classList.add('visible');
      }
      
      // Show/Hide Back Button
      // ALWAYS Show if we are deeper than Global OR if we are ON Global but want to go back to landing
      // Actually simpler: Always show it. If length is 1, it goes to landing.
      btnBack.style.display = 'block';

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
    btnBack.onclick = () => {
      if (breadcrumbs.length > 1) {
        navigateTo(breadcrumbs.length - 2);
      } else {
        // At Global level (length 1), return to Landing Page
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
           if (tipBox) tipBox.classList.remove('visible');
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
    };

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
    };
    
    // Helper to trigger opening animation safely
    const triggerLandingAnimation = () => {
        const landingContent = document.querySelector('.landing-hero-content');
        
        // SEQUENCE:
        // 1. Initialize MapTourController
        MapTourController.init();
        
        // 2. Start the regional tour after a brief delay
        setTimeout(() => {
             // Start the map tour (India/UAE loop)
             if (viewMode === 'landing') {
               MapTourController.start();
             }
             
             // Fade In Landing Content after tour starts
             setTimeout(() => {
                 if (landingContent) landingContent.style.opacity = '1';
             }, 500);
        }, 500);
    };

    const loadCityView = (cityFeature) => {
      currentLevel = 'City';
      currentTradeArea = null;
      sidebar.classList.remove('visible');
      
      updateBreadcrumbs(['Global', cityFeature.properties.country, cityFeature.properties.name]);
      updateLegend('City');
      clearMarkers();

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
      
      // Use pre-enriched data from build script
      const rentText = data.stats.rent || 'N/A';
      const spendText = data.stats.spend || 'N/A';
      
      const rentValue = parseRangeValue(rentText);
      const spendValue = parseRangeValue(spendText);

      // Collect all trade areas for scatter plot context
      // We want to compare against ALL trade areas in the same city or globally?
      // Let's do same city for relevance.
      const currentCity = data.city;
      const cityAreas = Object.values(tradeData).filter(d => d.city === currentCity);

      console.log(`Open Sidebar: ${data.name}. Stats: Rent=${rentValue}, Spend=${spendValue}`);

      sidebarContent.innerHTML = `
        <div class="metric-card">
          <span class="metric-title">Financials</span>
          
          <!-- Rent Section -->
          <div style="margin-bottom: 25px;">
             <span class="metric-sub" style="display:block; margin-bottom:5px;">Avg. Rent (${currentCity === 'Dubai' ? 'AED/sqft' : '₹/Mo'})</span>
             <div class="metric-value-large" style="font-size: 1.5rem;">${rentText}</div>
             <div class="chart-container" style="height: 150px;">
                <canvas id="rent-chart"></canvas>
             </div>
          </div>

          <!-- Spend / Market Position Section -->
          <div style="border-top: 1px dashed rgba(255,255,255,0.2); padding-top: 20px;">
             <span class="metric-sub" style="display:block; margin-bottom:5px;">Est. Spend per Visit</span>
             <div class="metric-value-large" style="font-size: 1.5rem;">${spendText}</div>
             <div class="chart-container" style="height: 200px;">
                <canvas id="spend-chart"></canvas>
             </div>
          </div>
          
          <!-- Demographics Mini-Section -->
           <div style="border-top: 1px dashed rgba(255,255,255,0.2); padding-top: 20px; display: flex; justify-content: space-between;">
              <div>
                  <span class="metric-sub" style="display:block;">Footfall</span>
                  <div class="metric-value" style="font-size: 1.2rem;">${data.stats.footfall || '-'}</div>
              </div>
              <div>
                  <span class="metric-sub" style="display:block;">Profile</span>
                  <div class="metric-value" style="font-size: 1.2rem;">${data.demographics.segment || '-'}</div>
              </div>
           </div>

        </div>
      `;

      sidebar.classList.add('visible');

      // 1. Rent Bar Chart
      if (rentValue > 0) {
          const ctxRent = document.getElementById('rent-chart').getContext('2d');
          
          // Compare with City Average
          const cityAvgRent = cityAreas.reduce((acc, curr) => acc + parseRangeValue(curr.stats.rent), 0) / (cityAreas.length || 1);
          
          new Chart(ctxRent, {
             type: 'bar',
             data: {
                labels: ['This Area', 'City Avg'],
                datasets: [{
                   label: 'Rent',
                   data: [rentValue, cityAvgRent],
                   backgroundColor: ['#d4af37', '#00000050'],
                   borderColor: ['#d4af37', '#000000'],
                   borderWidth: 1,
                   borderRadius: 6,
                   barThickness: 30
                }]
             },
             options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                   x: { 
                       beginAtZero: true, 
                       grid: { color: 'rgba(255,255,255,0.1)' },
                       ticks: { color: '#888', font: {size: 10} }
                   },
                   y: { 
                       ticks: { color: '#ddd', font: {size: 11} }
                   }
                }
             }
          });
      }

      // 2. Scatter Plot
      const ctxSpend = document.getElementById('spend-chart').getContext('2d');
      
      const allPoints = cityAreas.map(d => ({
         x: parseRangeValue(d.stats.rent),
         y: parseRangeValue(d.stats.spend),
         name: d.name
      })).filter(p => p.x > 0 && p.y > 0);

      const currentPoint = {
         x: rentValue,
         y: spendValue,
         name: data.name
      };

      if (allPoints.length > 0) {
          new Chart(ctxSpend, {
             type: 'scatter',
             data: {
                datasets: [
                   {
                      label: 'Other Areas',
                      data: allPoints,
                      backgroundColor: 'rgba(0, 0, 0, 0.4)', // Visible dark ghost points
                      borderColor: 'transparent',
                      pointRadius: 5,
                      pointHoverRadius: 7
                   },
                   {
                      label: 'Current',
                      data: [currentPoint],
                      backgroundColor: '#d4af37',
                      borderColor: '#fff',
                      borderWidth: 2,
                      pointRadius: 8,
                      pointHoverRadius: 10,
                      pointShadowColor: '#d4af37'
                   }
                ]
             },
             options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                   legend: { display: false },
                   tooltip: {
                      backgroundColor: 'rgba(0,0,0,0.9)',
                      callbacks: {
                         label: (c) => `${c.raw.name}: ${c.raw.y} Spend / ${c.raw.x} Rent`
                      }
                   }
                },
                scales: {
                   x: {
                      title: { display: true, text: 'Rent', color: '#666', font: {size: 10} },
                      grid: { color: 'rgba(255,255,255,0.05)' },
                      ticks: { color: '#888' }
                   },
                   y: {
                      title: { display: true, text: 'Spend', color: '#666', font: {size: 10} },
                      grid: { color: 'rgba(255,255,255,0.05)' },
                      ticks: { color: '#888' }
                   }
                }
             }
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
      window.location.href = '/';
    };
  }
};
