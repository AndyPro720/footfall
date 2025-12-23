import { geoData, tradeData } from './geoData.js';

// Mapping CSV Locality names to our GeoJSON IDs
const ID_MAPPING = {
  "Koregaon Park (KP)": "pune-kp",
  "Viman Nagar": "pune-vn",
  "Hinjewadi": "pune-hj",
  "Kharadi": "pune-kh", // Assuming we might add these later
  "Baner–Balewadi": "pune-bb",
  "Kalyani Nagar": "pune-kn",
  "Aundh": "pune-au",
  "Magarpatta": "pune-mg",
  "Wakad": "pune-wk",
  "Deccan Gymkhana": "pune-dg",
  "Shivajinagar": "pune-sn",
  "Hadapsar": "pune-hd",
  "Bund Garden": "pune-bg",
  "Camp": "pune-cp",
  "NIBM": "pune-nb",
  "Erandwane": "pune-er",
  "Chinchwad": "pune-ch",
  "Kothrud": "pune-kt",
  "SB / University area": "pune-sb",
  "Bavdhan": "pune-bv"
};

export const DataManager = {
  csvData: null,

  // DEPRECATED: Data is now pre-generated at build time via scripts/generate-geo-data.js
  async loadData() {
    console.log('✅ specific trade data loaded from build.');
    return true;
  },

  enrichTradeData() {
    // No-op: Data is already enriched in geoData.js
  },

  getRecommendations(criteria) {
    // Simple scoring logic based on criteria
    // criteria: { sector: 'retail'|'fnb', aov: 'high'|'med', age: 'young'|'family' }
    
    return Object.keys(tradeData).map(id => {
      const area = tradeData[id];
      let score = 0;

      // AOV Matching
      if (criteria.aov === 'high') {
        if (area.type.includes('Premium') || area.type.includes('Luxury')) score += 50;
        if (area.stats.spend && area.stats.spend.includes('4,000')) score += 30;
      } else if (criteria.aov === 'med') {
        if (area.type.includes('Mid-Market') || area.type.includes('High Street')) score += 50;
      }

      // Sector Matching (Mock logic as we don't have deep sector data yet)
      if (criteria.sector === 'fnb') {
        if (area.brands.some(b => ['Starbucks', 'McDonalds', 'Subway'].includes(b))) score += 20;
      }

      return { id, score, ...area };
    }).sort((a, b) => b.score - a.score);
  }
};
