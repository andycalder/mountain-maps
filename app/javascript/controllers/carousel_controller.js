import { Controller } from 'stimulus';
import Shuffle from 'shufflejs'

export default class extends Controller {
  static targets = ["container"]
  static values = {
    images: Array
  }

  connect() {
    console.log(this.imagesValue);

  }
 
}
