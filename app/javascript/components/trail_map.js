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
      center: [-122.961, 50.058],
      pitch: 75,
      bearing: 180,
      style: 'mapbox://styles/andycalder/ckq4pb5w13f0d17o83a6vghq3'
    });

    // this.map.on('load', function () {
    //   const loader = document.getElementById('preloader');
    //   if (loader) {
    //     loader.classList.remove('active');
    //   }
    // })

    const nav = new mapboxgl.NavigationControl();
    this.map.addControl(nav, 'bottom-left');

    this.photoMarkers = {};


    this.trailPopup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false
    });

    this.map.on('click', 'trails', (e) => {
      this.displayPhotoUploadForm(e);
    });

    this.map.on('mouseenter', 'trails', (e) => {
      this.displayTrailPopup(e);
    });

    this.map.on('mouseleave', 'trails', (e) => {
      this.trailPopup.remove();
    });

    document.addEventListener('showTrail', (e) => {
      this.showTrail(e.detail);
    });

    this.map.on('load', () => {
      const loader = document.getElementById('preloader');
      if (loader) {
        loader.classList.remove('active');
      }
      this.fetchPhotoData();
      this.animate();
    });
  }

  displayTrailPopup(e) {
    const name = e.features[0].properties.name;

    this.trailPopup.setLngLat(e.lngLat)
      .setHTML(`<p>${name}</p>`)
      .addTo(this.map);
  }

  animate() {
    this.map.easeTo({bearing: 160, duration: 10000});
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
          .setMaxWidth('500px')
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
      .setMaxWidth('500px')
      .setLngLat(e.lngLat)
      .setHTML(frame)
      .addTo(this.map);

    popup.on('close', this.fetchPhotoData.bind(this));
  }
}

export { TrailMap };
