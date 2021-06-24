import mapboxgl from 'mapbox-gl';
//import 'mapbox-gl/dist/mapbox-gl.css';
const images = {
  "beginner": "/assets/svg-difficulty-icons/beginner-747d3fcebed4abe8fe00fe6f8bc96730002eb1fdc342151ff1af25266898ec98.svg",
  "intermediate": "/assets/svg-difficulty-icons/intermediate-3120a323407f2c9e9c93424146aa4d48324134788391cd5b27a7b186da212cc7.svg",
  "advanced": "/assets/svg-difficulty-icons/advanced-ca04bed652a6dcb762ebde5db7e42269b28e501786ee4fb266266360e184bc33.svg",
  "expert": "/assets/svg-difficulty-icons/expert-f326f2ebfa99007acc95ee1a73e5ce306e3f5f6c15d7875e01a65f27e4412e15.svg",
  "proline": "/assets/svg-difficulty-icons/proline-09d48a1c0890f0c269f498279c6e1c19ab75371d02cecd03444e83f84e26fdc3.svg",
  "green": "/assets/svg-difficulty-icons/beginner-747d3fcebed4abe8fe00fe6f8bc96730002eb1fdc342151ff1af25266898ec98.svg",
  "blue": "/assets/svg-difficulty-icons/intermediate-3120a323407f2c9e9c93424146aa4d48324134788391cd5b27a7b186da212cc7.svg",
  "black": "/assets/svg-difficulty-icons/advanced-ca04bed652a6dcb762ebde5db7e42269b28e501786ee4fb266266360e184bc33.svg",
  "doubleblack": "/assets/svg-difficulty-icons/expert-f326f2ebfa99007acc95ee1a73e5ce306e3f5f6c15d7875e01a65f27e4412e15.svg",
  "red": "/assets/svg-difficulty-icons/proline-09d48a1c0890f0c269f498279c6e1c19ab75371d02cecd03444e83f84e26fdc3.svg",
};

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

    const nav = new mapboxgl.NavigationControl({ showCompass: false });
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
    const difficulty = e.features[0].properties.difficulty;

    this.map.getCanvas().style.cursor = 'pointer';
    this.map.setFilter('hover', ['==', ['get', 'name'], name]);

    this.trailPopup.setLngLat(e.lngLat)
      .setHTML(`
        <div class="trail-popup">
          <img src="${images[difficulty]}">
          <p>${name}</p>
        <div>
        `)
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

        const popupOptions = {
          closeButton: false,
          offset: 47
        };

        // Photo popup
        const popup = new mapboxgl.Popup(popupOptions)
          .setMaxWidth('500px')
          .setHTML(frame);

        const marker = document.createElement('div');
        marker.classList.add('photo-marker');

        // Photo marker
        this.photoMarkers[photo.id] = new mapboxgl.Marker({element: marker, offset: [0, -22]})
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
      .setHTML(`
        <div class="trail-popup">
          <img src="${images[trail.difficulty]}">
          <p>${trail.name}</p>
        <div>
        `)
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

    const popup = new mapboxgl.Popup({ closeButton: false })
      .setMaxWidth('500px')
      .setLngLat(e.lngLat)
      .setHTML(frame)
      .addTo(this.map);

    popup.on('close', this.fetchPhotoData.bind(this));
  }
}

export { TrailMap };
