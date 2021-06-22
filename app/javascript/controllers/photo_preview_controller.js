import { Controller } from "stimulus"

export default class extends Controller {
  static targets = [ "photoPreview", "photoInput" ];

  showPhotoPreview() {
    const [file] = this.photoInputTarget.files
    if (file) {
      this.photoPreviewTarget.src = URL.createObjectURL(file)
      this.photoPreviewTarget.style.width = '100%';
    }
  }
}
