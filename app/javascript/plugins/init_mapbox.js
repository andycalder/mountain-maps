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

const showTrail = (map, trail) => {
  const start = [trail.start_lng, trail.start_lat];

  new mapboxgl.Popup()
    .setLngLat(start)
    .setHTML(`<p>${trail.name}</p>`)
    .addTo(map);

  map.easeTo({
    center: start
  });

  // map.fitBounds([
  //   [-122.961707, 50.077298], // northeastern corner of the bounds
  //   [-122.957467, 50.05876] // southwestern corner of the bounds
  // ]);
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
      zoom: 13.5,
      center: [-122.961, 50.058],
      pitch: 60,
      bearing: 180,
      style: 'mapbox://styles/andycalder/ckotle8ku65e617sf7wsin9x0'
    });

    const nav = new mapboxgl.NavigationControl();
    map.addControl(nav, 'top-left');

    map.on('click', 'trails', (e) => {
      displayPhotoUploadForm(map, e);
    });

    document.addEventListener('showTrail', (e) => {
      showTrail(map, e.detail);
    });

    map.on('load', () => {
      fetchPhotoData(map);
    });

    document.querySelectorAll('.trails-path').forEach((element) => {
      const trail = JSON.parse(element.dataset.json);
      element.addEventListener('click', () => {
        const event = new CustomEvent('showTrail', { detail: trail });
        document.dispatchEvent(event)
      })
    });
  }
};

export { initMapbox };
