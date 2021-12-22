import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
  static targets = ['target'];
  declare targetTarget: HTMLDivElement;

  connect(): void {
    this.targetTarget.hidden = true;
  }

  toggle(): void {
    this.targetTarget.hidden = !this.targetTarget.hidden;
  }
}
