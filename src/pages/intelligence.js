import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { geoData, tradeData } from '../data/geoData.js';
import { DataManager } from '../data/dataManager.js';

export const Intelligence = {
  render: () => {
    return `
      <div class="page intelligence-page">
        <!-- Top Bar -->
        <div id="top-bar">
          <div class="breadcrumb-back" id="btn-back">← Back</div>
          <div class="breadcrumb-item" id="bc-global">Global</div>
        </div>

        <div id="map-container"></div>
        
        <!-- Legend -->
        <div id="legend">
          <div class="legend-title">Map Layers</div>
          <div id="legend-content"></div>
        </div>

        <!-- Wizard Overlay -->
        <div id="wizard-overlay">
          <div class="wizard-card">
            
            <!-- Slide 1: Identity -->
            <div class="wizard-slide active" id="slide-1">
              <h2 class="wizard-title">Welcome</h2>
              <p class="wizard-subtitle">Enter your details to access market intelligence.</p>
              <input type="text" class="wizard-input" id="input-name" placeholder="Your Name">
              <input type="text" class="wizard-input" id="input-brand" placeholder="Brand Name">
              <button class="wizard-btn" id="btn-next-1">Continue</button>
            </div>

            <!-- Slide 2: Geography -->
            <div class="wizard-slide" id="slide-2">
              <h2 class="wizard-title">Select Market</h2>
              <p class="wizard-subtitle">Where would you like to scout today?</p>
              <select class="wizard-input" id="country-select">
                <option value="" disabled selected>Select Country</option>
                <option value="India">India</option>
                <option value="UAE">UAE</option>
              </select>
              <select class="wizard-input" id="city-select" disabled>
                <option value="" disabled selected>Select City</option>
                <!-- Populated dynamically -->
              </select>
              <button class="wizard-btn" id="btn-next-2" disabled>Launch Satellite View</button>
              <button class="wizard-btn secondary" id="btn-explore-all">Explore All Markets</button>
            </div>

            <!-- Slide 3: Criteria -->
            <div class="wizard-slide" id="slide-3">
              <h2 class="wizard-title">Refine Search</h2>
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

        <!-- Sidebar -->
        <div id="sidebar">
          <div class="sidebar-header">
            <h3 class="sidebar-title" id="sidebar-title">Location Data</h3>
            <button class="close-btn" id="close-sidebar">&times;</button>
          </div>
          <div class="sidebar-content" id="sidebar-content"></div>
        </div>
      </div>
    `;
  },

  afterRender: async () => {
    // --- Initialization ---
    await DataManager.loadData();

    let map;
    let currentLayer = null;
    let breadcrumbs = ['Global'];
    let userCriteria = {};

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

    // --- Map Preloading ---
    const initMap = () => {
      map = L.map('map-container', {
        zoomControl: false,
        attributionControl: false,
        fadeAnimation: true,
        zoomAnimation: true,
        minZoom: 3,
        maxZoom: 18
      }).setView([20, 78], 4);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        subdomains: 'abcd',
        maxZoom: 20
      }).addTo(map);

      L.control.zoom({ position: 'bottomright' }).addTo(map);
    };

    initMap();

    // --- Legend Logic ---
    const updateLegend = (level) => {
      legend.classList.add('visible');
      legendContent.innerHTML = '';

      if (level === 'Global') {
        legendContent.innerHTML = `
          <div class="legend-item"><div class="legend-dot" style="background: #d4af37;"></div>Countries</div>
        `;
      } else if (level === 'Country') {
        legendContent.innerHTML = `
          <div class="legend-item"><div class="legend-dot" style="background: #2b83ba;"></div>Major Cities</div>
        `;
      } else if (level === 'City') {
        legendContent.innerHTML = `
          <div class="legend-item"><div class="legend-dot" style="background: #d4af37;"></div>Premium</div>
          <div class="legend-item"><div class="legend-dot" style="background: #d4af37; opacity: 0.7;"></div>High Street</div>
          <div class="legend-item"><div class="legend-dot" style="background: #d4af37; opacity: 0.4;"></div>Residential</div>
        `;
      }
    };

    // --- Logic: Check Incoming Data ---
    const storedBrand = localStorage.getItem('footfall_brand');
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

      topBar.classList.add('visible');
      
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
      }
    };

    // Back Button Logic
    btnBack.onclick = () => {
      if (breadcrumbs.length > 1) {
        navigateTo(breadcrumbs.length - 2);
      }
    };

    // --- View Loaders ---

    const loadGlobalView = () => {
      if (currentLayer) map.removeLayer(currentLayer);
      sidebar.classList.remove('visible');
      updateBreadcrumbs(['Global']);
      updateLegend('Global');
      
      map.setMinZoom(2);
      map.setMaxZoom(6);

      const markers = [];
      geoData.countries.features.forEach(feature => {
        const icon = L.divIcon({
          className: 'custom-pin',
          html: `
            <div class="country-pin"></div>
            <div class="pin-label">${feature.properties.name}</div>
          `,
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });

        const marker = L.marker(feature.geometry.coordinates, { icon }).addTo(map);
        
        marker.on('click', () => {
          loadCountryView(feature);
        });
        markers.push(marker);
      });

      currentLayer = L.layerGroup(markers).addTo(map);
      map.flyTo([20, 78], 4, { duration: 1.5 });
    };

    const loadCountryView = (countryFeature) => {
      if (currentLayer) map.removeLayer(currentLayer);
      sidebar.classList.remove('visible');
      
      updateBreadcrumbs(['Global', countryFeature.properties.name]);
      updateLegend('Country');

      map.setMinZoom(4);
      map.setMaxZoom(8);

      const markers = [];
      geoData.cities.features.forEach(feature => {
        if (feature.properties.country !== countryFeature.properties.name) return;

        const icon = L.divIcon({
          className: 'custom-pin',
          html: `
            <div class="city-pin"></div>
            <div class="pin-label">${feature.properties.name}</div>
          `,
          iconSize: [20, 20],
          iconAnchor: [10, 10]
        });

        const bounds = L.geoJSON(feature).getBounds();
        const center = bounds.getCenter();

        const marker = L.marker(center, { icon }).addTo(map);
        
        marker.on('click', () => {
          loadCityView(feature);
        });
        markers.push(marker);
      });

      currentLayer = L.layerGroup(markers).addTo(map);
      
      if (markers.length > 0) {
        const group = L.featureGroup(markers);
        map.flyToBounds(group.getBounds(), { padding: [50, 50], duration: 1.5 });
      } else {
        map.flyTo(countryFeature.geometry.coordinates, 5, { duration: 1.5 });
      }
    };

    const loadCityView = (cityFeature) => {
      if (currentLayer) map.removeLayer(currentLayer);
      sidebar.classList.remove('visible');
      
      updateBreadcrumbs(['Global', cityFeature.properties.country, cityFeature.properties.name]);
      updateLegend('City');

      map.setMinZoom(10);
      map.setMaxZoom(18);

      const recommendations = DataManager.getRecommendations(userCriteria);
      const cityRecs = recommendations.filter(r => tradeData[r.id].city === cityFeature.properties.name || geoData.tradeAreas.features.find(f => f.properties.id === r.id)?.properties.city === cityFeature.properties.name);

      const markers = [];
      
      // Optimization: Render markers in chunks if too many, but for 20 it's fine.
      // We can use requestAnimationFrame if list grows.
      cityRecs.forEach((data) => {
        const feature = geoData.tradeAreas.features.find(f => f.properties.id === data.id);
        if (!feature) return;

        const icon = L.divIcon({
          className: 'custom-pin',
          html: `
            <div class="map-pin"></div>
            <div class="pin-label">${data.name}</div>
          `,
          iconSize: [30, 42],
          iconAnchor: [15, 42]
        });

        const marker = L.marker(feature.geometry.coordinates, { icon }).addTo(map);

        marker.on('click', () => {
          enterLocationLevel(feature, data);
        });
        markers.push(marker);
      });

      currentLayer = L.layerGroup(markers).addTo(map);
      
      if (markers.length > 0) {
        const group = L.featureGroup(markers);
        map.flyToBounds(group.getBounds(), { padding: [50, 50], duration: 1.5 });
      } else {
        const cityBounds = L.geoJSON(cityFeature).getBounds();
        map.flyToBounds(cityBounds, { padding: [50, 50], duration: 1.5 });
      }
    };

    const enterLocationLevel = (feature, data) => {
      map.flyTo(feature.geometry.coordinates, 17, { duration: 1.5 });
      openSidebar(data);
    };

    // --- Sidebar Logic ---
    const openSidebar = (data) => {
      sidebarTitle.innerText = data.name;
      
      sidebarContent.innerHTML = `
        <div class="metric-card">
          <span class="metric-title">Financials</span>
          <div class="metric-value-large">${data.stats.rent || 'N/A'}</div>
          <span class="metric-sub">Avg. Rent / Month</span>
          <div style="margin-top: 10px; padding-top: 10px; border-top: 1px dashed #eee;">
             <span class="metric-sub">Est. Spend: <strong>${data.stats.spend || 'N/A'}</strong></span>
          </div>
        </div>

        <div class="metric-card">
          <span class="metric-title">Footfall Quality</span>
          <div class="metric-value-large">${data.stats.footfall}</div>
          <span class="metric-sub">Monthly Visitors</span>
          <div style="margin-top: 10px;">
             <span class="metric-sub">Peak: 6PM - 9PM (Weekends)</span>
          </div>
        </div>

        <div class="metric-card">
          <span class="metric-title">Category Fit</span>
          <div style="margin-bottom: 10px;">
            ${data.brands.map(b => `<span class="brand-tag">${b}</span>`).join('')}
          </div>
          <span class="metric-sub">Saturation: Medium</span>
        </div>

        <div class="metric-card">
          <span class="metric-title">Demographics</span>
          <div class="metric-value-large">Age ${data.demographics.age}</div>
          <span class="metric-sub">${data.demographics.segment}</span>
        </div>
      `;

      sidebar.classList.add('visible');
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
      slide2.classList.remove('active');
      slide3.classList.add('active');
    };

    document.getElementById('btn-explore-all').onclick = () => {
      wizardOverlay.classList.add('hidden');
      loadGlobalView();
    };

    document.getElementById('btn-finish').onclick = () => {
      userCriteria = {
        sector: document.getElementById('sector-select').value,
        aov: document.getElementById('aov-select').value
      };
      
      const selectedCity = document.getElementById('city-select').value;
      wizardOverlay.classList.add('hidden');
      
      const city = geoData.cities.features.find(f => f.properties.name === selectedCity);
      if (city) loadCityView(city);
    };

    document.getElementById('close-sidebar').onclick = () => sidebar.classList.remove('visible');
  }
};
