// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.

import "@hotwired/turbo-rails"
require("@rails/activestorage").start()
require("channels")

import { Turbo, cable } from '@hotwired/turbo-rails'


// Uncomment to copy all static images under ../images to the output folder and reference
// them with the image_pack_tag helper in views (e.g <%= image_pack_tag 'rails.png' %>)
// or the `imagePath` JavaScript helper below.
//
// const images = require.context('../images', true)
// const imagePath = (name) => images(name, true)


// ----------------------------------------------------
// Note(lewagon): ABOVE IS RAILS DEFAULT CONFIGURATION
// WRITE YOUR OWN JS STARTING FROM HERE 👇
// ----------------------------------------------------

// External imports
import "bootstrap";

// Internal imports
import { initMapbox } from '../plugins/init_mapbox';
import { initSearch, initDifficultyFilter } from '../plugins/init_shuffle';

//= require shuffle

document.addEventListener('turbo:load', () => {
  initMapbox();
  initSearch();
  initDifficultyFilter();
});
