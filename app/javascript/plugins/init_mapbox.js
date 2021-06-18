import mapboxgl from 'mapbox-gl';
//import 'mapbox-gl/dist/mapbox-gl.css';

const initMapbox = () => {
  const mapElement = document.getElementById('map');

  if (mapElement) {
    mapboxgl.accessToken = mapElement.dataset.mapboxAccessToken;

    const map = new mapboxgl.Map({
      container: 'map',
      zoom: 13,
      center: [-122.961, 50.058],
      pitch: 0,
      bearing: 80,
      style: 'mapbox://styles/andycalder/ckotle8ku65e617sf7wsin9x0'
    });

    map.on('click', 'trails', (e) => {

      const name = e.features[0].properties.name;
      const { lng, lat } = e.lngLat;
      const url = encodeURI(`/photos/new?lng=${lng}&lat=${lat}&name=${name}`);
      const frame = `<turbo-frame id="photo-upload" src="${url}"><p>Upload button</p></turbo-frame>`;

      const popup = new mapboxgl.Popup()
        .setLngLat(e.lngLat)
        .setHTML(frame)
        .setMaxWidth("300px")
        .addTo(map);
    });
  }
};

export { initMapbox };
