import { Controller } from "stimulus"

export default class extends Controller {
  connect() {
    console.log('upload button controller connected');
  }

  disable() {
    this.element.innerHTML = `<div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>`
  }
}
