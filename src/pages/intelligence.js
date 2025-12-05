import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
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
    let breadcrumbs = ['Global'];
    let userCriteria = {};
    let currentLevel = 'Global'; // Global, Country, City
    let markers = []; // Store active markers

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

    // --- Helper: Calculate Bounds ---
    const getBounds = (features) => {
      const bounds = new maplibregl.LngLatBounds();
      features.forEach(f => {
        if (f.geometry.type === 'Point') {
          bounds.extend(f.geometry.coordinates);
        } else if (f.geometry.type === 'Polygon') {
          f.geometry.coordinates[0].forEach(coord => bounds.extend(coord));
        }
      });
      return bounds;
    };

    // --- Map Initialization ---
    const initMap = () => {
      map = new maplibregl.Map({
        container: 'map-container',
        style: 'https://tiles.openfreemap.org/styles/liberty', // Free vector style
        center: [78, 20],
        zoom: 3,
        pitch: 0,
        bearing: 0,
        antialias: true // Needed for 3D buildings
      });

      map.on('load', () => {
        // Add Sources
        map.addSource('countries', {
          type: 'geojson',
          data: geoData.countries
        });

        map.addSource('cities', {
          type: 'geojson',
          data: geoData.cities
        });

        map.addSource('tradeAreas', {
          type: 'geojson',
          data: geoData.tradeAreas
        });

        // --- Layers ---

        // 1. Country View: City Borders
        map.addLayer({
          id: 'cities-fill',
          type: 'fill',
          source: 'cities',
          paint: {
            'fill-color': '#d4af37',
            'fill-opacity': 0.05
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
            'line-opacity': 0.5
          },
          layout: {
            'visibility': 'none'
          }
        });

        // Main Border (Red)
        map.addLayer({
          id: 'cities-border',
          type: 'line',
          source: 'cities',
          paint: {
            'line-color': '#ff3333', // Bright red
            'line-width': 2,
            'line-dasharray': [2, 1] // Dashed effect for "jagged" feel
          },
          layout: {
            'visibility': 'none'
          }
        });

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
                    'minzoom': 13,
                    'paint': {
                        'fill-extrusion-color': '#aaa',
                        'fill-extrusion-height': [
                            'interpolate', ['linear'], ['zoom'],
                            13, 0,
                            13.05, ['get', 'height']
                        ],
                        'fill-extrusion-base': [
                            'interpolate', ['linear'], ['zoom'],
                            13, 0,
                            13.05, ['get', 'min_height']
                        ],
                        'fill-extrusion-opacity': 0.6
                    }
                });
             } catch (e) {
                 console.log("Could not add 3D buildings layer automatically", e);
             }
        }

        // --- Interactions ---
        
        // Country -> City
        map.on('click', 'cities-fill', (e) => {
          const feature = e.features[0];
          loadCityView(feature);
        });
        
        // Also allow clicking on the border
        map.on('click', 'cities-border', (e) => {
            const feature = e.features[0];
            loadCityView(feature);
        });

        // City -> Trade Area
        map.on('click', 'trade-points', (e) => {
          const feature = e.features[0];
          const data = tradeData[feature.properties.id];
          if (data) {
            enterLocationLevel(feature, data);
          }
        });

        // Cursor pointers
        ['cities-fill', 'cities-border', 'trade-points'].forEach(layer => {
          map.on('mouseenter', layer, () => map.getCanvas().style.cursor = 'pointer');
          map.on('mouseleave', layer, () => map.getCanvas().style.cursor = '');
        });

        // Initial View
        loadGlobalView();
      });
    };

    initMap();

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

    // --- Legend Logic ---
    const updateLegend = (level) => {
      legend.classList.add('visible');
      legendContent.innerHTML = '';

      if (level === 'Global') {
        const items = [
          { name: 'India', color: '#FF9933' },
          { name: 'UAE', color: '#00732F' }
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
          legendContent.appendChild(div);
        });

      } else if (level === 'Country') {
        const div = document.createElement('div');
        div.className = 'legend-item';
        div.innerHTML = `<div class="legend-dot" style="background: #ff3333;"></div>City Borders`;
        legendContent.appendChild(div);

      } else if (level === 'City') {
        // List ALL trade areas for this city
        const cityName = breadcrumbs[2]; // Global > Country > City
        const cityTradeAreas = geoData.tradeAreas.features.filter(f => f.properties.city === cityName);
        
        cityTradeAreas.forEach(area => {
          const div = document.createElement('div');
          div.className = 'legend-item';
          div.style.cursor = 'pointer';
          div.innerHTML = `<div class="legend-dot" style="background: ${area.properties.color};"></div>${area.properties.name}`;
          div.onclick = () => {
            const data = tradeData[area.properties.id];
            if (data) enterLocationLevel(area, data);
          };
          legendContent.appendChild(div);
        });
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
      
      // Add Country Markers
      geoData.countries.features.forEach(f => createMarker(f, 'country'));

      // Visibility
      setLayerVisibility(['cities-fill', 'cities-border', 'cities-border-casing', 'cities-label', 'trade-blobs', 'trade-points'], 'none');

      // Camera: Fit to all countries
      const bounds = getBounds(geoData.countries.features);
      map.fitBounds(bounds, {
        padding: 300, // Increased padding for wider perspective
        pitch: 0,
        bearing: 0,
        essential: true
      });
    };

    const loadCountryView = (countryFeature) => {
      currentLevel = 'Country';
      sidebar.classList.remove('visible');
      
      updateBreadcrumbs(['Global', countryFeature.properties.name]);
      updateLegend('Country');
      clearMarkers();

      // Add City Markers
      const countryCities = geoData.cities.features.filter(f => f.properties.country === countryFeature.properties.name);
      countryCities.forEach(f => createMarker(f, 'city'));

      // Visibility
      setLayerVisibility(['cities-fill', 'cities-border', 'cities-border-casing', 'cities-label'], 'visible');
      setLayerVisibility(['trade-blobs', 'trade-points'], 'none');

      // Filter cities by country
      map.setFilter('cities-fill', ['==', 'country', countryFeature.properties.name]);
      map.setFilter('cities-border', ['==', 'country', countryFeature.properties.name]);
      map.setFilter('cities-border-casing', ['==', 'country', countryFeature.properties.name]);
      map.setFilter('cities-label', ['==', 'country', countryFeature.properties.name]);

      // Camera: Fit to all cities in the country
      const bounds = getBounds(countryCities);
      map.fitBounds(bounds, {
        padding: 150, // Increased padding
        pitch: 0,
        bearing: 0,
        essential: true
      });
    };

    const loadCityView = (cityFeature) => {
      currentLevel = 'City';
      sidebar.classList.remove('visible');
      
      updateBreadcrumbs(['Global', cityFeature.properties.country, cityFeature.properties.name]);
      updateLegend('City');
      clearMarkers(); // No markers in city view, just trade areas

      // Visibility
      setLayerVisibility(['cities-fill', 'cities-border', 'cities-border-casing', 'cities-label'], 'visible'); 
      setLayerVisibility(['trade-blobs', 'trade-points'], 'visible');

      // Filter trade areas by city
      map.setFilter('trade-blobs', ['==', 'city', cityFeature.properties.name]);
      map.setFilter('trade-points', ['==', 'city', cityFeature.properties.name]);

      // Camera - 3D View (Zoom INSIDE the city)
      // Calculate centroid for flyTo
      const bounds = getBounds([cityFeature]);
      const center = bounds.getCenter();

      map.flyTo({
        center: center,
        zoom: 13.5, // Street level zoom
        pitch: 50,
        bearing: -10,
        essential: true
      });
    };

    const enterLocationLevel = (feature, data) => {
      map.flyTo({
        center: feature.geometry.coordinates,
        zoom: 16,
        pitch: 60,
        bearing: -30,
        essential: true
      });
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
