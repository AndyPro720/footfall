export const geoData = {
  countries: {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "properties": { "name": "India" },
        "geometry": { "type": "Point", "coordinates": [20.5937, 78.9629] }
      },
      {
        "type": "Feature",
        "properties": { "name": "UAE" },
        "geometry": { "type": "Point", "coordinates": [23.4241, 53.8478] }
      }
    ]
  },
  cities: {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "properties": { "name": "Pune", "country": "India" },
        "geometry": { 
          "type": "Polygon", 
          "coordinates": [[[73.75, 18.45], [74.00, 18.45], [74.00, 18.65], [73.75, 18.65], [73.75, 18.45]]] 
        }
      },
      {
        "type": "Feature",
        "properties": { "name": "Mumbai", "country": "India" },
        "geometry": { 
          "type": "Polygon", 
          "coordinates": [[[72.75, 18.85], [73.00, 18.85], [73.00, 19.30], [72.75, 19.30], [72.75, 18.85]]] 
        }
      },
      {
        "type": "Feature",
        "properties": { "name": "Dubai", "country": "UAE" },
        "geometry": { 
          "type": "Polygon", 
          "coordinates": [[[55.10, 24.90], [55.40, 24.90], [55.40, 25.35], [55.10, 25.35], [55.10, 24.90]]] 
        }
      }
    ]
  },
  tradeAreas: {
    "type": "FeatureCollection",
    "features": [
      // --- Pune Locations (Matching CSV) ---
      { "type": "Feature", "properties": { "id": "pune-kp", "name": "Koregaon Park", "city": "Pune", "type": "Premium" }, "geometry": { "type": "Point", "coordinates": [18.5362, 73.8939] } },
      { "type": "Feature", "properties": { "id": "pune-vn", "name": "Viman Nagar", "city": "Pune", "type": "High Street" }, "geometry": { "type": "Point", "coordinates": [18.5679, 73.9143] } },
      { "type": "Feature", "properties": { "id": "pune-kn", "name": "Kalyani Nagar", "city": "Pune", "type": "Premium" }, "geometry": { "type": "Point", "coordinates": [18.5463, 73.9033] } },
      { "type": "Feature", "properties": { "id": "pune-kh", "name": "Kharadi", "city": "Pune", "type": "IT Hub" }, "geometry": { "type": "Point", "coordinates": [18.5514, 73.9348] } },
      { "type": "Feature", "properties": { "id": "pune-bb", "name": "Baner–Balewadi", "city": "Pune", "type": "High Street" }, "geometry": { "type": "Point", "coordinates": [18.5590, 73.7868] } },
      { "type": "Feature", "properties": { "id": "pune-hj", "name": "Hinjewadi", "city": "Pune", "type": "IT Hub" }, "geometry": { "type": "Point", "coordinates": [18.5913, 73.7389] } },
      { "type": "Feature", "properties": { "id": "pune-au", "name": "Aundh", "city": "Pune", "type": "Residential" }, "geometry": { "type": "Point", "coordinates": [18.5580, 73.8075] } },
      { "type": "Feature", "properties": { "id": "pune-wk", "name": "Wakad", "city": "Pune", "type": "Residential" }, "geometry": { "type": "Point", "coordinates": [18.5987, 73.7658] } },
      { "type": "Feature", "properties": { "id": "pune-dg", "name": "Deccan Gymkhana", "city": "Pune", "type": "Central" }, "geometry": { "type": "Point", "coordinates": [18.5158, 73.8422] } },
      { "type": "Feature", "properties": { "id": "pune-sn", "name": "Shivajinagar", "city": "Pune", "type": "Central" }, "geometry": { "type": "Point", "coordinates": [18.5314, 73.8446] } },
      { "type": "Feature", "properties": { "id": "pune-hd", "name": "Hadapsar", "city": "Pune", "type": "IT Hub" }, "geometry": { "type": "Point", "coordinates": [18.5089, 73.9259] } },
      { "type": "Feature", "properties": { "id": "pune-bg", "name": "Bund Garden", "city": "Pune", "type": "Central" }, "geometry": { "type": "Point", "coordinates": [18.5367, 73.8777] } },
      { "type": "Feature", "properties": { "id": "pune-cp", "name": "Camp", "city": "Pune", "type": "High Street" }, "geometry": { "type": "Point", "coordinates": [18.5133, 73.8777] } },
      { "type": "Feature", "properties": { "id": "pune-nb", "name": "NIBM", "city": "Pune", "type": "Residential" }, "geometry": { "type": "Point", "coordinates": [18.4760, 73.8980] } },
      { "type": "Feature", "properties": { "id": "pune-er", "name": "Erandwane", "city": "Pune", "type": "Residential" }, "geometry": { "type": "Point", "coordinates": [18.5074, 73.8327] } },
      { "type": "Feature", "properties": { "id": "pune-ch", "name": "Chinchwad", "city": "Pune", "type": "Industrial" }, "geometry": { "type": "Point", "coordinates": [18.6298, 73.7997] } },
      { "type": "Feature", "properties": { "id": "pune-kt", "name": "Kothrud", "city": "Pune", "type": "Residential" }, "geometry": { "type": "Point", "coordinates": [18.5074, 73.8077] } },
      { "type": "Feature", "properties": { "id": "pune-sb", "name": "SB / University", "city": "Pune", "type": "Institutional" }, "geometry": { "type": "Point", "coordinates": [18.5390, 73.8286] } },
      { "type": "Feature", "properties": { "id": "pune-bv", "name": "Bavdhan", "city": "Pune", "type": "Residential" }, "geometry": { "type": "Point", "coordinates": [18.5123, 73.7747] } },
      { "type": "Feature", "properties": { "id": "pune-bw", "name": "Bibwewadi", "city": "Pune", "type": "Residential" }, "geometry": { "type": "Point", "coordinates": [18.4690, 73.8641] } }
    ]
  }
};

// Default mock data structure (to be enriched by CSV)
export const tradeData = {};
geoData.tradeAreas.features.forEach(f => {
  tradeData[f.properties.id] = {
    name: f.properties.name,
    city: f.properties.city,
    type: f.properties.type,
    stats: { footfall: "25,000+", rent: "Loading...", spend: "Loading..." },
    demographics: { age: "25-40", segment: "Young Professionals" },
    brands: ["Starbucks", "McDonalds", "Zudio", "Croma"]
  };
});
