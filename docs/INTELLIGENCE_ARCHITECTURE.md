# Intelligence Section Architecture Breakdown

> **Document Purpose**: Reference guide for understanding the architecture, data flow, and component structure of the Intelligence Dashboard feature.

---

## Table of Contents

1. [File Structure](#file-structure)
2. [Core Component: intelligence.js](#core-component-intelligencejs)
3. [Data Layer](#data-layer)
4. [Styling: intelligence.css](#styling-intelligencecss)
5. [Map System](#map-system)
6. [User Flow & State Management](#user-flow--state-management)
7. [Key Functions Reference](#key-functions-reference)

---

## File Structure

```
src/
├── pages/
│   └── intelligence.js          # Main component (1065 lines)
├── data/
│   ├── geoData.js               # Geographic data structures (235 lines)
│   ├── dataManager.js           # CSV loading & data enrichment (108 lines)
│   ├── cityBorders.js           # City polygon coordinates (17,770 lines)
│   ├── pune.geojson             # Pune city border GeoJSON
│   ├── mumbai.geojson           # Mumbai city border GeoJSON
│   └── dubai.geojson            # Dubai city border GeoJSON
├── styles/
│   └── intelligence.css         # Page-specific styles (558 lines)
└── ...

public/
├── india-osm.geojson            # Detailed India country boundary
└── intelligence_data.csv        # Trade area statistics data
```

---

## Core Component: intelligence.js

### Export Structure

The Intelligence page exports a single object with two main methods:

```javascript
export const Intelligence = {
  render: () => { ... },      // Returns HTML template string
  afterRender: async () => { ... }  // Handles all interactivity
}
```

### render() Method (Lines 7-107)

Returns the HTML template containing:

| Element | ID/Class | Purpose |
|---------|----------|---------|
| Top Bar | `#top-bar` | Breadcrumb navigation |
| Map Container | `#map-container` | MapLibre GL map instance |
| Legend | `#legend` | Dynamic layer legend |
| Tip Box | `#tip-box` | User guidance tooltip |
| Watermark Logo | `#watermark-home` | Home navigation link |
| Wizard Overlay | `#wizard-overlay` | 3-slide onboarding wizard |
| Sidebar | `#sidebar` | Trade area detail panel |

### afterRender() Method (Lines 109-1063)

This is the main logic handler. Key sections:

#### State Variables (Lines 113-118)

```javascript
let map;                    // MapLibre instance
let breadcrumbs = ['Global'];  // Navigation path
let userCriteria = {};      // Wizard form data
let currentLevel = 'Global'; // 'Global' | 'Country' | 'City'
let markers = [];           // Active map markers
let hoveredCityId = null;   // Tracks city hover state
```

#### DOM Element References (Lines 120-136)

References to key interactive elements:
- `wizardOverlay`, `topBar`, `btnBack`
- `sidebar`, `sidebarTitle`, `sidebarContent`
- `legend`, `legendContent`
- Form inputs: `inputName`, `inputBrand`, `countrySelect`, `citySelect`

---

## Data Layer

### geoData.js Structure

```javascript
export const geoData = {
  countryPolygons: {         // FeatureCollection for country fills
    features: [
      { name: 'India', color: '#00732F', geometry: Polygon },
      { name: 'UAE', color: '#E40D0D', geometry: Polygon }
    ]
  },
  countries: {               // Country center points
    features: [
      { name: 'India', coordinates: [78.9629, 20.5937] },
      { name: 'UAE', coordinates: [53.8478, 23.4241] }
    ]
  },
  cities: cityBorders,       // Imported from cityBorders.js
  tradeAreas: {              // Trade area point data
    features: [
      { id: 'pune-kp', name: 'Koregaon Park', city: 'Pune', type: 'Premium', ... }
      // ... 20 Pune trade areas
    ]
  }
}

export const tradeData = {}; // Enriched trade area statistics
```

### dataManager.js

Handles CSV data loading and enrichment:

```javascript
export const DataManager = {
  csvData: null,
  
  async loadData() { ... },           // Fetches /intelligence_data.csv
  parseCSV(text) { ... },             // Parses CSV to object
  enrichTradeData() { ... },          // Merges CSV data into tradeData
  getRecommendations(criteria) { ... } // Scoring algorithm for recommendations
}
```

**ID Mapping**: Maps CSV locality names to internal IDs:
```javascript
const ID_MAPPING = {
  "Koregaon Park (KP)": "pune-kp",
  "Viman Nagar": "pune-vn",
  // ... etc
};
```

---

## Styling: intelligence.css

### Key Style Classes

| Class | Purpose |
|-------|---------|
| `.intelligence-page` | Full-screen container, dark theme |
| `.glass-panel` | Glassmorphic effect with blur |
| `#wizard-overlay` | Modal overlay for onboarding |
| `.wizard-card` | Centered wizard container |
| `.wizard-slide` | Individual wizard step |
| `#sidebar` | Right-side detail panel |
| `#legend` | Bottom-left map legend |
| `#top-bar` | Top breadcrumb navigation |

### Theme Colors

- **Primary Gold**: `#d4af37`
- **India Green**: `#00732F`  
- **UAE Red**: `#E40D0D`
- **Glass Background**: `rgba(20, 20, 20, 0.65)`

### Z-Index Hierarchy

```
3002 - Navbar Logo
3001 - Navbar
2501 - Watermark Logo
2000 - Wizard Overlay
1500 - Sidebar
1000 - Legend, Top Bar, Tip Box
1    - Map Container
```

---

## Map System

### Map Initialization (Lines 156-587)

Uses **MapLibre GL** with OpenFreeMap tiles:

```javascript
map = new maplibregl.Map({
  container: 'map-container',
  style: 'https://tiles.openfreemap.org/styles/liberty',
  center: [78, 20],
  zoom: 3,
  pitch: 0,
  bearing: 0,
  antialias: true
});
```

### Map Sources (Lines 174-200)

| Source ID | Type | Data |
|-----------|------|------|
| `indiaOSM` | GeoJSON | `/india-osm.geojson` (detailed India border) |
| `countryPolygons` | GeoJSON | `geoData.countryPolygons` |
| `countries` | GeoJSON | `geoData.countries` |
| `cities` | GeoJSON | `geoData.cities` (with `promoteId: 'name'`) |
| `tradeAreas` | GeoJSON | `geoData.tradeAreas` |

### Map Layers (Lines 202-405)

| Layer ID | Type | View Level | Purpose |
|----------|------|------------|---------|
| `country-fill` | fill | Global | UAE country overlay (gradient) |
| `india-fill` | fill | Global | India country overlay |
| `cities-fill` | fill | Country | City area fill (clickable) |
| `cities-glow` | line | Country | City border glow effect |
| `cities-border-casing` | line | Country | White border outline |
| `cities-border` | line | Country | Colored city border |
| `cities-label` | symbol | Country | City name labels |
| `trade-blobs` | circle | City | Heatmap-style trade area blobs |
| `trade-points` | circle | City | Clickable trade area points |
| `3d-buildings` | fill-extrusion | City | 3D building extrusions |

### Layer Visibility Management

```javascript
const setLayerVisibility = (layerIds, visibility) => {
  layerIds.forEach(id => {
    if (map.getLayer(id)) {
      map.setLayoutProperty(id, 'visibility', visibility);
    }
  });
};
```

---

## User Flow & State Management

### Navigation Hierarchy

```
Global View (zoom: fit countries)
    │
    ├─── Click Country ──→ Country View (zoom: fit cities)
    │                          │
    │                          └─── Click City ──→ City View (zoom: 12, pitch: 70°)
    │                                                   │
    │                                                   └─── Click Trade Area ──→ Street View (zoom: 16, pitch: 100°)
    │
    └─── Back Button / Breadcrumb Navigation
```

### View Loaders

| Function | Lines | Purpose |
|----------|-------|---------|
| `loadGlobalView()` | 786-822 | Reset to world view, show countries |
| `loadCountryView(countryFeature)` | 824-869 | Zoom to country, show cities |
| `loadCityView(cityFeature)` | 871-901 | Zoom into city, show trade areas |
| `enterLocationLevel(feature, data)` | 903-912 | Street-level zoom, open sidebar |

### Breadcrumb System

```javascript
const updateBreadcrumbs = (path) => {
  breadcrumbs = path;  // e.g., ['Global', 'India', 'Pune']
  // Updates DOM and shows/hides back button
};

const navigateTo = (levelIndex) => {
  // Handles breadcrumb click navigation
};
```

### Wizard Flow (Lines 955-1055)

**Slide 1**: Identity
- Name input
- Brand input

**Slide 2**: Geography
- Country select (India/UAE)
- City select (dynamic based on country)
- "Personalize My View" → Slide 3
- "Launch Satellite View" → Skip to Global View

**Slide 3**: Criteria
- Sector select (Retail/F&B/Fashion)
- AOV select (High/Medium)
- "Initialize Dashboard" → Submit form & show city view

### Form Submission (Lines 1007-1055)

Data is submitted to FormSubmit.co:
```javascript
fetch("https://formsubmit.co/ajax/info@foottfall.com", {
  method: "POST",
  body: formData  // name, brand, country, city, sector, aov
});
```

---

## Key Functions Reference

### Helper Functions

| Function | Lines | Purpose |
|----------|-------|---------|
| `getBounds(features)` | 138-153 | Calculate bounds from Point/Polygon/MultiPolygon features |
| `initMap()` | 155-587 | Initialize map with all sources, layers, and interactions |
| `clearMarkers()` | 591-595 | Remove all markers from map |
| `createMarker(feature, type)` | 597-638 | Create custom marker element |
| `updateLegend(level)` | 640-693 | Update legend content based on view level |

### Navigation Functions

| Function | Lines | Purpose |
|----------|-------|---------|
| `updateBreadcrumbs(path)` | 721-753 | Update breadcrumb DOM and visibility |
| `navigateTo(levelIndex)` | 755-767 | Navigate to specific breadcrumb level |
| `setLayerVisibility(layerIds, visibility)` | 778-784 | Toggle map layer visibility |

### View Functions

| Function | Lines | Purpose |
|----------|-------|---------|
| `loadGlobalView()` | 786-822 | Show global view with countries |
| `loadCountryView(countryFeature)` | 824-869 | Show country with cities |
| `loadCityView(cityFeature)` | 871-901 | Show city with trade areas |
| `enterLocationLevel(feature, data)` | 903-912 | Zoom to trade area, open sidebar |

### UI Functions

| Function | Lines | Purpose |
|----------|-------|---------|
| `openSidebar(data)` | 914-953 | Populate and show sidebar with trade area data |

---

## Event Handlers Summary

### Map Interactions

| Event | Layer | Action |
|-------|-------|--------|
| `mouseenter` | `country-fill`, `india-fill` | Show hover effect, update legend |
| `mouseleave` | `country-fill`, `india-fill` | Reset opacity, restore legend |
| `click` | `country-fill`, `india-fill` | Navigate to country view |
| `mousemove` | `cities-fill` | Set hover state for fill opacity |
| `mouseleave` | `cities-fill` | Clear hover state |
| `click` | `cities-fill`, `cities-border` | Navigate to city view |
| `click` | `trade-points` | Enter street view, open sidebar |

### Wizard Buttons

| Button ID | Action |
|-----------|--------|
| `btn-next-1` | Validate name, go to Slide 2 |
| `btn-back-2` | Go back to Slide 1 |
| `btn-next-2` | Preload city, go to Slide 3 |
| `btn-back-3` | Go back to Slide 2 |
| `btn-explore-all` | Hide wizard, show global view |
| `btn-finish` | Submit form, initialize dashboard |

---

## Data Flow Diagram

```
┌─────────────────────┐
│  intelligence.js    │
│     afterRender()   │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│  DataManager.       │
│  loadData()         │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐     ┌─────────────────────┐
│ /intelligence_      │────▶│  DataManager.       │
│  data.csv           │     │  parseCSV()         │
└─────────────────────┘     └─────────┬───────────┘
                                      │
                                      ▼
┌─────────────────────┐     ┌─────────────────────┐
│  geoData.js         │────▶│  DataManager.       │
│  tradeData{}        │◀────│  enrichTradeData()  │
└─────────────────────┘     └─────────────────────┘
          │
          ▼
┌─────────────────────┐
│  Map Sources        │
│  - countryPolygons  │
│  - cities           │
│  - tradeAreas       │
└─────────────────────┘
          │
          ▼
┌─────────────────────┐
│  Map Layers         │
│  Rendered on map    │
└─────────────────────┘
```

---

## Current Limitations / Technical Debt

1. **Large cityBorders.js file** (17,770 lines) - loaded synchronously
2. **Single file component** - `intelligence.js` is 1065 lines with all logic
3. **Hardcoded trade area data** - only Pune has detailed coverage
4. **Form submission** - sends to external FormSubmit.co service
5. **State management** - uses local variables, no global state
6. **City data** - Mumbai and Dubai GeoJSON files exist but may not have full trade area data

---

## Quick Reference: Adding New Content

### Adding a New Country

1. Add polygon to `geoData.countryPolygons.features`
2. Add center point to `geoData.countries.features`
3. Add map layer or modify existing `country-fill` filter
4. Update legend in `updateLegend('Global')`

### Adding a New City

1. Create or add GeoJSON data to `cityBorders.js`
2. Ensure `properties.country` matches parent country name
3. Ensure `properties.color` is set

### Adding New Trade Areas

1. Add feature to `geoData.tradeAreas.features`
2. Add ID mapping in `dataManager.js` `ID_MAPPING`
3. Add data row in `intelligence_data.csv`
