export const geoData = {
  countries: {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "properties": { "name": "India", "color": "#FF9933" }, // Saffron
        "geometry": { "type": "Point", "coordinates": [78.9629, 20.5937] }
      },
      {
        "type": "Feature",
        "properties": { "name": "UAE", "color": "#00732F" }, // Green
        "geometry": { "type": "Point", "coordinates": [53.8478, 23.4241] }
      }
    ]
  },
  cities: {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "properties": { "name": "Pune", "country": "India", "color": "#FF9933" },
        "geometry": { 
          "type": "Polygon", 
          "coordinates": [[
            [73.75, 18.45], 
            [73.80, 18.42], 
            [73.85, 18.44], 
            [73.92, 18.41], 
            [74.00, 18.45], 
            [74.05, 18.50], 
            [74.02, 18.58], 
            [73.98, 18.62], 
            [73.90, 18.65], 
            [73.82, 18.63], 
            [73.75, 18.60], 
            [73.72, 18.52], 
            [73.75, 18.45]
          ]] 
        }
      },
      {
        "type": "Feature",
        "properties": { "name": "Mumbai", "country": "India", "color": "#138808" },
        "geometry": { 
          "type": "Polygon", 
          "coordinates": [[[72.75, 18.85], [73.00, 18.85], [73.00, 19.30], [72.75, 19.30], [72.75, 18.85]]] 
        }
      },
      {
        "type": "Feature",
        "properties": { "name": "Dubai", "country": "UAE", "color": "#CE1126" },
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
      // --- Pune Locations (Corrected to [Lng, Lat]) ---
      { "type": "Feature", "properties": { "id": "pune-kp", "name": "Koregaon Park", "city": "Pune", "type": "Premium", "color": "#FFD700" }, "geometry": { "type": "Point", "coordinates": [73.8939, 18.5362] } }, // Gold
      { "type": "Feature", "properties": { "id": "pune-vn", "name": "Viman Nagar", "city": "Pune", "type": "High Street", "color": "#00BFFF" }, "geometry": { "type": "Point", "coordinates": [73.9143, 18.5679] } }, // Deep Sky Blue
      { "type": "Feature", "properties": { "id": "pune-kn", "name": "Kalyani Nagar", "city": "Pune", "type": "Premium", "color": "#FF69B4" }, "geometry": { "type": "Point", "coordinates": [73.9033, 18.5463] } }, // Hot Pink
      { "type": "Feature", "properties": { "id": "pune-kh", "name": "Kharadi", "city": "Pune", "type": "IT Hub", "color": "#32CD32" }, "geometry": { "type": "Point", "coordinates": [73.9348, 18.5514] } }, // Lime Green
      { "type": "Feature", "properties": { "id": "pune-bb", "name": "Baner–Balewadi", "city": "Pune", "type": "High Street", "color": "#FF4500" }, "geometry": { "type": "Point", "coordinates": [73.7868, 18.5590] } }, // Orange Red
      { "type": "Feature", "properties": { "id": "pune-hj", "name": "Hinjewadi", "city": "Pune", "type": "IT Hub", "color": "#8A2BE2" }, "geometry": { "type": "Point", "coordinates": [73.7389, 18.5913] } }, // Blue Violet
      { "type": "Feature", "properties": { "id": "pune-au", "name": "Aundh", "city": "Pune", "type": "Residential", "color": "#20B2AA" }, "geometry": { "type": "Point", "coordinates": [73.8075, 18.5580] } }, // Light Sea Green
      { "type": "Feature", "properties": { "id": "pune-wk", "name": "Wakad", "city": "Pune", "type": "Residential", "color": "#9370DB" }, "geometry": { "type": "Point", "coordinates": [73.7658, 18.5987] } }, // Medium Purple
      { "type": "Feature", "properties": { "id": "pune-dg", "name": "Deccan Gymkhana", "city": "Pune", "type": "Central", "color": "#DC143C" }, "geometry": { "type": "Point", "coordinates": [73.8422, 18.5158] } }, // Crimson
      { "type": "Feature", "properties": { "id": "pune-sn", "name": "Shivajinagar", "city": "Pune", "type": "Central", "color": "#00008B" }, "geometry": { "type": "Point", "coordinates": [73.8446, 18.5314] } }, // Dark Blue
      { "type": "Feature", "properties": { "id": "pune-hd", "name": "Hadapsar", "city": "Pune", "type": "IT Hub", "color": "#2E8B57" }, "geometry": { "type": "Point", "coordinates": [73.9259, 18.5089] } }, // Sea Green
      { "type": "Feature", "properties": { "id": "pune-bg", "name": "Bund Garden", "city": "Pune", "type": "Central", "color": "#B8860B" }, "geometry": { "type": "Point", "coordinates": [73.8777, 18.5367] } }, // Dark Goldenrod
      { "type": "Feature", "properties": { "id": "pune-cp", "name": "Camp", "city": "Pune", "type": "High Street", "color": "#FF6347" }, "geometry": { "type": "Point", "coordinates": [73.8777, 18.5133] } }, // Tomato
      { "type": "Feature", "properties": { "id": "pune-nb", "name": "NIBM", "city": "Pune", "type": "Residential", "color": "#4682B4" }, "geometry": { "type": "Point", "coordinates": [73.8980, 18.4760] } }, // Steel Blue
      { "type": "Feature", "properties": { "id": "pune-er", "name": "Erandwane", "city": "Pune", "type": "Residential", "color": "#D2691E" }, "geometry": { "type": "Point", "coordinates": [73.8327, 18.5074] } }, // Chocolate
      { "type": "Feature", "properties": { "id": "pune-ch", "name": "Chinchwad", "city": "Pune", "type": "Industrial", "color": "#708090" }, "geometry": { "type": "Point", "coordinates": [73.7997, 18.6298] } }, // Slate Gray
      { "type": "Feature", "properties": { "id": "pune-kt", "name": "Kothrud", "city": "Pune", "type": "Residential", "color": "#CD5C5C" }, "geometry": { "type": "Point", "coordinates": [73.8077, 18.5074] } }, // Indian Red
      { "type": "Feature", "properties": { "id": "pune-sb", "name": "SB / University", "city": "Pune", "type": "Institutional", "color": "#4B0082" }, "geometry": { "type": "Point", "coordinates": [73.8286, 18.5390] } }, // Indigo
      { "type": "Feature", "properties": { "id": "pune-bv", "name": "Bavdhan", "city": "Pune", "type": "Residential", "color": "#556B2F" }, "geometry": { "type": "Point", "coordinates": [73.7747, 18.5123] } }, // Dark Olive Green
      { "type": "Feature", "properties": { "id": "pune-bw", "name": "Bibwewadi", "city": "Pune", "type": "Residential", "color": "#8B4513" }, "geometry": { "type": "Point", "coordinates": [73.8641, 18.4690] } }  // Saddle Brown
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
