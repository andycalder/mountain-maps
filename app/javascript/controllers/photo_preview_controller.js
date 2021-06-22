import { Controller } from "stimulus"

export default class extends Controller {
  static targets = [ "photoPreview", "photoInput" ];

  connect() {
    console.log('init sidebar controller');
  }

  showPhotoPreview() {
    console.log('showphotopreview');
    const [file] = this.photoInputTarget.files
    if (file) {
      this.photoPreviewTarget.src = URL.createObjectURL(file)
    }
  }
}
