import { Controller } from 'stimulus';

export default class extends Controller {
  connect(): void {
    const script = (this.element as HTMLDivElement).innerText;
    eval(script);
    this.element.remove();
  }
}
