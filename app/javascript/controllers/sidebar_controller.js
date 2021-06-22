import { Controller } from "stimulus"

export default class extends Controller {
  connect() {
    console.log('init sidebar controller');
    this.visible = false;
  }

  toggleSidebar() {
    const event = new Event(this.visible ? 'hideSidebar' : 'showSidebar');
    this.visible = !this.visible;
    document.dispatchEvent(event);
  }

  resetCamera() {
    const event = new Event('resetCamera');
    document.dispatchEvent(event);
  }
}
