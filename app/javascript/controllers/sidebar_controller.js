import { Controller } from "stimulus"

export default class extends Controller {
  connect() {
    console.log('init sidebar controller');
    this.visible = false;
  }

  toggleSidebar() {
    this.visible = !this.visible;
    const event = new CustomEvent(this.visible ? 'hideSidebar' : 'showSidebar');
    document.dispatchEvent(event);
  }
}
