import { Controller } from "stimulus"

export default class extends Controller {
  static values = {
    disabledText: String
  }

  connect() {
  }

  disable(e) {
    // prevent the click event
    // e.preventDefault();
    this.element.disabled = true; // disable the button after the user click
    if (this.disabledTextValue) {
      this.element.innerHTML = `<div class="loading"><div class="loader"></div></div>`
    }
  }
}
