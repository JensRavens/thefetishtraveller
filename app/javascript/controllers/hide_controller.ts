import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
  static targets = ['target'];
  declare targetTarget: HTMLDivElement;

  connect(): void {
    this.targetTarget.classList.add('hidden');
  }

  toggle(): void {
    this.targetTarget.classList.toggle('hidden');
  }
}
