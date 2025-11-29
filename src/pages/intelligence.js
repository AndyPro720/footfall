import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export const Intelligence = {
  render: () => {
    return `
      <div class="page intelligence-page">
        <div id="map-container" style="height: 100vh; width: 100%;"></div>
        <div class="watermark-overlay">TO BE INTEGRATED</div>
      </div>
    `;
  },
  afterRender: () => {
    // Initialize Leaflet Map
    const map = L.map('map-container').setView([20.5937, 78.9629], 5); // India Center

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(map);
  }
};
