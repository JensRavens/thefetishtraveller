import { Controller } from 'stimulus';

export default class extends Controller {
  static targets = ['target'];
  declare targetTarget: HTMLDivElement;
  declare hasTargetTarget: boolean;

  trigger(): void {
    if (this.hasTargetTarget) {
      this.targetTarget.click();
    }
  }
}
