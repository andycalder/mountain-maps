import mapboxgl from 'mapbox-gl';
//import 'mapbox-gl/dist/mapbox-gl.css';

class TrailMap {
  constructor() {
    const mapElement = document.getElementById('map');
    if (!mapElement) return;
    mapboxgl.accessToken = mapElement.dataset.mapboxAccessToken;

    this.map = new mapboxgl.Map({
      container: 'map',
      zoom: 13.5,
      //center: [-122.961, 50.058],
      center: [-122.964, 50.087],
      pitch: 75,
      bearing: 180,
      style: 'mapbox://styles/andycalder/ckq4pb5w13f0d17o83a6vghq3'
    });

    const nav = new mapboxgl.NavigationControl();
    this.map.addControl(nav, 'bottom-left');

    this.photoMarkers = {};

    this.trailPopup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false
    });

    this.map.on('click', 'trails', e => this.displayPhotoUploadForm(e));
    this.map.on('mouseenter', 'trails', e => this.displayTrailPopup(e));
    this.map.on('mouseleave', 'trails', e => this.hideTrailPopup());

    document.addEventListener('showTrail', e => this.showTrail(e.detail));
    document.addEventListener('resetCamera', () => this.resetCamera());
    document.addEventListener('showSidebar', e => this.showSidebar());
    document.addEventListener('hideSidebar', e => this.hideSidebar());

    this.map.on('load', () => {
      const loader = document.getElementById('preloader');
      if (loader) {
        loader.classList.remove('active');
      }
      this.fetchPhotoData();
      this.animate();
    });
  }

  showSidebar() {
    const width = document.getElementById('offcanvasExample').clientWidth;

    this.map.easeTo({
      padding: { top: 0, bottom: 0, left: 0, right: width }
    });
  }

  hideSidebar() {
    this.map.easeTo({
      padding: { top: 0, bottom: 0, left: 0, right: 0 }
    });
  }

  displayTrailPopup(e) {
    const name = e.features[0].properties.name;

    this.map.getCanvas().style.cursor = 'pointer';
    this.map.setFilter('hover', ['==', ['get', 'name'], name]);

    this.trailPopup.setLngLat(e.lngLat)
      .setHTML(`<p>${name}</p>`)
      .addTo(this.map);
  }

  hideTrailPopup() {
    this.map.getCanvas().style.cursor = '';
    this.map.setFilter('hover', ['==', ['get', 'name'], '']);
    this.trailPopup.remove();
  }

  animate() {
    this.map.easeTo({bearing: 160, duration: 10000});
  }

  fetchPhotoData() {
    fetch('/photos', { headers: { accept: "application/json" } })
      .then(response => response.json())
      .then(data => this.addPhotoMarkers(data));
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
    this.map.setPaintProperty('trails', 'line-color', 'grey');
    this.map.setFilter('hover', ['==', ['get', 'name'], trail.name]);
    this.map.setFilter('hover case', ['==', ['get', 'name'], trail.name]);

    const start = [trail.start_lng, trail.start_lat];

    this.trailPopup.remove();
    this.trailPopup.setLngLat(start)
      .setHTML(`<p>${trail.name}</p>`)
      .addTo(this.map);

    this.map.flyTo({
      center: start,
      zoom: 14.5
    });
  }

  resetCamera() {
    this.map.setPaintProperty('trails', 'line-color', 'yellow');
    this.map.setFilter('hover', ['==', ['get', 'name'], '']);
    this.map.setFilter('hover case', ['==', ['get', 'name'],'']);

    this.trailPopup.remove();

    this.map.flyTo({
      center: [-122.964, 50.087],
      zoom: 13.5
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
