import mapboxgl from 'mapbox-gl';
//import 'mapbox-gl/dist/mapbox-gl.css';
const iconColor = "rgb(169,169,169)";
const trailIcon = `<svg width="20px" height="22px" viewBox="0 0 20 22" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <g id="Page-1" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="Navigation,-Maps/point-direction-arrow" transform="translate(-2.000000, -1.000000)">
            <g id="Group" transform="translate(-0.005000, -0.005000)">
                <g stroke-linecap="round" stroke-linejoin="round" transform="translate(3.001250, 2.000833)" id="Path" stroke="${iconColor}" stroke-width="1.5">
                    <path d="M4.19774833,8.70662625 C3.80858625,9.10279125 3.17132083,9.10279125 2.78215875,8.70662625 C1.76273417,7.66819375 0,5.59232917 0,3.64851958 C0,1.63368042 1.56265083,0 3.49045375,0 C5.41825667,0 6.9809075,1.63368042 6.9809075,3.64851958 C6.9809075,5.59232917 5.21817333,7.66819375 4.19774833,8.70662625 Z"></path>
                    <path d="M3.48945665,3.34039125 C3.35139583,3.34039125 3.24034958,3.45243792 3.24034958,3.59049542 C3.24034958,3.7275525 3.35239625,3.83959917 3.48945665,3.83959917 C3.62751083,3.83959917 3.73855708,3.7275525 3.73855708,3.59049542 C3.7395575,3.45243792 3.62751083,3.34039125 3.48945665,3.34039125"></path>
                    <path d="M17.16715,15.5594804 L14.2769462,17.2691925 C13.9157958,17.4832817 13.9157958,18.0064996 14.2769462,18.2195883 L17.16715,19.9293004 C17.5383046,20.1493921 18.0075,19.8812804 18.0075,19.4501008 L18.0075,16.03868 C18.0075,15.6075004 17.5383046,15.3393888 17.16715,15.5594804 Z"></path>
                    <path d="M10.0041667,17.7053742 L5.00208333,17.7053742 C3.89662292,17.7053742 3.00125,16.8100013 3.00125,15.7045408 L3.00125,15.7045408 C3.00125,14.5990804 3.89662292,13.7037075 5.00208333,13.7037075 L10.6554379,13.7037075 C11.9529783,13.7037075 13.0054167,12.6512692 13.0054167,11.3537288 L13.0054167,11.3537288 C13.0054167,10.0561883 11.9529783,9.00375 10.6554379,9.00375 L8.00333333,9.00375"></path>
                </g>
                <polygon id="Path" points="0 0 24.01 0 24.01 24.01 0 24.01"></polygon>
            </g>
        </g>
    </g>
</svg>`;

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
      .setHTML(`
        <div class="trail-popup">
          ${trailIcon}
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
    this.map.setPaintProperty('trails', 'line-color', 'grey');
    this.map.setFilter('hover', ['==', ['get', 'name'], trail.name]);
    this.map.setFilter('hover case', ['==', ['get', 'name'], trail.name]);

    const start = [trail.start_lng, trail.start_lat];

    this.trailPopup.remove();
    this.trailPopup.setLngLat(start)
      .setHTML(`
        <div class="trail-popup">
          ${trailIcon}
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

    const popup = new mapboxgl.Popup()
      .setMaxWidth('500px')
      .setLngLat(e.lngLat)
      .setHTML(frame)
      .addTo(this.map);

    popup.on('close', this.fetchPhotoData.bind(this));
  }
}

export { TrailMap };
