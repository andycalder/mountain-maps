import mapboxgl from 'mapbox-gl';
//import 'mapbox-gl/dist/mapbox-gl.css';

const fetchPhotoData = (map) => {
  fetch('/photos', { headers: { accept: "application/json" } })
    .then(response => response.json())
    .then(data => {
      addPhotoMarkers(map, data);
    });
};

const addPhotoMarkers = (map, photos) => {
  photos.forEach((photo) => {
    // Photo turbo frame
    const url = `/photos/${photo.id}`;
    const frame = `<turbo-frame id="photo-popup" src="${url}"></turbo-frame>`;

    // Photo popup
    const popup = new mapboxgl.Popup({ offset: 25 })
      .setHTML(frame);

    // Photo marker
    new mapboxgl.Marker()
      .setLngLat([photo.longitude, photo.latitude])
      .setPopup(popup)
      .addTo(map);
  });
};

const displayPhotoUploadForm = (map, e) => {
  const name = e.features[0].properties.name;
  const { lng, lat } = e.lngLat;
  const url = encodeURI(`/photos/new?lng=${lng}&lat=${lat}&name=${name}`);
  const frame = `<turbo-frame id="photo-popup" src="${url}"></turbo-frame>`;

  const popup = new mapboxgl.Popup()
    .setLngLat(e.lngLat)
    .setHTML(frame)
    .setMaxWidth("350px")
    .addTo(map);
};

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
      displayPhotoUploadForm(map, e);
    });

    map.on('load', () => {
      fetchPhotoData(map);
    });
  }
};

export { initMapbox };
