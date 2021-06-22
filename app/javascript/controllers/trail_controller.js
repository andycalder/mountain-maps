import { Controller } from "stimulus"

export default class extends Controller {
  static values = {
    json: String
  }

  connect() {
    console.log('init trail controller');
  }

  showTrail() {
    const trail = JSON.parse(this.jsonValue);
    const event = new CustomEvent('showTrail', { detail: trail });
    document.dispatchEvent(event);
  }
}
