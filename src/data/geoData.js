import { cityBorders } from './cityBorders.js';

export const geoData = {
  // Country Polygons (for gradient highlighting)
  countryPolygons: {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "properties": { "name": "India", "color": "#00732F" },
        "geometry": {
          "type": "Polygon",
          "coordinates": [[
            [68.176645, 23.694836],
            [68.842599, 24.266390],
            [71.043732, 27.995372],
            [73.749992, 34.322010],
            [77.837451, 35.494009],
            [78.912269, 34.321936],
            [79.208892, 33.946193],
            [79.530449, 32.749943],
            [79.918659, 32.480934],
            [80.088425, 32.919908],
            [80.476721, 32.617968],
            [80.741858, 32.303899],
            [81.028528, 30.904115],
            [81.111256, 30.183481],
            [81.525804, 30.422717],
            [82.061203, 30.327405],
            [82.192792, 29.913179],
            [82.735083, 29.654116],
            [83.304249, 29.362595],
            [83.935115, 29.320226],
            [84.228463, 28.919896],
            [84.675018, 28.734901],
            [85.118767, 28.604384],
            [85.251779, 28.326198],
            [85.649585, 28.244844],
            [86.139237, 28.020946],
            [86.610366, 28.088802],
            [87.023364, 27.938374],
            [87.227472, 27.897898],
            [87.669548, 27.844812],
            [88.060238, 27.914615],
            [88.174804, 27.810405],
            [88.043133, 27.445819],
            [88.120441, 27.876542],
            [88.730326, 28.086865],
            [88.814248, 27.299316],
            [88.835643, 27.098966],
            [89.744528, 26.719403],
            [90.373275, 26.875724],
            [91.217513, 26.808648],
            [92.033484, 26.838310],
            [92.103712, 27.452614],
            [91.696657, 27.771742],
            [92.503119, 27.896876],
            [93.413348, 28.640629],
            [94.566462, 29.277438],
            [95.404802, 29.031717],
            [96.248833, 29.452802],
            [96.586591, 28.830980],
            [96.248833, 28.411030],
            [97.327114, 28.261583],
            [97.402561, 27.882536],
            [97.051989, 27.699059],
            [97.133999, 27.083774],
            [96.419366, 27.264589],
            [95.124768, 26.573572],
            [95.155153, 26.001307],
            [94.603249, 25.162495],
            [94.552658, 24.675238],
            [94.106742, 23.850741],
            [93.325188, 24.078556],
            [93.286327, 23.043658],
            [93.060294, 22.703111],
            [93.166128, 22.278459],
            [92.672721, 22.041239],
            [92.146035, 23.627499],
            [91.869928, 23.624346],
            [91.706475, 22.985264],
            [91.158963, 23.503527],
            [91.46773, 24.072639],
            [91.915093, 24.130414],
            [92.376202, 24.976693],
            [91.799596, 25.147432],
            [90.872211, 25.132601],
            [89.920693, 25.26975],
            [89.832481, 25.965082],
            [89.355094, 26.014407],
            [88.563049, 26.446526],
            [88.209789, 25.768066],
            [88.931554, 25.238692],
            [88.306373, 24.866079],
            [88.084422, 24.501657],
            [88.69994, 24.233715],
            [88.52977, 23.631142],
            [88.876312, 22.879146],
            [89.031961, 22.055708],
            [88.888766, 21.690588],
            [88.208497, 21.703172],
            [86.975704, 21.495562],
            [87.033169, 20.743308],
            [86.499351, 20.151638],
            [85.060266, 19.478579],
            [83.941006, 18.30201],
            [83.189217, 17.671221],
            [82.192792, 17.016636],
            [82.191242, 16.556664],
            [81.692719, 16.310219],
            [80.791999, 15.951972],
            [80.324896, 15.899185],
            [80.025069, 15.136415],
            [80.233274, 13.835771],
            [80.286294, 13.006261],
            [79.862547, 12.056215],
            [79.857999, 10.357275],
            [79.340512, 10.308854],
            [78.885345, 9.546136],
            [79.189722, 9.216544],
            [78.277941, 8.933047],
            [77.941165, 8.252959],
            [77.539898, 7.965535],
            [76.592979, 8.899276],
            [75.746467, 11.308251],
            [75.396101, 11.781245],
            [74.864816, 12.741936],
            [74.616717, 13.992583],
            [74.443859, 14.617222],
            [73.534199, 15.990652],
            [73.119909, 17.92857],
            [72.820909, 19.208234],
            [72.824475, 20.419503],
            [72.630533, 21.356009],
            [72.105851, 21.698184],
            [71.175273, 20.757441],
            [70.470459, 20.877331],
            [69.16413, 22.089298],
            [69.644928, 22.450775],
            [69.349597, 22.843176],
            [68.176645, 23.694836]
          ]]
        }
      },
      {
        "type": "Feature",
        "properties": { "name": "UAE", "color": "#E40D0D" },
        "geometry": {
          "type": "Polygon",
          "coordinates": [[
            [51.579519, 24.245497],
            [51.757441, 24.294073],
            [51.794389, 24.019826],
            [52.577081, 24.177439],
            [53.404007, 24.151317],
            [54.008001, 24.121758],
            [54.693024, 24.797892],
            [55.439025, 25.439145],
            [56.070821, 26.055464],
            [56.261042, 25.714606],
            [56.396847, 24.924732],
            [55.886233, 24.920831],
            [55.804119, 24.269604],
            [55.981214, 24.130543],
            [55.528632, 23.933604],
            [55.525841, 23.524869],
            [55.234489, 23.110993],
            [55.208341, 22.70833],
            [55.006803, 22.496948],
            [52.000733, 23.001154],
            [51.617708, 24.014219],
            [51.579519, 24.245497]
          ]]
        }
      }
    ]
  },
  // Country Center Points (for pin placement)
  countries: {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "properties": { "name": "India", "color": "#00732F" }, // Green
        "geometry": { "type": "Point", "coordinates": [78.9629, 20.5937] }
      },
      {
        "type": "Feature",
        "properties": { "name": "UAE", "color": "#E40D0D" }, // Red
        "geometry": { "type": "Point", "coordinates": [53.8478, 23.4241] }
      }
    ]
  },
  cities: {
    ...cityBorders,
    features: cityBorders.features.map(f => {
      // Assign colors per city
      const cityColors = {
        'Pune': '#0891b2',    // Teal - visible on white
        'Mumbai': '#00732F',  // Green
        'Dubai': '#8B0000'    // Dark red
      };
      return {
        ...f,
        properties: {
          ...f.properties,
          color: cityColors[f.properties.name] || '#00732F'
        },
        geometry: f.geometry || f.properties.geojson
      };
    })
  },
   tradeAreas: {
    "type": "FeatureCollection",
    "features": [
      // --- Pune Locations ---
      // Premium: Gold (#D4AF37)
      { "type": "Feature", "properties": { "id": "pune-kp", "name": "Koregaon Park", "city": "Pune", "type": "Premium", "color": "#D4AF37" }, "geometry": { "type": "Point", "coordinates": [73.8939, 18.5362] } },
      { "type": "Feature", "properties": { "id": "pune-kn", "name": "Kalyani Nagar", "city": "Pune", "type": "Premium", "color": "#D4AF37" }, "geometry": { "type": "Point", "coordinates": [73.9033, 18.5463] } },
      
      // High Street: Coral Red (#FF6B6B)
      { "type": "Feature", "properties": { "id": "pune-vn", "name": "Viman Nagar", "city": "Pune", "type": "High Street", "color": "#FF6B6B" }, "geometry": { "type": "Point", "coordinates": [73.9143, 18.5679] } },
      { "type": "Feature", "properties": { "id": "pune-bb", "name": "Baner–Balewadi", "city": "Pune", "type": "High Street", "color": "#FF6B6B" }, "geometry": { "type": "Point", "coordinates": [73.7868, 18.5590] } },
      { "type": "Feature", "properties": { "id": "pune-cp", "name": "Camp", "city": "Pune", "type": "High Street", "color": "#FF6B6B" }, "geometry": { "type": "Point", "coordinates": [73.8777, 18.5133] } },
      
      // IT Hub: Teal (#00D1B2)
      { "type": "Feature", "properties": { "id": "pune-kh", "name": "Kharadi", "city": "Pune", "type": "IT Hub", "color": "#00D1B2" }, "geometry": { "type": "Point", "coordinates": [73.9348, 18.5514] } },
      { "type": "Feature", "properties": { "id": "pune-hj", "name": "Hinjewadi", "city": "Pune", "type": "IT Hub", "color": "#00D1B2" }, "geometry": { "type": "Point", "coordinates": [73.7389, 18.5913] } },
      { "type": "Feature", "properties": { "id": "pune-hd", "name": "Hadapsar", "city": "Pune", "type": "IT Hub", "color": "#00D1B2" }, "geometry": { "type": "Point", "coordinates": [73.9259, 18.5089] } },
      
      // Residential: Blue (#4A90E2)
      { "type": "Feature", "properties": { "id": "pune-au", "name": "Aundh", "city": "Pune", "type": "Residential", "color": "#4A90E2" }, "geometry": { "type": "Point", "coordinates": [73.8075, 18.5580] } },
      { "type": "Feature", "properties": { "id": "pune-wk", "name": "Wakad", "city": "Pune", "type": "Residential", "color": "#4A90E2" }, "geometry": { "type": "Point", "coordinates": [73.7658, 18.5987] } },
      { "type": "Feature", "properties": { "id": "pune-nb", "name": "NIBM", "city": "Pune", "type": "Residential", "color": "#4A90E2" }, "geometry": { "type": "Point", "coordinates": [73.8980, 18.4760] } },
      { "type": "Feature", "properties": { "id": "pune-er", "name": "Erandwane", "city": "Pune", "type": "Residential", "color": "#4A90E2" }, "geometry": { "type": "Point", "coordinates": [73.8327, 18.5074] } },
      { "type": "Feature", "properties": { "id": "pune-kt", "name": "Kothrud", "city": "Pune", "type": "Residential", "color": "#4A90E2" }, "geometry": { "type": "Point", "coordinates": [73.8077, 18.5074] } },
      { "type": "Feature", "properties": { "id": "pune-bv", "name": "Bavdhan", "city": "Pune", "type": "Residential", "color": "#4A90E2" }, "geometry": { "type": "Point", "coordinates": [73.7747, 18.5123] } },
      { "type": "Feature", "properties": { "id": "pune-bw", "name": "Bibwewadi", "city": "Pune", "type": "Residential", "color": "#4A90E2" }, "geometry": { "type": "Point", "coordinates": [73.8641, 18.4690] } },
      
      // Central: Purple (#9B59B6)
      { "type": "Feature", "properties": { "id": "pune-dg", "name": "Deccan Gymkhana", "city": "Pune", "type": "Central", "color": "#9B59B6" }, "geometry": { "type": "Point", "coordinates": [73.8422, 18.5158] } },
      { "type": "Feature", "properties": { "id": "pune-sn", "name": "Shivajinagar", "city": "Pune", "type": "Central", "color": "#9B59B6" }, "geometry": { "type": "Point", "coordinates": [73.8446, 18.5314] } },
      { "type": "Feature", "properties": { "id": "pune-bg", "name": "Bund Garden", "city": "Pune", "type": "Central", "color": "#9B59B6" }, "geometry": { "type": "Point", "coordinates": [73.8777, 18.5367] } },
      
      // Industrial: Grey (#7F8C8D)
      { "type": "Feature", "properties": { "id": "pune-ch", "name": "Chinchwad", "city": "Pune", "type": "Industrial", "color": "#CD7F32" }, "geometry": { "type": "Point", "coordinates": [73.7997, 18.6298] } },
      
      // Institutional: Orange (#E67E22)
      { "type": "Feature", "properties": { "id": "pune-sb", "name": "SB / University", "city": "Pune", "type": "Institutional", "color": "#E67E22" }, "geometry": { "type": "Point", "coordinates": [73.8286, 18.5390] } },
      
      // --- Dubai Locations ---
      // Premium: Gold (#D4AF37)
      { "type": "Feature", "properties": { "id": "dubai-dm", "name": "Dubai Mall", "city": "Dubai", "type": "Premium", "color": "#D4AF37" }, "geometry": { "type": "Point", "coordinates": [55.2796, 25.1972] } },
      { "type": "Feature", "properties": { "id": "dubai-jbr", "name": "JBR Walk", "city": "Dubai", "type": "Premium", "color": "#D4AF37" }, "geometry": { "type": "Point", "coordinates": [55.1325, 25.0765] } },
      
      // High Street: Coral Red (#FF6B6B)
      { "type": "Feature", "properties": { "id": "dubai-dxb", "name": "Downtown Dubai", "city": "Dubai", "type": "High Street", "color": "#FF6B6B" }, "geometry": { "type": "Point", "coordinates": [55.2708, 25.2048] } },
      { "type": "Feature", "properties": { "id": "dubai-moe", "name": "Mall of Emirates", "city": "Dubai", "type": "High Street", "color": "#FF6B6B" }, "geometry": { "type": "Point", "coordinates": [55.2006, 25.1181] } },
      
      // Business: Teal (#00D1B2)
      { "type": "Feature", "properties": { "id": "dubai-difc", "name": "DIFC", "city": "Dubai", "type": "Business", "color": "#00D1B2" }, "geometry": { "type": "Point", "coordinates": [55.2872, 25.2130] } },
      { "type": "Feature", "properties": { "id": "dubai-marina", "name": "Dubai Marina", "city": "Dubai", "type": "Business", "color": "#00D1B2" }, "geometry": { "type": "Point", "coordinates": [55.1415, 25.0809] } }
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
