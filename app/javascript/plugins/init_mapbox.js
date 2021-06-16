import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const initMapbox = () => {
  const mapElement = document.getElementById('map');

  if (mapElement) {
    mapboxgl.accessToken = mapElement.dataset.mapboxAccessToken;

    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-74.5, 40],
      zoom: 9
    });

    map.on('click', (e) => {
      const popup = new mapboxgl.Popup()
        .setLngLat(e.lngLat)
        .setHTML("<h2>Upload photo</h2>")
        .setMaxWidth("300px")
        .addTo(map);
    });
  }
};

export { initMapbox };
