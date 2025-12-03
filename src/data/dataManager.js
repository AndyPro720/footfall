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

  async loadData() {
    try {
      const response = await fetch('/intelligence_data.csv');
      const text = await response.text();
      this.csvData = this.parseCSV(text);
      this.enrichTradeData();
      return true;
    } catch (e) {
      console.error("Failed to load CSV data:", e);
      return false;
    }
  },

  parseCSV(text) {
    const lines = text.split('\n');
    // Data starts from line 4 (index 3) based on file inspection
    // Header: Locality, Avg Residential Rent / Month (₹), Est. Spend per Visit (₹)
    const data = {};
    
    for (let i = 3; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      // Simple CSV regex to handle quoted values
      const matches = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
      if (!matches || matches.length < 3) continue;

      const locality = matches[0].replace(/"/g, '').trim();
      const rent = matches[1].replace(/"/g, '').trim();
      const spend = matches[2].replace(/"/g, '').trim();

      data[locality] = { rent, spend };
    }
    return data;
  },

  enrichTradeData() {
    if (!this.csvData) return;

    // Iterate over our hardcoded tradeData and enrich it if we find a match
    Object.keys(tradeData).forEach(id => {
      // Find which CSV locality maps to this ID
      const csvName = Object.keys(ID_MAPPING).find(key => ID_MAPPING[key] === id);
      
      if (csvName && this.csvData[csvName]) {
        const enriched = this.csvData[csvName];
        tradeData[id].stats.rent = enriched.rent; // Overwrite mock rent
        tradeData[id].stats.spend = enriched.spend; // Add spend data
        tradeData[id].csvMatch = true;
      }
    });
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
