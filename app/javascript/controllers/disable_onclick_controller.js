import { Controller } from "stimulus"

export default class extends Controller {
  static values = {
    disabledText: String
  }

  connect() {
    console.log("hello there, i will disable onclick")
  }

  disable(e) {
    // e.preventDefault()
    console.log("clicked!")
    this.element.disabled = true;
    if (this.disabledTextValue) {
      this.element.innerHTML = `<div class="loading"><div class="loader"></div></div>`
    }
  }
}
