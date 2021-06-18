import { Controller } from 'stimulus';
import Shuffle from 'shufflejs'

export default class extends Controller {
  static targets = ["elements", 'toggle', 'search']
  static values = {
    element: String
  }

  connect() {
    console.log("hello from StimulusJS");
    console.log(this.searchTarget);
    console.log(this.elementValue);

    this.initShuffle()

    console.log(this.shuffle);

    this.initSearch()
    this.initFilters()
  }

  initShuffle() {
    // get sizer... maybe not necessary... Im not sure (george)
    const sizer = this.elementsTarget.querySelector('.my-sizer-element');

    if (this.hasElementsTarget && sizer) {
      // initialize shuffle
      this.shuffle = new Shuffle(this.elementsTarget, {
        itemSelector: this.elementValue,
        sizer: sizer // could also be a selector: '.my-sizer-element'
      });
    }
  }

  initSearch() {
    // add eventlistener to the search box (keyp event whenever key is released)
    this.searchTarget.addEventListener('keyup', (evt) => {
      // grab the search text (that the user just typed)
      const searchText = evt.currentTarget.value.toLowerCase();

      // finally use the shuffle instance to decide whether to show or hide a card
      this.shuffle.filter(function (element, shuffle) {
        // get the text of the data-title on the specific element (which is a trail card)
        const titleText = element.dataset.title.toLowerCase().trim();
        // return true or false to show or hide
        return titleText.indexOf(searchText) !== -1;
      });
    })
  }

  removeAllFilters(e) {
    e.currentTarget.classList.remove('active')
    e.currentTarget.dataset.action = ''
    this.shuffle.filter()
  }

  initFilters() {
    // grab all the filter buttons and loop through them to add event listener to each
    this.toggleTargets.forEach((button) => {
      button.addEventListener('click', (evt) => {

        // remove active class from all toggleTargets
        this.toggleTargets.forEach((button) => {
          button.classList.remove('active')
        })
        // and then add active to this single one with evt.currentTarget
        evt.currentTarget.classList.add('active')
        evt.currentTarget.dataset.action = 'click->filter#removeAllFilters'

        // grab the difficulty to shuffle, from the button just clicked (saved as data-difficulty atttribute)
        const buttonDifficulty = evt.currentTarget.dataset.difficulty.toLowerCase();

        // finally use the shuffle instance to decide whether to show or hide a card
        this.shuffle.filter(function (element, shuffle) {
          // element refers to each trail card.... the element inside of the container '.my-shuffle-container'
          const trailDifficulty = element.dataset.difficulty.toLowerCase().trim();
          // return true or false to show or hide
          return trailDifficulty.indexOf(buttonDifficulty) !== -1;
        });
      })

    })
  }
}
