import mapboxgl from 'mapbox-gl';
//import 'mapbox-gl/dist/mapbox-gl.css';

class TrailMap {
  constructor() {
    const mapElement = document.getElementById('map');
    mapboxgl.accessToken = mapElement.dataset.mapboxAccessToken;

    this.map = new mapboxgl.Map({
      container: 'map',
      zoom: 13.5,
      center: [-122.961, 50.058],
      pitch: 60,
      bearing: 180,
      style: 'mapbox://styles/andycalder/ckotle8ku65e617sf7wsin9x0'
    });

    const nav = new mapboxgl.NavigationControl();
    this.map.addControl(nav, 'top-left');

    this.photoMarkers = {};

    this.map.on('click', 'trails', (e) => {
      this.displayPhotoUploadForm(e);
    });

    document.addEventListener('showTrail', (e) => {
      this.showTrail(e.detail);
    });

    this.map.on('load', () => {
      this.fetchPhotoData();
    });

    document.querySelectorAll('.trails-path').forEach((element) => {
      const trail = JSON.parse(element.dataset.json);
      element.addEventListener('click', () => {
        const event = new CustomEvent('showTrail', { detail: trail });
        document.dispatchEvent(event)
      })
    });
  }

  fetchPhotoData() {
    fetch('/photos', { headers: { accept: "application/json" } })
      .then(response => response.json())
      .then(data => {
        this.addPhotoMarkers(data);
      });
  }

  addPhotoMarkers(photos) {
    photos.forEach((photo) => {
      if (!this.photoMarkers[photo.id]) {
        // Photo turbo frame
        const url = `/photos/${photo.id}`;
        const frame = `<turbo-frame id="photo-popup" src="${url}"></turbo-frame>`;

        // Photo popup
        const popup = new mapboxgl.Popup({ offset: 25 })
          .setHTML(frame);

        // Photo marker
        this.photoMarkers[photo.id] = new mapboxgl.Marker()
          .setLngLat([photo.longitude, photo.latitude])
          .setPopup(popup)
          .addTo(this.map);
      }
    });
  }

  showTrail(trail) {
    const start = [trail.start_lng, trail.start_lat];

    new mapboxgl.Popup()
      .setLngLat(start)
      .setHTML(`<p>${trail.name}</p>`)
      .addTo(this.map);

    this.map.easeTo({
      center: start
    });
  }

  displayPhotoUploadForm(e) {
    const name = e.features[0].properties.name;
    const { lng, lat } = e.lngLat;
    const url = encodeURI(`/photos/new?lng=${lng}&lat=${lat}&name=${name}`);
    const frame = `<turbo-frame id="photo-popup" src="${url}"></turbo-frame>`;

    const popup = new mapboxgl.Popup()
      .setLngLat(e.lngLat)
      .setHTML(frame)
      .addTo(this.map);

    popup.on('close', this.fetchPhotoData.bind(this));
  }
}

export { TrailMap };
