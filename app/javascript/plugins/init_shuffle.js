import Shuffle from 'shufflejs'

// initialize shufflejs (yarn package -> added with yarn add shufflejs)
const initShuffle = () => {
  // get the container
  var element = document.querySelector('.my-shuffle-container');
  // get sizer... maybe not necessary... Im not sure (george)
  var sizer = element.querySelector('.my-sizer-element');

  if (element && sizer) {
    // initialize shuffle
    const shuffleInstance = new Shuffle(element, {
      itemSelector: '#trail-shuffle',
      sizer: sizer // could also be a selector: '.my-sizer-element'
    });
  // return the instance of shuffle (to be used in functions below)
  return shuffleInstance
  }
}

const initSearch = () => {
  // set the shuffle instance
  const shuffle = initShuffle();

  // add eventlistener to the search box (keyp event whenever key is released)
  document.querySelector('.search-box').addEventListener('keyup', (evt) => {
    // grab the search text (that the user just typed)
    var searchText = evt.currentTarget.value.toLowerCase();

    // finally use the shuffle instance to decide whether to show or hide a card
    shuffle.filter(function (element, shuffle) {
      // get the text of the data-title on the specific element (which is a trail card)
      var titleText = element.dataset.title.toLowerCase().trim();
      // return true or false to show or hide
      return titleText.indexOf(searchText) !== -1;
    });
  })
}

const initDifficultyFilter = () => {
  // set the shuffle instance
  const shuffle = initShuffle();

  // grab all the filter buttons and loop through them to add event listener to each
  document.querySelectorAll('#trail-difficulty-toggle').forEach((button) => {
    button.addEventListener('click', (evt) => {
      // grab the difficulty to shuffle, from the button just clicked (saved as data-difficulty atttribute)
      var buttonDifficulty = evt.currentTarget.dataset.difficulty.toLowerCase();

      // finally use the shuffle instance to decide whether to show or hide a card
      shuffle.filter(function (element, shuffle) {
        // element refers to each trail card.... the element inside of the container '.my-shuffle-container'
        var trailDifficulty = element.dataset.difficulty.toLowerCase().trim();
        // return true or false to show or hide
        return trailDifficulty.indexOf(buttonDifficulty) !== -1;
      });
    })

  })
}

export { initSearch, initDifficultyFilter }
