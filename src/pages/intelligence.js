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
                  <button class="wizard-back" id="btn-back-2" style="background:none; border:none; color:rgba(255,255,255,0.7); cursor:pointer; margin-right:1rem; padding: 5px; display: flex; align-items: center; transition: color 0.3s;">
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
                   <button class="wizard-back" id="btn-back-3" style="background:none; border:none; color:rgba(255,255,255,0.7); cursor:pointer; margin-right:1rem; padding: 5px; display: flex; align-items: center; transition: color 0.3s;">
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
          
          <!-- Landing Section (100vh) -->
          <div id="landing-hero-section">
            <div class="landing-content">
              <div class="hero-logo-wrapper">
                <img src="/logo.png" alt="FOOTTFALL" class="hero-logo-large">
              </div>
              <h2 class="hero-tagline">Real Estate Intelligence Re-imagined.</h2>
              <div class="country-selector">
                <button class="btn-country" data-country="India">India</button>
                <button class="btn-country" data-country="UAE">UAE</button>
              </div>
            </div>
            <div class="scroll-hint">
              <span>Scroll to learn more</span>
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
                    </h2>
                    <div class="founder-bio">
                      <p><strong style="color: #fff;">Rahul Ahuja</strong> believes that real estate is the physical language of economics. With over 15 years in high-volume acquisitions, he steers the firm's macro-strategy, identifying undervalued corridors before they hit the institutional radar.</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <!-- Services Section -->
            <section id="services" class="services-section">
              <h2 class="section-title services-header animate-on-scroll">Offerings</h2>
              <div class="services-split-container">
                <div class="split-section brands" id="section-brands">
                  <div class="overlay-gradient"></div>
                  <div class="section-content">
                    <span class="section-number">01 — Strategy</span>
                    <h2 class="service-type-title">Brands</h2>
                    <p class="section-desc">Use AI to find your next flagship location. Analyze footfall, demographics, and competition to minimize risk.</p>
                  </div>
                </div>
                <div class="split-section landlords" id="section-landlords">
                  <div class="overlay-gradient"></div>
                  <div class="section-content">
                    <span class="section-number">02 — Assets</span>
                    <h2 class="service-type-title">Landlords</h2>
                    <p class="section-desc">Optimize tenant mix for maximum yield. Identify the right brand mix for your property using real-world data.</p>
                  </div>
                </div>
              </div>
            </section>

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
      map = new maplibregl.Map({
        container: 'map-container',
        style: 'https://tiles.openfreemap.org/styles/liberty', // Free vector style
        center: [78, 20],
        zoom: 2.2, // Start slightly farther out for zoom effect
        pitch: 0,
        bearing: 0,
        antialias: true // Needed for 3D buildings
      });

      // Initialize Popup for tooltips
      const popup = new maplibregl.Popup({
        closeButton: false,
        closeOnClick: false,
        offset: 15
      });

      map.on('load', () => {
        // Initial Fade In - Map is ready
        setTimeout(() => {
           triggerLandingAnimation();
        }, 800);
        
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
          
          // Animation removed to prevent overwriting hover expression
          // map.setPaintProperty('cities-fill', 'fill-opacity', 0.4);
          // setTimeout(() => {
          //   map.setPaintProperty('cities-fill', 'fill-opacity', 0.2);
          // }, 150);
          
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

    // Failsafe Timeout
    setTimeout(() => {
      triggerLandingAnimation();
    }, 4500);

    // Country button click - zoom map and show prompt
    console.log("Setting up button listeners. Found", countryButtons.length, "buttons");
    countryButtons.forEach((btn, index) => {
      console.log(`Button ${index}: ${btn.dataset.country}`);
      btn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent event bubbling
        selectedCountryName = btn.dataset.country;
        console.log("Country Button Clicked:", selectedCountryName, "Button Index:", index); // DEBUG

        // Enter PROMPT MODE:
        // 1. Hide Landing Text (logo etc)
        const contentToHide = document.querySelector('.landing-content');
        if (contentToHide) {
             console.log("Hiding landing content for", selectedCountryName);
             contentToHide.style.opacity = '0';
             contentToHide.style.pointerEvents = 'none'; // Ensure no clicks
        } else {
             console.error("Could not find .landing-content to hide!");
        }

        // 2. Add prompt-mode class to overlay (allows overlays to show through guard)
        if (landingOverlay) landingOverlay.classList.add('prompt-mode');

        // Load Country View immediately (updates map state)
        console.log("Looking for country feature...");
        const countryFeature = geoData.countries.features.find(c => c.properties.name === selectedCountryName);
        console.log("Country Feature Found:", countryFeature);

        if (countryFeature) {
          console.log("Loading Country View...");
          
          try {
              loadCountryView(countryFeature);
          } catch (e) {
              console.error("Error loading country view:", e);
          }
          
          // FORCE SHOW UI Elements explicitly
          if (legend) legend.classList.add('visible');
          if (tipBox) {
             tipBox.classList.add('visible');
             // Update tip content
             const countryCities = geoData.cities.features.filter(f => f.properties.country === selectedCountryName);
             updateTipBox('Country', { countryName: selectedCountryName, cityCount: countryCities.length });
          }
        } else {
             console.error("Country Feature NOT Found for:", selectedCountryName);
             console.log("Available Countries:", geoData.countries.features.map(f => f.properties.name));
        }

        // Update prompt text and show it
        // Ensure this runs even if map fails
        const promptCountrySpan = document.getElementById('prompt-country-name');
        if (promptCountrySpan) promptCountrySpan.innerText = selectedCountryName;
        
        if (landingPrompt) {
            console.log("Showing Prompt Overlay");
            landingPrompt.classList.add('visible');
        } else {
            console.error("Landing Prompt Element Not Found!");
        }
      });
    });

    // Close prompt - Go back to "Landing Mode"
    if (promptClose) {
      promptClose.addEventListener('click', () => {
        console.log("Closing prompt, reverting to landing mode");
        
        // Hide prompt
        if (landingPrompt) landingPrompt.classList.remove('visible');
        
        // Revert PROMPT MODE:
        if (landingOverlay) landingOverlay.classList.remove('prompt-mode');
        
        // Restore Landing Text - use fresh query
        const contentToShow = document.querySelector('.landing-content');
        if (contentToShow) {
            contentToShow.style.opacity = '1';
            contentToShow.style.pointerEvents = 'auto';
        }
        
        // Hide all dashboard UI elements
        if (topBar) topBar.classList.remove('visible');
        if (legend) legend.classList.remove('visible');
        if (tipBox) tipBox.classList.remove('visible');
        
        // Reload global view (resets map)
        loadGlobalView();
      });
    }

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
      if (path.length > 1) {
        btnBack.style.display = 'block';
      } else {
        btnBack.style.display = 'none';
      }
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
        const landingContent = document.querySelector('.landing-content');
        
        // SEQUENCE:
        // 1. Start Zoom Animation (simulated fly-in)
        setTimeout(() => {
             // Zoom to India/UAE focus
             if (map) map.flyTo({ center: [78, 22], zoom: 3.8, duration: 2500, essential:true }); 
             
             // 2. Fade In Landing Content after zoom starts
             setTimeout(() => {
                 if (landingContent) landingContent.style.opacity = '1';
             }, 800);
        }, 200);
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

    let csvData = [];

    const loadCSVData = async () => {
      try {
        const response = await fetch('/intelligence_data.csv');
        const rawText = await response.text();
        
        // Fix: Header is on line 3, find where it starts
        const headerIndex = rawText.indexOf('Locality,');
        const csvText = headerIndex !== -1 ? rawText.substring(headerIndex) : rawText;

        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
             // Clean and process data
             csvData = results.data.map(row => {
                // Parse Rent: "₹24,000" or "₹22,000–₹35,000"
                const parseRange = (str) => {
                   if (!str) return 0;
                   // Normalize: Remove currency, commas, and handle both hyphen and en-dash
                   const clean = str.replace(/[₹,]/g, '').trim();
                   // Split by hyphen or en-dash
                   if (clean.match(/[–-]/)) {
                      const parts = clean.split(/[–-]/).map(p => parseFloat(p.trim()));
                      if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
                          return (parts[0] + parts[1]) / 2;
                      }
                   }
                   return parseFloat(clean) || 0;
                };

                return {
                   locality: row['Locality'] ? row['Locality'].trim() : '',
                   rent: parseRange(row['Avg Residential Rent / Month (₹)']),
                   spend: parseRange(row['Est. Spend per Visit (₹)']),
                   rawRent: row['Avg Residential Rent / Month (₹)'],
                   rawSpend: row['Est. Spend per Visit (₹)']
                };
             }).filter(x => x.locality);
             console.log("CSV Data Loaded:", csvData.length, "rows");
          }
        });
      } catch (e) {
        console.error("Error loading CSV:", e);
      }
    };

    loadCSVData(); // Trigger load

    // --- Sidebar Logic ---
    let chartInstance = null;

    const openSidebar = (data) => {
      sidebarTitle.innerText = data.name;
      
      // Helper: Normalize string for comparison (remove special chars, lowercase, standardize dashes)
      const normalize = (str) => {
          if (!str) return '';
          return str.toLowerCase()
             .replace(/[–—]/g, '-') // Replace en/em dash with hyphen
             .replace(/[^a-z0-9]/g, '') // Keep only alphanumeric
             .trim();
      };

      const searchName = normalize(data.name);
      
      // Find matching CSV data
      // 1. Exact match (normalized)
      // 2. Partial match (if one contains the other)
      const marketData = csvData.find(d => {
          const csvName = normalize(d.locality);
          return csvName === searchName || 
                 csvName.includes(searchName) || 
                 searchName.includes(csvName);
      });

      console.log(`Open Sidebar: ${data.name} (norm: ${searchName}) -> Match:`, marketData);

      const rentValue = marketData ? marketData.rent : 0;
      const spendValue = marketData ? marketData.spend : 0;
      
      sidebarContent.innerHTML = `
        <div class="metric-card">
          <span class="metric-title">Financials</span>
          
          <!-- Rent Section -->
          <div style="margin-bottom: 25px;">
             <span class="metric-sub" style="display:block; margin-bottom:5px;">Avg. Residential Rent</span>
             <div class="metric-value-large" style="font-size: 1.5rem;">${marketData ? marketData.rawRent : 'N/A'}</div>
             <div class="chart-container" style="height: 150px;">
                <canvas id="rent-chart"></canvas>
             </div>
          </div>

          <!-- Spend / Market Position Section -->
          <div style="border-top: 1px dashed rgba(255,255,255,0.2); padding-top: 20px;">
             <span class="metric-sub" style="display:block; margin-bottom:5px;">Market Positioning (Spend vs Rent)</span>
             <div class="metric-value-large" style="font-size: 1.5rem;">${marketData ? marketData.rawSpend : 'N/A'}</div>
             <div class="chart-container" style="height: 200px;">
                <canvas id="spend-chart"></canvas>
             </div>
          </div>

        </div>
      `;

      sidebar.classList.add('visible');

      // Render Charts
      if (marketData) {
         if (chartInstance) chartInstance.destroy();
         
         // 1. Rent Bar Chart (Simple)
         const ctxRent = document.getElementById('rent-chart').getContext('2d');
         new Chart(ctxRent, {
            type: 'bar',
            data: {
               labels: ['Avg Rent'],
               datasets: [{
                  label: 'Rent',
                  data: [rentValue],
                  backgroundColor: '#4bc0c090',
                  borderColor: '#4bc0c0',
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
                  x: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.1)' } },
                  y: { display: false }
               }
            }
         });

         // 2. Market Position Scatter Chart (Fancy)
         const ctxSpend = document.getElementById('spend-chart').getContext('2d');
         
         // Prepare Dataset: All Points + Current Point
         const allPoints = csvData.map(d => ({
            x: d.rent,
            y: d.spend,
            name: d.locality
         }));

         const currentPoint = {
            x: rentValue,
            y: spendValue,
            name: data.name
         };

         new Chart(ctxSpend, {
            type: 'scatter',
            data: {
               datasets: [
                  {
                     label: 'Market',
                     data: allPoints,
                     backgroundColor: 'rgba(0, 0, 0, 0.3)', // Visible dark ghost points
                     borderColor: 'transparent',
                     pointRadius: 4,
                     pointHoverRadius: 6
                  },
                  {
                     label: 'Current',
                     data: [currentPoint],
                     backgroundColor: '#d4af37', // Gold
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
                     padding: 10,
                     callbacks: {
                        label: (c) => {
                           const point = c.raw;
                           return `${point.name || 'Area'}: ₹${point.y} Spend / ₹${point.x} Rent`;
                        }
                     }
                  }
               },
               scales: {
                  x: {
                     type: 'linear',
                     position: 'bottom',
                     title: { display: true, text: 'Avg Rent', color: '#666', font: {size: 9} },
                     grid: { color: 'rgba(255,255,255,0.05)' },
                     ticks: { color: '#888', font: {size: 9}, callback: (v) => '₹' + v/1000 + 'k' }
                  },
                  y: {
                     title: { display: true, text: 'Abs. Spend', color: '#666', font: {size: 9} },
                     grid: { color: 'rgba(255,255,255,0.05)' },
                     ticks: { color: '#888', font: {size: 9}, callback: (v) => '₹' + v/1000 + 'k' }
                  }
               },
               animation: {
                   duration: 1500,
                   easing: 'easeOutElastic'
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
      slide2.classList.remove('active');
      slide1.classList.add('active');
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

    document.getElementById('close-sidebar').onclick = () => sidebar.classList.remove('visible');
    
    // Watermark Home Link
    document.getElementById('watermark-home').onclick = () => {
      window.location.href = '/';
    };
  }
};
