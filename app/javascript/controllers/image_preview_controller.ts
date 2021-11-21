import { readBytesUrl } from 'lib/files';
import { Controller } from 'stimulus';

export default class extends Controller {
  static targets = ['preview'];
  declare previewTarget: HTMLImageElement;

  async change(event: Event): Promise<void> {
    const files = Array.from((event.target as HTMLInputElement).files);
    this.previewTarget.src = await readBytesUrl(files[0], true);
  }
}
